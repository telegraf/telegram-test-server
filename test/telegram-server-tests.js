const test = require('ava')
const { Telegram } = require('telegraf')
const getPort = require('get-port')
const TelegramServer = require('../')

test('get me with invalid token', async (t) => {
  const port = await getPort()
  const server = new TelegramServer({ port })
  server.start()
  const client = new Telegram('fake-token', {
    apiRoot: server.getApiEndpoint()
  })
  await t.throws(client.getMe())
  server.stop()
})

test('get me', async (t) => {
  const port = await getPort()
  const server = new TelegramServer({ port })
  const bot = server.createBot()
  server.start()
  const client = new Telegram(bot.token, {
    apiRoot: server.getApiEndpoint()
  })
  const { username } = await client.getMe()
  t.is(bot.info.username, username)

  server.stop()
})

test('get chat', async (t) => {
  const port = await getPort()
  const server = new TelegramServer({ port })
  const bot = server.createBot()
  const user = server.createUser()
  const chat = user.startBot(bot)
  server.start()
  const client = new Telegram(bot.token, {
    apiRoot: server.getApiEndpoint()
  })
  const { type } = await client.getChat(chat.info.id)
  t.is(type, 'private')
  server.stop()
})

test('get updates', async (t) => {
  const port = await getPort()
  const server = new TelegramServer({ port })
  const bot = server.createBot()
  const user = server.createUser()
  user.startBot(bot)
  server.start()
  const client = new Telegram(bot.token, {
    apiRoot: server.getApiEndpoint()
  })
  const updates = await client.getUpdates()
  t.is(updates.length, 1)
})
