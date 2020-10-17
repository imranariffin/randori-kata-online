import { codeSyncInit, codeSyncReceived, writerSwitch } from './actions'

const initialState = {
  status: 'noop',
  code: '',
  mode: 'reader',
  socketId: ''
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case codeSyncInit.INIT_TYPE: {
      return {
        ...state,
        status: 'in-progress'
      }
    }
    case codeSyncInit.SUCCESS_TYPE: {
      const { payload: { socketId } } = action
      return {
        ...state,
        status: 'completed',
        socketId
      }
    }
    case codeSyncInit.FAILURE_TYPE: {
      return {
        ...state,
        status: 'failure'
      }
    }
    case codeSyncReceived.SUCCESS_TYPE: {
      const { payload: { code } } = action
      return {
        ...state,
        code
      }
    }
    case writerSwitch.SUCCESS_TYPE: {
      const { payload: { writer } } = action
      return {
        ...state,
        mode: writer === state.socketId ? 'writer' : 'reader'
      }
    }
    default:
      return state
  }
}

export default reducer
