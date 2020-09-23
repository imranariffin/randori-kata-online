import { ActionCreator } from '../common/utils'

const Action = ActionCreator('codeSync')

export const initCodeSync = Action('initCodeSync')

export const emitCodeSync = Action('emitCodeSync', {
  init: (event) => ({ code: event.target.value })
})
