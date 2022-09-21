/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable jest/valid-expect */
import { describe, it, beforeAll, afterEach, expect } from '@jest/globals'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'
import { BotMaestroSdk } from '../../src'

describe('Login module', () => {
  let mock: MockAdapter
  let server: string = 'https://testing.dev'
  let login: string = 'testing'
  let key: string = 'testing'
  const endpointLogin: string = '/api/v2/workspace/login'

  beforeAll(() => {
    mock = new MockAdapter(axios)
  })

  afterEach(() => {
    mock.reset()
    server = 'https://testing.dev'
    login = 'testing'
    key = 'testing'
  })

  it('Login successfully executed.', async () => {
    const response = {
      accessToken: 'testing'
    }

    const maestro: BotMaestroSdk = new BotMaestroSdk(server, login, key)

    mock.onPost(`${server}${endpointLogin}`).reply(200, response)

    await maestro.login()

    expect(maestro.accessToken).toBe('testing')
  })

  it('Login executed with "Server is required." error', async () => {
    server = ''

    const maestro: BotMaestroSdk = new BotMaestroSdk(server, login, key)

    mock.onPost(`${server}${endpointLogin}`).reply(400, {})

    expect(async () => await maestro.login()).rejects.toThrow('Server is required.')
  })

  it('Login executed with "Login is required." error', async () => {
    login = ''

    const maestro: BotMaestroSdk = new BotMaestroSdk(server, login, key)

    mock.onPost(`${server}/api/v2/workspace/login`).reply(400, {})

    expect(async () => await maestro.login()).rejects.toThrow('Login is required.')
  })

  it('Login executed with "Key is required" error', async () => {
    key = ''
    const maestro: BotMaestroSdk = new BotMaestroSdk(server, login, key)

    mock.onPost(`${server}/api/v2/workspace/login`).reply(400, {})

    expect(async () => await maestro.login()).rejects.toThrow('Key is required.')
  })

  it('Login executed with error generic', async () => {
    const maestro: BotMaestroSdk = new BotMaestroSdk(server, login, key)

    mock.onPost(`${server}/api/v2/workspace/login`).reply(400, {})

    expect(async () => await maestro.login()).rejects.toThrow('Login failed to server')
  })
})
