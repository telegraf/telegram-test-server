const test = require('ava')
const Telegraf = require('telegraf')
const getPort = require('get-port')
const TelegramServer = require('../')
const { wait } = require('../lib/utils')

test('simple bot', async (t) => {
  const port = await getPort()
  const server = new TelegramServer({ port })
  server.start()

  const user = server.createUser()
  const bot = server.createBot()
  const chat = user.startBot(bot)

  const exampleBot = new Telegraf(bot.token, {
    telegram: {
      apiRoot: server.getApiEndpoint()
    }
  })
  exampleBot.start(({ reply }) => reply('Ola'))
  exampleBot.startPolling()

  await wait(100)

  t.is(chat.history.length, 2)
  t.is(chat.history[1].message.text, 'Ola')
})
