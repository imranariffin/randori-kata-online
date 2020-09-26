import socketio from 'socket.io-client'
import { eventChannel } from 'redux-saga'
import { call, delay, put, spawn, take, takeEvery } from 'redux-saga/effects'

import { codeSyncReconnected, emitCodeSync, initCodeSync, receiveCodeSync, switchWriter } from './actions'
import { EventNames } from './constants'

export function* runCodeSyncSagas() {
  yield call(console.log, 'running code sync sagas')
  yield takeEvery(initCodeSync.INIT_TYPE, handleInitCodeSync)
  yield takeEvery(emitCodeSync.INIT_TYPE, handleEmitCodeSync)
  yield spawn(listenToSocketEvents)
}

let socket

const createSocketChannel = (socket) => {
  console.log('start createSocketChannel, socket =', socket)
  return eventChannel(emit => {
    socket.on(EventNames.CodeSync, (event) => {
      console.log(`${EventNames.CodeSync}, event =`, event)
      emit(event)
    })

    socket.on(EventNames.WriterSwitch, (event) => {
      console.log(`${EventNames.WriterSwitch}, event =`, event)
      event.messageType = EventNames.WriterSwitch
      emit({ ...event, payload: { writer: event.writer } })
    })

    socket.on(EventNames.Connect, () => {
      console.log(`connect, event =`, undefined)
      emit({ messageType: EventNames.Connect, payload: { socketId: socket.id } })
    })

    return () => {
      socket.off(EventNames.CodeSync, () => {
        console.log(`unsubscribing from '${EventNames.CodeSync}'`)
      })
      console.log(`Closing connection '${socket.id}'`)
      socket.close()
    }
  })
}

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
  yield call(console.log, 'Connected, socketid =', socket.id)
  yield put(initCodeSync.success(socket.id))
}

function* listenToSocketEvents() {
  yield take(initCodeSync.SUCCESS_TYPE)
  const socketChannel = yield call(createSocketChannel, socket)
  yield takeEvery(socketChannel, handleSocketEvents)
}

function* handleSocketEvents(event) {
  console.log('handleSocketEvents, event =', event)
  switch (event.messageType) {
    case EventNames.CodeSync: {
      yield put(receiveCodeSync.success(event.payload.code))
      break
    }
    case EventNames.WriterSwitch: {
      yield put(switchWriter.success(event.payload.writer))
      break
    }
    case EventNames.Connect: {
      yield put(codeSyncReconnected.success(event.payload.socketId))
      break
    }
    default:
      return
  }
}

export function* handleEmitCodeSync(action) {
  yield call(console.log, 'start handleEmitCodeSync, action =', action)
  const { payload: { code } } = action
  const event = {
    messageType: EventNames.CodeSync,
    payload: { code }
  }
  socket.emit(EventNames.CodeSync, event)
}
