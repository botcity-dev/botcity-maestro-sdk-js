import dotenv from "dotenv"
import { BotMaestroSdk } from "../../src/botcity";
import path from "path";
import { Task } from "../../src/botcity/maestro/interfaces";

dotenv.config()

const SERVER = process.env.BOTCITY_SERVER || ""
const LOGIN = process.env.BOTCITY_LOGIN || ""
const KEY = process.env.BOTCITY_KEY || ""

const screenshotFilepath = path.resolve("tests/screenshot.png")

let sdk: BotMaestroSdk;
let task: Task;

describe("Testing Error cases", () => {
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

    test("Create Error", async () => {
        try {
            eval("hoo bar");
        } catch (error: any) {
            const attachments: string[] = [screenshotFilepath]
            await sdk.createError(task.id, error, {}, screenshotFilepath, attachments)
        }
    }, 10000)

})