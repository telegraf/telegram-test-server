const Koa = require('koa')
const koaBody = require('koa-body')
const koaRouter = require('koa-router')
const assert = require('http-assert')
const Store = require('./store')
const User = require('./models/user')
const Bot = require('./models/bot')
const Chat = require('./models/chat')

class TelegramServer {
  constructor (options) {
    this.options = { port: 4000, ...options }
    this.store = new Store()
  }

  createUser (info) {
    const user = new User(this, info)
    return this.store.saveUser(user)
  }

  createBot (info) {
    const bot = new Bot(this, info)
    return this.store.saveBot(bot)
  }

  createChat (owner, info) {
    const chat = new Chat(owner, info)
    return this.store.saveChat(chat)
  }

  findChat (chatId) {
    return this.store.findChat(chatId)
  }

  getApiEndpoint () {
    return `http://${this.options.host || '0.0.0.0'}:${this.options.port}`
  }

  start () {
    const router = koaRouter()
    router.all('/bot:token/:method', async (ctx) => {
      try {
        const { token, method } = ctx.params
        const bot = this.store.findBotByToken(token)
        assert(bot, 401, 'Unauthorized')
        const result = await Promise.resolve(
          bot.handleCall(method.toLowerCase(), {
            ...ctx.request.query,
            ...ctx.request.body
          })
        )
        assert(result, 404, 'Not Found: method not found')
        ctx.body = {
          ok: true,
          result
        }
      } catch (err) {
        ctx.status = err.status || 500
        ctx.body = {
          ok: false,
          error_code: ctx.status,
          description: err.message
        }
      }
    })
    const app = new Koa()
    app.use(koaBody({ multipart: true }))
    app.use(router.routes())
    this.server = app.listen(this.options.port, this.options.host)
  }

  stop () {
    this.server && this.server.close()
  }
}

module.exports = TelegramServer
