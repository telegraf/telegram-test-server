class NaiveStore {
  constructor () {
    this.users = []
    this.bots = []
    this.channels = []
    this.chats = []
  }

  saveUser (user) {
    this.users.push(user)
    return user
  }

  saveBot (bot) {
    this.bots.push(bot)
    return bot
  }

  saveChat (chat) {
    this.chats.push(chat)
    return chat
  }

  findBotByToken (token) {
    return this.bots.find((bot) => bot.token === token)
  }

  findChat (chatId) {
    return this.chats.find((chat) => chat.info.id === chatId)
  }

  findChatByCbQuery (cbQueryId) {
    return this.chats.find((chat) => chat.history.some((update) => update.callback_query && update.callback_query.id === cbQueryId))
  }
}

module.exports = NaiveStore
