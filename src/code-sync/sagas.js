import socketio from 'socket.io-client'
import { eventChannel } from 'redux-saga'
import { call, delay, put, spawn, take, takeEvery } from 'redux-saga/effects'

import { emitCodeSync, initCodeSync, receiveCodeSync, switchWriter } from './actions'

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
    socket.on('chat-message', (event) => {
      console.log('chat-message, event =', event)
      emit(event)
    })

    socket.on('switch-writer', (event) => {
      console.log('switch-writer, event =', event)
      event.messageType = 'switch-writer'
      emit({ messageType: 'switch-writer', payload: { writer: event.writer }})
    })

    return () => {
      socket.off('chat-message', () => {
        console.log('unsubscribing from `chat-message`')
      })
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
  yield call(console.log, 'before takeevery socketChannel')
  yield takeEvery(socketChannel, handleSocketEvents)
  yield call(console.log, 'after takeevery socketChannel')
}

function* handleSocketEvents(event) {
  console.log('handleSocketEvents, event =', event)
  switch (event.messageType) {
    case 'chat-message': {
      yield put(receiveCodeSync.success(event.payload.code))
    }
    case 'switch-writer': {
      console.log('!!!!!!!!!!!!!!!!!!!')
      yield put(switchWriter.success(event.payload.writer))
    }
    default:
      return
  }
}

export function* onMessageEvent() {
  console.log('start onMessageEvent')
  const handleChatMessage = () => {
    socket.on('chat-message', (event) => {
      console.log('chat-message, event =', event)
    })
  }
  yield call(handleChatMessage)
}

export function* handleEmitCodeSync(action) {
  yield call(console.log, 'start handleEmitCodeSync, action =', action)
  const { payload: { code } } = action
  const event = {
    messageType: 'chat-message',
    payload: { code }
  }
  socket.emit('chat-message', event)
}
