const test = require('ava')
const { Telegram } = require('telegraf')
const TelegramServer = require('../')

const BotConfig = {
  apiRoot: 'http://0.0.0.0:4000',
  agent: null
}

let server
let userHandle
let botHandle
let chatHandle

test.before(async (t) => {
  server = new TelegramServer({ port: 4000 })
  botHandle = server.createBot()
  userHandle = server.createUser()
  chatHandle = userHandle.startBot(botHandle)
  server.start()
})

test.after.always((t) => server.stop())

test('get me with invalid token', async (t) => {
  const client = new Telegram('fake-token', BotConfig)
  await t.throws(client.getMe())
})

test('get me', async (t) => {
  const client = new Telegram(botHandle.token, BotConfig)
  const { username } = await client.getMe()
  t.is(botHandle.info.username, username)
})

test('get chat', async (t) => {
  const client = new Telegram(botHandle.token, BotConfig)
  const { type } = await client.getChat(chatHandle.info.id)
  t.is(type, 'private')
})

test('get updates', async (t) => {
  const client = new Telegram(botHandle.token, BotConfig)
  const updates = await client.getUpdates()
  t.is(updates.length, 1)
})
