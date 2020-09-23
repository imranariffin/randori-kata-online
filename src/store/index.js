import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'

import { loggerMiddleware } from '../logging/middlewares'
import { logger } from '../logging/logger'

import reducer from './reducer'
import { runAllSagas } from './sagas'

const initStore = () => {
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    reducer,
    compose(
      applyMiddleware(
        ...[
          loggerMiddleware(logger),
          sagaMiddleware
        ]
      )
    )
  )
  sagaMiddleware.run(runAllSagas)
  return store
}

export default initStore()
