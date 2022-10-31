import axios, { AxiosResponse } from 'axios'
import { ensureAccessToken, catchError } from './utils'
import { Alert, DataLog, Log, Logs, Task, Artifact, Artifacts, IColumn } from './interfaces'
import fs from 'fs'
import FormData from 'form-data'
import { Column } from './columns'

export class BotMaestroSdk {
  private _server: string
  private _login: string
  private _key: string
  private _accessToken: string

  constructor (server: string, login: string, key: string) {
    this._server = server
    this._login = login
    this._key = key
    this._accessToken = ''
  }

  get server (): string {
    return this._server
  }

  set server (server: string) {
    if (server !== '' && server.slice(-1) === '/') {
      server = server.slice(0, -1)
    }
    this._server = server
  }

  private get headers (): Object {
    return { headers: { token: this.accessToken, organization: this._login } }
  }

  get accessToken (): string {
    return this._accessToken
  }

  set accessToken (accessToken: string) {
    this._accessToken = accessToken
  }

  async login (server: string = '', login: string = '', key: string = ''): Promise<void> {
    try {
      if (server !== '') {
        this.server = server
      }

      this._login = login !== '' ? login : this._login
      this._key = key !== '' ? key : this._key

      if (this.server === '') {
        throw new Error('Server is required.')
      }

      if (this._login === '') {
        throw new Error('Login is required.')
      }

      if (this._key === '') {
        throw new Error('Key is required.')
      }

      const url = `${this._server}/api/v2/workspace/login`
      const data = { login: this._login, key: this._key }
      const response: AxiosResponse = await axios.post(url, data)
      this.accessToken = response.data.accessToken
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  async logoff (): Promise<void> {
    this.accessToken = ''
  }

  @ensureAccessToken
  @catchError
  async createTask (
    activityLabel: string,
    parameters: Object,
    test: boolean = false
  ): Promise<Task> {
    const url = `${this._server}/api/v2/task`
    const data = { activityLabel, test, parameters }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async finishTask (
    taskId: string | number,
    finishStatus: Object,
    finishMessage: string = ''
  ): Promise<Task> {
    const url = `${this._server}/api/v2/task/${taskId}`
    const data = { state: 'FINISHED', finishStatus, finishMessage }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        console.log({ error })
        throw new Error(error.response.data.message)
      })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async getTask (taskId: string | number): Promise<Task> {
    const url = `${this._server}/api/v2/task/${taskId}`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      console.log({ error })
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async createLog (activityLabel: string, columns: Column[]): Promise<Log> {
    const url = `${this._server}/api/v2/log`
    const valueColumns: IColumn[] = columns.map(column => column.object)
    const data = { activityLabel, valueColumns, organizationLabel: this._login }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async getLogs (): Promise<Logs[]> {
    const url = `${this._server}/api/v2/log`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      console.log({ error })
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async getLog (idLog: string): Promise<Log> {
    const url = `${this._server}/api/v2/log/${idLog}`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  // TODO: Implement others queries params
  @ensureAccessToken
  @catchError
  async fetchDataLog (idLog: string, days: number = 7): Promise<DataLog[]> {
    const url = `${this._server}/api/v2/log/${idLog}/entry-list?days=${days}`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      console.log({ error })
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async downloadCsvLog (idLog: string, filepath: string, days: number = 7): Promise<Buffer> {
    const url = `${this._server}/api/v2/log/${idLog}/csv?days=${days}`
    const response: AxiosResponse = await axios
      .get(url, { ...this.headers, responseType: 'arraybuffer' })
      .catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    await fs.promises.writeFile(filepath, response.data)
    return response.data
  }

  @ensureAccessToken
  @catchError
  async deleteLog (idLog: string): Promise<void> {
    const url = `${this._server}/api/v2/log/${idLog}`
    await axios.delete(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
  }

  @ensureAccessToken
  @catchError
  async logEntry (idLog: string, content: Object): Promise<void> {
    const url = `${this._server}/api/v2/log/${idLog}/entry`
    await axios.post(url, content, this.headers).catch((error: any) => {
      console.log({ error })
      throw new Error(error.response.data.message)
    })
  }

  @ensureAccessToken
  @catchError
  async createAlert (taskId: string, title: string, message: string, type: string): Promise<Alert> {
    const url = `${this._server}/api/v2/alerts`
    const data = { taskId, title, message, type }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async createMessage (
    emails: String[],
    logins: String[] = [],
    subject: string,
    body: string,
    type: string
  ): Promise<void> {
    const url = `${this._server}/api/v2/message`
    const data = { emails, logins, subject, body, type }
    await axios.post(url, data, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
  }

  @ensureAccessToken
  @catchError
  async createArtifact (taskId: string, name: string, filename: string): Promise<Artifact> {
    const url = `${this._server}/api/v2/artifact`
    const data = { taskId, name, filename }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async uploadFile (artifactId: string, filepath: string): Promise<void> {
    const formData = new FormData()
    const file = fs.createReadStream(filepath)
    formData.append('file', file)
    const url = `${this._server}/api/v2/artifact/log/${artifactId}`
    const contentType = `multipart/form-data; boundary=${formData.getBoundary()}`
    const headers: object = {
      ...this.headers,
      'Content-Type': contentType
    }
    await axios.post(url, formData, headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
  }

  @ensureAccessToken
  @catchError
  async uploadArtifact (
    taskId: string,
    name: string,
    filename: string,
    filepath: string
  ): Promise<Artifact> {
    const artifact = await this.createArtifact(taskId, name, filename)
    await this.uploadFile(`${artifact.id}`, filepath)
    return artifact
  }

  // Todo: Ajust pageable
  @ensureAccessToken
  @catchError
  async getArtifacts (
    size: string,
    page: string,
    sort: String[] = ['dateCreation'],
    days: string = '7'
  ): Promise<Artifacts> {
    const url = `${this._server}/api/v2/artifact?size=${size}&page=${page}&sort=${sort.join(
      ','
    )}&days=${days}`
    // TODO: Implement not pageable
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      console.log({ error })
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async downloadArtifact (artifactId: string, filepath: string): Promise<Buffer> {
    const url = `${this._server}/api/v2/artifact/${artifactId}/file`
    const response: AxiosResponse = await axios
      .get(url, { ...this.headers, responseType: 'arraybuffer' })
      .catch((error: any) => {
        console.log({ error })
        throw new Error(error.response.data.message)
      })
    await fs.promises.writeFile(filepath, response.data)
    return response.data
  }

  @ensureAccessToken
  @catchError
  async getCredential (
    label: string,
    key: string
  ): Promise<any> {
    const url = `${this._server}/api/v2/credential/${label}/key/${key}`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async getCredentialByLabel (
    label: string
  ): Promise<any> {
    const url = `${this._server}/api/v2/credential/${label}`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async createCredentialByLabel (
    label: string,
    key: string,
    value: any
  ): Promise<any> {
    const data = {
      label,
      secrets: [
        { key, value, valid: true }
      ]
    }
    const url = `${this._server}/api/v2/credential`
    const credential = await axios.post(url, data, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return credential
  }

  @ensureAccessToken
  @catchError
  async createCredential (
    label: string,
    key: string,
    value: any
  ): Promise<any> {
    let credential
    try {
      credential = await this.getCredentialByLabel(label)
      if (credential == null) throw new Error('Credential not found')
      const url = `${this._server}/api/v2/credential/${label}/key`
      const data = { key, value }
      await axios.post(url, data, this.headers).catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    } catch (error) {
      let message = ''
      if (error instanceof Error) message = error.message
      if (message.toLowerCase() !== 'credential not found') throw new Error(`Error during message. Server returned: ${message}`)
      credential = await this.createCredentialByLabel(label, key, value)
    }
    return credential
  }
}
