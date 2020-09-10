import socketio from 'socket.io-client'
import { call, takeEvery } from 'redux-saga/effects'

import { initCodeSync } from './actions'

export function* runCodeSyncSagas() {
  yield call(console.log, 'running code sync sagas')
  yield takeEvery(initCodeSync.INIT_TYPE, handleInitCodeSync)
}

let socket

export function* handleInitCodeSync() {
  yield call(console.log, 'handling initCodeSync')
  socket = yield call(socketio, 'http://localhost:3000')
  socket.on('connect', () => {
    console.log('Connected')
  })
}
