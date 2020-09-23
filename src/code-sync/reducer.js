import { initCodeSync } from './actions'

const initialState = {
  status: 'noop',
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
      return {
        ...state,
        status: 'completed'
      }
    }
    case initCodeSync.FAILURE_TYPE: {
      return {
        ...state,
        status: 'failure'
      }
    }
    default:
      return state
  }
}

export default reducer
