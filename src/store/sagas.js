import { all, call } from 'redux-saga/effects'

import { runCodeSyncSagas } from '../code-sync/sagas'

export function * runAllSagas () {
  yield all([
    call(runCodeSyncSagas)
  ])
}
