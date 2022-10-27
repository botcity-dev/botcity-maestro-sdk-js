import { BotMaestroSdk } from './sdk'

export const ensureAccessToken = (
  _target: Object,
  _propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor => {
  const originalMethod = descriptor.value
  descriptor.value = function (this: BotMaestroSdk, ...args: any) {
    if (this.accessToken === '') {
      throw new Error('Access Token not available. Make sure to invoke login first')
    }
    const result = originalMethod.apply(this, args)
    return result
  }

  return descriptor
}

export const catchError = (
  _target: Object,
  _propertyKey: string,
  descriptor: PropertyDescriptor
): any => {
  const method = descriptor.value
  descriptor.value = function (this: BotMaestroSdk, ...args: any) {
    try {
      return method.apply(this, args)
    } catch (error: any) {
      let message = 'unknown error'
      if (error instanceof Error) message = error.message
      throw new Error(`Error during message. Server returned: ${message}`)
    }
  }
}

export const getStackInError = (error: Error): string => {
  if (error.stack !== undefined) return error.stack
  return ''
}

export const getTypeInError = (error: Error): string => {
  if (error.constructor.name !== undefined) return error.constructor.name
  return ''
}

export const getMessageInError = (error: Error): string => {
  if (error.message !== undefined) return error.message
  return ''
}
