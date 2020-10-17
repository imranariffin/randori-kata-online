export const getIsSocketConnected = ({ codeSync }) => codeSync.status === 'completed'
export const getSyncedCode = ({ codeSync }) => codeSync.code
export const getIsWritingMode = ({ codeSync }) => codeSync.mode === 'writer'
