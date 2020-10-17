export class EnvVarInvalidBoolean extends Error {
  constructor (env) {
    super(env)
    this.message = `EnvVarInvalidBoolean: '${env}' is not a valid boolean`
  }
}
