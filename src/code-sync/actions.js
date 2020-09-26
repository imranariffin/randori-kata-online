import { ActionCreator } from '../common/utils'

const Action = ActionCreator('codeSync')

export const initCodeSync = Action('initCodeSync', {
  success: (socketId) => ({ socketId })
})

export const codeSyncReconnected = Action('codeSyncReconnected', {
  success: (socketId) => ({ socketId })
})

export const emitCodeSync = Action('emitCodeSync', {
  init: (event) => ({ code: event.target.value })
})

export const receiveCodeSync = Action('receiveCodeSync', {
  success: (code) => ({ code })
})

export const switchWriter = Action('switchWriter', {
  success: (writer) => ({ writer })
})
