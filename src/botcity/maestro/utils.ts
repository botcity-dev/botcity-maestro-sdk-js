import { BotMaestroSdk } from './sdk'
import os from 'os'
import process from 'node:process'
import util from 'util'
import childProcess from 'child_process'
import fs from 'fs/promises'
import path from 'path'

const exec = util.promisify(childProcess.exec)

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

export const getDefaultTags = async (tags: any): Promise<any> => {
  const userInfo = os.userInfo()
  tags.user_name = userInfo.username
  tags.host_name = os.hostname()
  tags.os_name = os.platform()
  tags.os_version = os.release()
  tags.node_version = process.version
  return tags
}

const npmls = async (): Promise<object> => {
  try {
    const { stdout } = await exec('npm ls --json')
    const dependencies = JSON.parse(stdout).dependencies
    const response = getVersionsToDependencies(dependencies)
    return response
  } catch {
    return {}
  }
}

const getVersionsToDependencies = (dependencies: any): any => {
  const response: any = {}
  for (const dependency in dependencies) {
    response[dependency] = dependencies[dependency].version
  }
  return response
}

export const createNpmList = async (): Promise<string> => {
  const filepath = tmpFile('npmlist.txt')
  const npmList = await npmls()
  await fs.writeFile(filepath, `${JSON.stringify(npmList)}`)
  return filepath
}

const tmpFile = (filename: string): string => {
  return path.join(
    os.tmpdir(),
    filename
  ).toString()
}
