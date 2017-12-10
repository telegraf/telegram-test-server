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

  const apiRoot = server.getApiEndpoint()
  const exampleBot = new Telegraf(bot.token, { telegram: { apiRoot } })
  exampleBot.start(({ reply }) => reply('Ola'))
  exampleBot.action('cat', async ({ answerCbQuery, reply }) => {
    await answerCbQuery('🐈')
    await reply('Meow')
  })
  exampleBot.startPolling()

  await wait()
  t.is(chat.history.length, 2)
  t.is(chat.history[1].message.text, 'Ola')

  chat.postCbQuery(user, chat.history[1].message, 'cat')

  await wait()
  t.is(chat.history.length, 5)
  t.truthy(chat.history[3].callback_query_answer)
  t.is(chat.history[3].callback_query_answer.text, '🐈')
  t.is(chat.history[4].message.text, 'Meow')
})
