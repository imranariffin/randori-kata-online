import { Env } from '../envs'

const _log = (...args) => {
  if (!Env.LOGGING_ENABLED) {
    return
  }
  const timestamp = `[${new Date().toISOString()}]`
  console.log(timestamp, ...args)
}

const getLogger = (namespace) => {
  const namespacePattern = `[${namespace}]`
  return {
    log: (...args) => _log(namespacePattern, ...args)
  }
}

export default {
  log: _log,
  getLogger
}
