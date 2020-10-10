const fs = require('fs')
const path = require('path')

describe('environment-variables', () => {
  test('All are defined', () => {
    const envVarFile = fs.readFileSync(path.resolve(__dirname, './.env.template'), 'utf-8')
    const envVarKeys = envVarFile.split('\n').filter(line => !!line)
    envVarKeys.forEach(_key => {
      const key = _key.replace('export ', '').split('=')[0]
      expect(process.env[key]).toBeDefined()
    })
  })
})
