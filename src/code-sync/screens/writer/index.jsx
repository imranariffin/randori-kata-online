import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { codeSyncEmit, codeSyncInit } from '../../actions'
import { getIsSocketConnected, getIsWritingMode, getSyncedCode } from '../../selectors'

const Writer = () => {
  const [code, setCode] = useState('')
  const dispatch = useDispatch()
  const isSocketConnected = useSelector(getIsSocketConnected)
  const syncedCode = useSelector(getSyncedCode)
  const isWritingMode = useSelector(getIsWritingMode)

  useEffect(() => {
    dispatch(codeSyncInit.init())
  }, [dispatch])

  if (!isSocketConnected) {
    return (
      <div>
        {'loading socket connection ...'}
      </div>
    )
  }

  return (
    <section>
      <h4>Mode: {isWritingMode ? 'write' : 'read'}</h4>
      <textarea
        value={syncedCode || code}
        onChange={(event) => {
          setCode(event.target.value)
          dispatch(codeSyncEmit.init(event))
        }}
      />
    </section>
  )
}

export default Writer
