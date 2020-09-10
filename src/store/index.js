import { createStore, applyMiddleware, compose } from 'redux'

import { loggerMiddleware } from '../logging/middlewares'
import { logger } from '../logging/logger'

const initStore = () => {
  const store = createStore(
    (state = { codeSync: 'zz' }) => state,
    compose(
      applyMiddleware(
        ...[
          loggerMiddleware(logger),
        ]
      )
    )
  )
  return store
}

export default initStore()
