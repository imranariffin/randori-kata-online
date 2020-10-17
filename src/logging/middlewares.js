export const loggerMiddleware = (logger) => (store) => (next) => (action) => {
  const prevState = store.getState()
  const returnedAction = next(action)
  const nextState = store.getState()

  logger.log('prevState', prevState)
  logger.log('action', action)
  logger.log('nextState', nextState)

  return returnedAction
}
