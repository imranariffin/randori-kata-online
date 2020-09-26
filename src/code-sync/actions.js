import { ActionCreator } from '../common/utils'

const Action = ActionCreator('codeSync')

export const codeSyncInit = Action('codeSyncInit', {
  success: (socketId) => ({ socketId })
})

export const codeSyncReconnect = Action('codeSyncReconnect', {
  success: (socketId) => ({ socketId })
})

export const codeSyncEmit = Action('codeSyncEmit', {
  init: (event) => ({ code: event.target.value })
})

export const codeSyncReceived = Action('codeSyncReceived', {
  success: (code) => ({ code })
})

export const writerSwitch = Action('writerSwitch', {
  success: (writer) => ({ writer })
})
