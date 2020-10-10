import socketio from 'socket.io-client'
import { eventChannel } from 'redux-saga'
import { call, delay, put, spawn, take, takeEvery } from 'redux-saga/effects'

import { Env } from '../envs'
import logging from '../logging/logger'

import { codeSyncReconnect, codeSyncEmit, codeSyncInit, codeSyncReceived, writerSwitch } from './actions'
import { SocketEventNames } from './constants'

const logger = logging.getLogger('code-sync/sagas')

export function* runCodeSyncSagas() {
  yield takeEvery(codeSyncInit.INIT_TYPE, handleCodeSyncInit)
  yield takeEvery(codeSyncEmit.INIT_TYPE, handleCodeSyncEmit)
  yield spawn(listenToSocketEvents)
}

let socket

const createSocketChannel = (socket) => {
  return eventChannel(emit => {
    socket.on(SocketEventNames.CodeSync, (event) => {
      emit(event)
    })

    socket.on(SocketEventNames.WriterSwitch, (event) => {
      event.messageType = SocketEventNames.WriterSwitch
      emit({ ...event, payload: { writer: event.writer } })
    })

    socket.on(SocketEventNames.Connect, () => {
      emit({ messageType: SocketEventNames.Connect, payload: { socketId: socket.id } })
    })

    return () => {
      socket.off(SocketEventNames.CodeSync, () => {
        logger.log(`unsubscribing from '${SocketEventNames.CodeSync}'`)
      })
      logger.log(`Closing connection '${socket.id}'`)
      socket.close()
    }
  })
}

export function* handleCodeSyncInit() {
  yield call(logger.log, 'handling codeSyncInit')
  socket = yield call(socketio, `${Env.API_HOST}:${Env.API_PORT}`)
  const onConnect = () => new Promise((resolve) => {
    socket.on('connect', () => {
      resolve()
    })
  })
  yield call(onConnect)
  yield delay(500)
  yield call(logger.log, 'Connected, socketid =', socket.id)
  yield put(codeSyncInit.success(socket.id))
}

function* listenToSocketEvents() {
  yield take(codeSyncInit.SUCCESS_TYPE)
  yield call(logger.log, 'Creating socket channel')
  const socketChannel = yield call(createSocketChannel, socket)
  yield call(logger.log, 'socket =', socket)
  yield takeEvery(socketChannel, handleSocketEvents)
}

function* handleSocketEvents(event) {
  yield call(logger.log, 'Handling socket event [event =', event, ']')
  switch (event.messageType) {
    case SocketEventNames.CodeSync: {
      yield put(codeSyncReceived.success(event.payload.code))
      break
    }
    case SocketEventNames.WriterSwitch: {
      yield put(writerSwitch.success(event.payload.writer))
      break
    }
    case SocketEventNames.Connect: {
      yield put(codeSyncReconnect.success(event.payload.socketId))
      break
    }
    default:
      return
  }
}

export function* handleCodeSyncEmit(action) {
  yield call(logger.log, 'start handleCodeSyncEmit, action =', action)
  const { payload: { code } } = action
  const event = {
    messageType: SocketEventNames.CodeSync,
    payload: { code }
  }
  socket.emit(SocketEventNames.CodeSync, event)
}
