import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { initCodeSync } from '../../actions'
import { getIsSocketConnected } from '../../selectors'

const Writer = ({
  emitCodeSync
}) => {
  const [code, setCode] = useState('')
  const dispatch = useDispatch()
  const isSocketConnected = useSelector(getIsSocketConnected)

  useEffect(() => {
    dispatch(initCodeSync.init())
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
      <textarea
        value={code}
        onChange={(event) => {
          setCode(event.target.value)
          emitCodeSync()
        }}
      />
    </section>
  )
}

export default Writer
