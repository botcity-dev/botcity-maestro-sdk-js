import axios, { AxiosResponse } from 'axios'
import {
  ensureAccessToken,
  catchError,
  getMessageInError,
  getStackInError,
  getTypeInError,
  getDefaultTags,
  createNpmList,
  verifyUrlServer
} from './utils'
import { Alert, DataLog, Log, Logs, Task, Artifact, Artifacts } from './interfaces'
import fs from 'fs'
import https from 'https'
import FormData from 'form-data'
import { Column } from './columns'
import { basename } from 'path'

export class BotMaestroSdk {
  private _server: string
  private _login: string
  private _key: string
  private _accessToken: string
  private _verifySSLCert: boolean

  constructor (server: string, login: string, key: string, verifySSLCert: boolean = true) {
    this._server = verifyUrlServer(server)
    this._login = login
    this._key = key
    this._accessToken = ''
    this._verifySSLCert = verifySSLCert
  }

  get server (): string {
    return this._server
  }

  set server (server: string) {
    this._server = verifyUrlServer(server)
  }

  private get headers (): Object {
    return {
      headers: { token: this.accessToken, organization: this._login },
      httpsAgent: this._getHttpsAgent()
    }
  }

  get accessToken (): string {
    return this._accessToken
  }

  set accessToken (accessToken: string) {
    this._accessToken = accessToken
  }

  get verify (): string {
    return this._accessToken
  }

  set verifySSLCert (verifySSLCert: boolean) {
    this._verifySSLCert = verifySSLCert
  }

  get verifySSLCert (): boolean {
    return this._verifySSLCert
  }

  get isOnline (): boolean {
    return this.accessToken !== ''
  }

  private _getHttpsAgent (): https.Agent {
    return new https.Agent({
      rejectUnauthorized: this.verifySSLCert
    })
  }

  private _validateItems (
    totalItems: number | null,
    processedItems: number | null,
    failedItems: number | null
  ): any[] {
    if (totalItems === null && processedItems === null && failedItems === null) {
      console.warn(
        `Attention: this task is not reporting items. Please inform the total, processed and failed items.
        Reporting items is a crucial step to calculate the ROI, success rate and other metrics for your automation
        via BotCity Insights.`
      )
      return [null, null, null]
    }

    if (totalItems === null && processedItems !== null && failedItems !== null) {
      totalItems = processedItems + failedItems
    }

    if (totalItems !== null && processedItems !== null && failedItems === null) {
      failedItems = totalItems - processedItems
    }

    if (totalItems !== null && processedItems === null && failedItems !== null) {
      processedItems = totalItems - failedItems
    }

    if (totalItems === null || processedItems === null || failedItems === null) {
      throw new Error(
        'You must inform at least two of the following parameters: totalItems, processedItems, failedItems.'
      )
    }

    totalItems = Math.max(0, totalItems)
    processedItems = Math.max(0, processedItems)
    failedItems = Math.max(0, failedItems)

    if (totalItems !== null && processedItems !== null && failedItems !== null) {
      if (totalItems !== processedItems + failedItems) {
        throw new Error('Total items is not equal to the sum of processed and failed items.')
      }
    }
    return [totalItems, processedItems, failedItems]
  }

  async login (server: string = '', login: string = '', key: string = ''): Promise<void> {
    try {
      if (server !== '') {
        this.server = verifyUrlServer(server)
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

      const url = `${this.server}/api/v2/workspace/login`
      const data = { login: this._login, key: this._key }
      const response: AxiosResponse = await axios.post(url, data, {
        httpsAgent: this._getHttpsAgent()
      })
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
    test: boolean = false,
    priority: number = 0,
    minExecutionDate: Date | null = null
  ): Promise<Task> {
    const url = `${this.server}/api/v2/task`
    const data = {
      activityLabel,
      test,
      parameters,
      priority,
      minExecutionDate: minExecutionDate instanceof Date ? minExecutionDate.toISOString() : null
    }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        console.log(error)
        throw new Error(error.response.data.message)
      })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async finishTask (
    taskId: string | number,
    finishStatus: Object,
    finishMessage: string = '',
    totalItems: number | null = null,
    processedItems: number | null = null,
    failedItems: number | null = null
  ): Promise<Task> {
    const url = `${this.server}/api/v2/task/${taskId}`
    const [validTotalItems, validProcessedItems, validFailedItems] = this._validateItems(
      totalItems,
      processedItems,
      failedItems
    )
    const data = {
      state: 'FINISHED',
      finishStatus,
      finishMessage,
      totalItems: validTotalItems,
      processedItems: validProcessedItems,
      failedItems: validFailedItems
    }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async getTask (taskId: string | number): Promise<Task> {
    const url = `${this.server}/api/v2/task/${taskId}`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async restartTask (taskId: string | number): Promise<Task> {
    const url = `${this.server}/api/v2/task/${taskId}`
    const data = { state: 'START' }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async interruptTask (taskId: string | number): Promise<Task> {
    const url = `${this.server}/api/v2/task/${taskId}`
    const data = { interrupted: true }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async createLog (activityLabel: string, columns: Column[]): Promise<Log> {
    const url = `${this.server}/api/v2/log`
    const data = { activityLabel, columns, organizationLabel: this._login }
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
    const url = `${this.server}/api/v2/log`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async getLog (idLog: string): Promise<Log> {
    const url = `${this.server}/api/v2/log/${idLog}`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      console.log(error)
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  // TODO: Implement others queries params
  @ensureAccessToken
  @catchError
  async fetchDataLog (idLog: string, days: number = 7): Promise<DataLog[]> {
    const url = `${this.server}/api/v2/log/${idLog}/entry-list?days=${days}`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async downloadCsvLog (idLog: string, filepath: string, days: number = 7): Promise<Buffer> {
    const url = `${this.server}/api/v2/log/${idLog}/export?days=${days}&format=csv`
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
    const url = `${this.server}/api/v2/log/${idLog}`
    await axios.delete(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
  }

  @ensureAccessToken
  @catchError
  async logEntry (idLog: string, content: Object): Promise<void> {
    const url = `${this.server}/api/v2/log/${idLog}/entry`
    await axios.post(url, content, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
  }

  @ensureAccessToken
  @catchError
  async createAlert (
    taskId: string | number,
    title: string,
    message: string,
    type: string
  ): Promise<Alert> {
    const url = `${this.server}/api/v2/alerts`
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
    const url = `${this.server}/api/v2/message`
    const data = { emails, logins, subject, body, type }
    await axios.post(url, data, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
  }

  @ensureAccessToken
  @catchError
  async createArtifact (taskId: string | number, name: string, filename: string): Promise<Artifact> {
    const url = `${this.server}/api/v2/artifact`
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
    const url = `${this.server}/api/v2/artifact/log/${artifactId}`
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
    taskId: string | number,
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
    const url = `${this.server}/api/v2/artifact?size=${size}&page=${page}&sort=${sort.join(
      ','
    )}&days=${days}`
    // TODO: Implement not pageable
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  async downloadArtifact (artifactId: string, filepath: string): Promise<Buffer> {
    const url = `${this.server}/api/v2/artifact/${artifactId}/file`
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
  async createError (
    taskId: string | number,
    error: Error,
    tags: object = {},
    screenshot: string = '',
    attachments: string[] = []
  ): Promise<any> {
    const message: string = getMessageInError(error)
    const type: string = getTypeInError(error)
    const stackTrace: string = getStackInError(error)
    const language: string = 'javascript'.toUpperCase()
    const url = `${this.server}/api/v2/error`
    tags = await getDefaultTags(tags)
    const data = { taskId, type, message, stackTrace, language, tags }
    const response: AxiosResponse = await axios
      .post(url, data, this.headers)
      .catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    if (screenshot !== '') {
      await this.createScreenshot(response.data.id, screenshot)
    }

    const npmListPath = await createNpmList()

    attachments.push(npmListPath)

    try {
      if (attachments.length > 0) {
        await this.createAttachments(response.data.id, attachments)
      }
    } finally {
      fs.unlinkSync(npmListPath)
    }
  }

  async getCredential (label: string, key: string): Promise<any> {
    const url = `${this.server}/api/v2/credential/${label}/key/${key}`
    const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return response.data
  }

  @ensureAccessToken
  @catchError
  private async createScreenshot (errorId: string, filepath: string): Promise<void> {
    const formData = new FormData()
    const file = fs.createReadStream(filepath)
    try {
      formData.append('file', file)
      const url = `${this.server}/api/v2/error/${errorId}/screenshot`
      const contentType = `multipart/form-data; boundary=${formData.getBoundary()}`
      const headers: object = {
        ...this.headers,
        'Content-Type': contentType
      }
      await axios.post(url, formData, headers).catch((error: any) => {
        throw new Error(error.response.data.message)
      })
    } finally {
      file.destroy()
    }
  }

  async getCredentialByLabel (label: string): Promise<any> {
    const url = `${this.server}/api/v2/credential/${label}`
    try {
      const response: AxiosResponse = await axios.get(url, this.headers)
      return response.data
    } catch {
      return null
    }
  }

  @ensureAccessToken
  @catchError
  private async createAttachments (errorId: string, attachments: string[]): Promise<void> {
    const url = `${this.server}/api/v2/error/${errorId}/attachments`
    for (const attachment of attachments) {
      const formData = new FormData()
      const file = fs.createReadStream(attachment)
      try {
        formData.append('file', file, { filename: basename(attachment) })
        const contentType = `multipart/form-data; boundary=${formData.getBoundary()}`
        const headers: object = {
          ...this.headers,
          'Content-Type': contentType
        }
        await axios.post(url, formData, headers).catch((error: any) => {
          throw new Error(error.response.data.message)
        })
      } finally {
        file.destroy()
      }
    }
  }

  async createCredentialByLabel (label: string, key: string, value: any): Promise<any> {
    const data = {
      label,
      secrets: [{ key, value, valid: true }]
    }
    const url = `${this.server}/api/v2/credential`
    const credential = await axios.post(url, data, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return credential
  }

  @ensureAccessToken
  @catchError
  async createCredential (label: string, key: string, value: any): Promise<any> {
    let credential = await this.getCredentialByLabel(label)
    if (credential == null) {
      credential = await this.createCredentialByLabel(label, key, value)
      return credential.data
    }
    const url = `${this.server}/api/v2/credential/${label}/key`
    const data = { key, value }
    credential = await axios.post(url, data, this.headers).catch((error: any) => {
      throw new Error(error.response.data.message)
    })
    return credential.data
  }
}
