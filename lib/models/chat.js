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

  hasAccess (userId) {
    return this.owner.info.id === userId || this.participants.some(({ info }) => info.id === userId)
  }

  postMessage (author, message) {
    const update = {
      message: {
        message_id: this.history.length + 1,
        chat: this.info,
        from: author.info,
        date: 0,
        ...message
      }
    }
    this.history.push(update)
    if (!author.info.is_bot) {
      this.participants
        .filter(({ info }) => info.is_bot)
        .forEach((bot) => bot.queueUpdate(update))
    }
    return update.message
  }
}

module.exports = Chat
