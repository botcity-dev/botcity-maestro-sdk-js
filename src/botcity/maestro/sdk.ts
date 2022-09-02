import { AxiosResponse } from "axios";
import { ensureAccessToken, catchError } from './utils'
import fs from 'fs'
import FormData from 'form-data'
const axios = require('axios');



export class BotMaestroSdk {
    private _server: string
    private _login: string
    private _key: string
    private _accessToken: string

    constructor(server: string, login: string, key: string) {
        this._server = server
        this._login = login
        this._key = key
        this._accessToken = ""
    }

    get server(): string {
        return this._server
    }

    set server(server: string) {
        if (server && server.slice(-1) === "/") {
            server = server.slice(0, -1)
        }
        this._server = server
    }

    get accessToken(): string {
        return this._accessToken
    }

    private get headers(): Object {
        return {"headers": {"token": this.accessToken, "organization": this._login}}
    }
    
    set accessToken(accessToken: string) {
        this._accessToken = accessToken
    }

    async login(server: string = "", login: string = "", key: string = "") {
        try {
            if (server)
                this.server = server
            
            this._login = login || this._login
            this._key = key || this._key

            if (!this.server) 
                throw new Error("Server is required.")

            if (!this._login)
                throw new Error("Login is required.")
            
            if (!this._key)
                throw new Error("Key is required.")

            const url = `${this._server}/api/v2/workspace/login`
            const data = {"login": this._login, "key": this._key}
            const response: AxiosResponse = await axios.post(url, data)
            this.accessToken = response.data.accessToken
        } catch (error) {
            console.error(error)
            throw error
        } 
    }

    async logoff() {
        this.accessToken = ""
    }
    
    @ensureAccessToken
    @catchError
    async createTask(activityLabel: string, parameters: Object, test: boolean = false) {
        const url = `${this._server}/api/v2/task`
        const data = {activityLabel, test, parameters}
        const response: AxiosResponse = await axios.post(url, data, this.headers).catch((error: any) => {
            throw new Error(error.response.data.message)
        })
        return response.data
    }
    
    @ensureAccessToken
    @catchError
    async finishTask(taskId: string, state: string, finishStatus: Object, finishMessage: string = "") {
        const url = `${this._server}/api/v2/task/${taskId}`
        const data = {state, finishStatus, finishMessage}
        const response: AxiosResponse = await axios.post(url, data, this.headers).catch((error: any) => {
            console.log({error})
            throw new Error(error.response.data.message)
        })
        return response.data
    }
    
    @ensureAccessToken
    @catchError
    async getTask(taskId: string) {
        const url = `${this._server}/api/v2/task/${taskId}`
        const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
            console.log({error})
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async createLog(activityLabel: string, columns: Array<object>) {
        const url = `${this._server}/api/v2/log`
        const data = { activityLabel, columns, "organizationLabel": this._login }
        const response: AxiosResponse = await axios.post(url, data, this.headers).catch((error: any) => {
            throw new Error(error.response.data.message)
        })
        return response
    }

    @ensureAccessToken
    @catchError
    async getLogs() {
        const url = `${this._server}/api/v2/log`
        const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
            console.log({error})
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async getLog(idLog: string) {
        const url = `${this._server}/api/v2/log/${idLog}`
        const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
            console.log({error})
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    // TODO: Implement others queries params
    @ensureAccessToken
    @catchError
    async fetchDataLog(idLog: string, days: number = 7) {
        const url = `${this._server}/api/v2/log/${idLog}/entry-list?days=${days}`
        const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
            console.log({error})
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async downloadCsvLog(idLog: string, filepath: string, days: number = 7) {
        const url = `${this._server}/api/v2/log/${idLog}/csv?days=${days}`
        const response: AxiosResponse = await axios.get(url, {...this.headers, responseType: 'arraybuffer'})
        .catch((error: any) => {
            console.log({error})
            throw new Error(error.response.data.message)
        })
        await fs.promises.writeFile(filepath, response.data);
        return response.data
    }

    @ensureAccessToken
    @catchError
    async deleteLog(idLog: string) {
        const url = `${this._server}/api/v2/log/${idLog}`
        const response: AxiosResponse = await axios.delete(url, this.headers).catch((error: any) => {
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async logEntry(idLog: string, content: Object) {
        const url = `${this._server}/api/v2/log/${idLog}/entry`
        const response: AxiosResponse = await axios.post(url, content, this.headers).catch((error: any) => {
            console.log({error})
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async createAlert(taskId: string, title: string, message: string, type: string) {
        const url = `${this._server}/api/v2/alerts`
        const data = { taskId, title, message, type }
        const response: AxiosResponse = await axios.post(url, data, this.headers).catch((error: any) => {
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async createMessage(emails: Array<String>, logins: Array<String> = [], subject: string, body: string, type: string) {
        const url = `${this._server}/api/v2/message`
        const data = { emails, logins, subject, body, type }
        const response: AxiosResponse = await axios.post(url, data, this.headers).catch((error: any) => {
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async createArtifact(taskId: string, name: string, filename: string) {
        const url = `${this._server}/api/v2/artifact`
        const data = { taskId, name, filename }
        const response: AxiosResponse = await axios.post(url, data, this.headers).catch((error: any) => {
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async uploadFile(artifactId: string, filepath: string) {
        const formData = new FormData()
        const file = fs.createReadStream(filepath)
        formData.append("file", file)
        const url = `${this._server}/api/v2/artifact/log/${artifactId}`
        const contentType = `multipart/form-data; boundary=${formData.getBoundary()}`
        const headers = {
            ...this.headers,
            'Content-Type': contentType
        }
        const response: AxiosResponse = await axios.post(url, formData, headers).catch((error: any) => {
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async uploadArtifact(taskId: string, name: string, filename: string, filepath: string){
        const artifact = await this.createArtifact(taskId, name, filename)
        const response = await this.uploadFile(artifact.id, filepath)
        return response
    }

    //Todo: Ajust pageable
    @ensureAccessToken
    @catchError
    async getArtifacts(size: string, page: string, sort: Array<String> = ["dateCreation"], days: string = "7"){
        const url = `${this._server}/api/v2/artifact?size=${size}&page=${page}&sort=${sort.join(",")}&days=${days}`
        const response: AxiosResponse = await axios.get(url, this.headers).catch((error: any) => {
            console.log({error})
            throw new Error(error.response.data.message)
        })
        return response.data
    }

    @ensureAccessToken
    @catchError
    async downloadArtifact(artifactId: string, filepath: string) {
        const url = `${this._server}/api/v2/artifact/${artifactId}/file`
        const response: AxiosResponse = await axios.get(url, {...this.headers, responseType: 'arraybuffer'})
        .catch((error: any) => {
            console.log({error})
            throw new Error(error.response.data.message)
        })
        await fs.promises.writeFile(filepath, response.data);
        return response.data
    }
}