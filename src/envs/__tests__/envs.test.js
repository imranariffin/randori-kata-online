// eslint-env jest

const fs = require('fs')
const path = require('path')

import { Env } from '..'

describe('environment-variables', () => {
  test('All are defined', () => {
    const envVarTemplatePath = path.resolve(__dirname, '../../../.env.template')
    const envVarTemplateFile = fs.readFileSync(envVarTemplatePath, 'utf-8')
    const envVarTemplateKeys = envVarTemplateFile.split('\n').filter(line => !!line)
    envVarTemplateKeys.forEach(_key => {
      const prefix = 'export REACT_APP_RANDORIKATA__WEB__'
      const key = _key.replace(prefix, '').split('=')[0]
      expect(Env[key]).toBeDefined()
    })
  })
})
