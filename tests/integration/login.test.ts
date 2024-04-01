import dotenv from "dotenv"
import { BotMaestroSdk } from "../../src/botcity";

dotenv.config()

const SERVER = process.env.BOTCITY_SERVER || ""
const LOGIN = process.env.BOTCITY_LOGIN || ""
const KEY = process.env.BOTCITY_KEY || ""

let sdk: BotMaestroSdk;


describe("Testing logins cases", () => {
    beforeAll(async () => {
        sdk = new BotMaestroSdk(SERVER, LOGIN, KEY);
    }, 10000);

    test("Error server not found", async () => {
        const expected = async () => {
            await new BotMaestroSdk("", LOGIN, KEY).login()
        }
        expect(expected()).rejects.toThrow("Server is required.")
    }, 10000)

    test("Error in login", async () => {
        const expected = async () => {
            await new BotMaestroSdk(SERVER, "", KEY).login()
        }
        expect(expected()).rejects.toThrow("Login is required.")
    }, 10000)

    test("Error in key", async () => {
        const expected = async () => {
            await new BotMaestroSdk(SERVER, LOGIN, "").login()
        }
        expect(expected()).rejects.toThrow("Key is required.")
    }, 10000)

    test("Login Success", async () => {
        await sdk.login()
        expect(sdk.accessToken).not.toBe("")
        expect(sdk.isOnline).toBe(true)
    }, 10000)
})