import dotenv from "dotenv"
import { BotMaestroSdk } from "../../src/botcity";
import { Task } from "../../src/botcity/maestro/interfaces";

dotenv.config()

const SERVER = process.env.BOTCITY_SERVER || ""
const LOGIN = process.env.BOTCITY_LOGIN || ""
const KEY = process.env.BOTCITY_KEY || ""

let sdk: BotMaestroSdk;
let task: Task;

describe("Testing alerts cases", () => {
    beforeAll(async () => {
        sdk = new BotMaestroSdk(SERVER, LOGIN, KEY);
        await sdk.login()
        const parameters = {
            "test_to_test": "testing",
            "integer_to_test": 123,
            "double_to_test": 1.0
        }
        task = await sdk.createTask("TestCI", parameters, false)
    }, 10000);

    test("Create Alert Info", async () => {
        const alert = await sdk.createAlert(task.id, "Info Warn", "This is an info alert", "INFO")
        expect(alert.type).toEqual("INFO")
    }, 10000)

    test("Create Alert Warn", async () => {
        const alert = await sdk.createAlert(task.id, "Info Warn", "This is an info warn", "WARN")
        expect(alert.type).toEqual("WARN")
    }, 10000)

    test("Create Alert Error", async () => {
        const alert = await sdk.createAlert(task.id, "Info Error", "This is an info error", "ERROR")
        expect(alert.type).toEqual("ERROR")
    }, 10000)
})