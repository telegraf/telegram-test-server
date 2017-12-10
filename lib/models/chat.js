const casual = require('casual')

class Chat {
  constructor (owner, info) {
    this.owner = owner
    this.info = {
      id: casual.integer(-10000000, -1000000),
      type: 'private',
      ...info
    }
    this.participants = []
    this.history = []
  }

  invite (user) {
    this.participants.push(user)
  }

  leave (userId) {
    this.participants = this.participants.filter(({ info }) => info.id !== userId)
  }

  checkAccess (userId) {
    return this.owner.info.id === userId || this.participants.some(({ info }) => info.id === userId)
  }

  notifyBots (update) {
    this.participants
      .filter(({ info }) => info.is_bot)
      .forEach((bot) => bot.queueUpdate(update))
  }

  postMessage (author, message) {
    const update = {
      message: {
        message_id: this.history.filter((update) => update.message).length + 1,
        chat: this.info,
        from: author.info,
        date: 0,
        ...message
      }
    }
    this.history.push(update)
    if (!author.info.is_bot) {
      this.notifyBots(update)
    }
    return update.message
  }

  postCbQuery (user, message, data) {
    const update = {
      callback_query: {
        id: casual.integer(1000000),
        from: user.info,
        message: message,
        data: data
      }
    }
    this.history.push(update)
    this.notifyBots(update)
    return update.callback_query
  }

  postCbQueryAnswer (user, cbQuery) {
    const update = { callback_query_answer: cbQuery }
    this.history.push(update)
    return cbQuery
  }
}

module.exports = Chat
