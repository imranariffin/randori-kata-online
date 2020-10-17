const empty = () => ({})

export const ActionCreator = (basename) => (
  name,
  options = {
    init: empty,
    success: empty,
    failure: empty
  }) => {
  const { init = empty, success = empty, failure = empty } = options
  const INIT_TYPE = `${basename}/${name}/INIT`
  const SUCCESS_TYPE = `${basename}/${name}/SUCCESS`
  const FAILURE_TYPE = `${basename}/${name}/FAILURE`

  return {
    init: (payload = {}) => ({
      type: INIT_TYPE,
      payload: init(payload)
    }),
    success: (payload = {}) => ({
      type: SUCCESS_TYPE,
      payload: success(payload)
    }),
    failure: (payload = {}) => ({
      type: FAILURE_TYPE,
      payload: failure(payload)
    }),
    INIT_TYPE,
    SUCCESS_TYPE,
    FAILURE_TYPE
  }
}
