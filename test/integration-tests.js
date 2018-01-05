const test = require('ava')
const Telegraf = require('telegraf')
const TelegramServer = require('../')

const wait = (ms = 100) => new Promise((resolve, reject) => setTimeout(resolve, ms))

function startBot (token, apiRoot) {
  const exampleBot = new Telegraf(token, { telegram: { apiRoot } })
  exampleBot.start(({ reply }) => reply('Ola'))
  exampleBot.action('cat', async ({ answerCbQuery, reply }) => {
    await answerCbQuery('🐈')
    await reply('Meow')
  })
  exampleBot.startPolling()
}

test('example bot', async (t) => {
  const server = new TelegramServer()
  server.start()

  const { user, bot, chat } = server.createSandbox()

  startBot(bot.token, server.getApiEndpoint())

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
