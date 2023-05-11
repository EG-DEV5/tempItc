const moment = require('moment-timezone')

moment.tz.setDefault(moment.tz.guess())

moment.defaultFormat = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]'

module.exports = moment
