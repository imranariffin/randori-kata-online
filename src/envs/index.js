import { EnvVarInvalidBoolean } from '../errors'

const stringToBoolean = (str) => {
  if (str === 'true') {
    return true
  } else if (str === 'false') {
    return false
  } else if (!isNaN(str)) {
    return Boolean(Number(str))
  }
  throw new EnvVarInvalidBoolean(str)
}

export const Env = {
  API_HOST: process.env.REACT_APP_RANDORIKATA__WEB__API_HOST,
  API_PORT: process.env.REACT_APP_RANDORIKATA__WEB__API_PORT,
  CI: stringToBoolean(process.env.REACT_APP_RANDORIKATA__WEB__CI),
  LOGGING_ENABLED: stringToBoolean(process.env.REACT_APP_RANDORIKATA__WEB__LOGGING_ENABLED),
}
