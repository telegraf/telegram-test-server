module.exports = {
  wait: (ms = 100) => new Promise((resolve, reject) => setTimeout(resolve, ms))
}
