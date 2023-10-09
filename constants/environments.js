const IS_DEV = process.env.NODE_ENV === 'development'
const IS_STG = process.env.NODE_ENV === 'stg'
const IS_PRO = process.env.NODE_ENV === 'production'

module.exports = {IS_DEV, IS_PRO, IS_STG}