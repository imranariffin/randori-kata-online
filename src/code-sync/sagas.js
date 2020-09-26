import socketio from 'socket.io-client'
import { eventChannel } from 'redux-saga'
import { call, delay, put, spawn, take, takeEvery } from 'redux-saga/effects'

import { codeSyncReconnect, codeSyncEmit, codeSyncInit, codeSyncReceived, writerSwitch } from './actions'
import { SocketEventNames } from './constants'

export function* runCodeSyncSagas() {
  yield call(console.log, 'running code sync sagas')
  yield takeEvery(codeSyncInit.INIT_TYPE, handleCodeSyncInit)
  yield takeEvery(codeSyncEmit.INIT_TYPE, handleCodeSyncEmit)
  yield spawn(listenToSocketEvents)
}

let socket

const createSocketChannel = (socket) => {
  console.log('start createSocketChannel, socket =', socket)
  return eventChannel(emit => {
    socket.on(SocketEventNames.CodeSync, (event) => {
      console.log(`${SocketEventNames.CodeSync}, event =`, event)
      emit(event)
    })

    socket.on(SocketEventNames.WriterSwitch, (event) => {
      console.log(`${SocketEventNames.WriterSwitch}, event =`, event)
      event.messageType = SocketEventNames.WriterSwitch
      emit({ ...event, payload: { writer: event.writer } })
    })

    socket.on(SocketEventNames.Connect, () => {
      console.log(`connect, event =`, undefined)
      emit({ messageType: SocketEventNames.Connect, payload: { socketId: socket.id } })
    })

    return () => {
      socket.off(SocketEventNames.CodeSync, () => {
        console.log(`unsubscribing from '${SocketEventNames.CodeSync}'`)
      })
      console.log(`Closing connection '${socket.id}'`)
      socket.close()
    }
  })
}

export function* handleCodeSyncInit() {
  yield call(console.log, 'handling codeSyncInit')
  socket = yield call(socketio, 'http://localhost:3000')
  const onConnect = () => new Promise((resolve) => {
    socket.on('connect', () => {
      resolve()
    })
  })
  yield call(onConnect)
  yield delay(500)
  yield call(console.log, 'Connected, socketid =', socket.id)
  yield put(codeSyncInit.success(socket.id))
}

function* listenToSocketEvents() {
  yield take(codeSyncInit.SUCCESS_TYPE)
  const socketChannel = yield call(createSocketChannel, socket)
  yield takeEvery(socketChannel, handleSocketEvents)
}

function* handleSocketEvents(event) {
  console.log('handleSocketEvents, event =', event)
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
  yield call(console.log, 'start handleCodeSyncEmit, action =', action)
  const { payload: { code } } = action
  const event = {
    messageType: SocketEventNames.CodeSync,
    payload: { code }
  }
  socket.emit(SocketEventNames.CodeSync, event)
}
