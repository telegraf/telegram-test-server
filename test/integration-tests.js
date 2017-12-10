const test = require('ava')
const Telegraf = require('telegraf')
const TelegramServer = require('../')
const { wait } = require('../lib/utils')

const BotConfig = {
  apiRoot: 'http://0.0.0.0:4001',
  agent: null
}

test('simple bot', async (t) => {
  const server = new TelegramServer({ port: 4001 })
  server.start()

  const userHandle = server.createUser()
  const botHandle = server.createBot()
  const chatHandle = userHandle.startBot(botHandle)

  const bot = new Telegraf(botHandle.token, { telegram: BotConfig })
  bot.start(({ reply }) => reply('Ola'))
  bot.startPolling()

  await wait(100)

  t.is(chatHandle.history.length, 2)
  t.is(chatHandle.history[1].message.text, 'Ola')
})
