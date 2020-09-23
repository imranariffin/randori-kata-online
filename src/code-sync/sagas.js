import socketio from 'socket.io-client'
import { call, delay, put, takeEvery } from 'redux-saga/effects'

import { initCodeSync } from './actions'

export function* runCodeSyncSagas() {
  yield call(console.log, 'running code sync sagas')
  yield takeEvery(initCodeSync.INIT_TYPE, handleInitCodeSync)
}

let socket

export function* handleInitCodeSync() {
  yield call(console.log, 'handling initCodeSync')
  socket = yield call(socketio, 'http://localhost:3000')
  const onConnect = () => new Promise((resolve) => {
    socket.on('connect', () => {
      resolve()
    })
  })
  yield call(onConnect)
  yield delay(500)
  yield call(console.log, 'Connected')
  yield put(initCodeSync.success())
}
