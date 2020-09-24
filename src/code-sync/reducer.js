import { initCodeSync, receiveCodeSync, switchWriter } from './actions'

const initialState = {
  status: 'noop',
  code: '',
  mode: 'reader',
  socketId: '',
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case initCodeSync.INIT_TYPE: {
      return {
        ...state,
        status: 'in-progress',
      }
    }
    case initCodeSync.SUCCESS_TYPE: {
      const { payload: { socketId } } = action
      return {
        ...state,
        status: 'completed',
        socketId,
      }
    }
    case initCodeSync.FAILURE_TYPE: {
      return {
        ...state,
        status: 'failure'
      }
    }
    case receiveCodeSync.SUCCESS_TYPE: {
      const { payload: { code } } = action
      return {
        ...state,
        code
      }
    }
    case switchWriter.SUCCESS_TYPE: {
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
