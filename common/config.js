// const profile = "dev"; //dev
const profile = "pro"; //pro

let config = require(`config-${profile}.js`)

module.exports = config