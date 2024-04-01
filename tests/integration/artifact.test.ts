import dotenv from "dotenv"
import { BotMaestroSdk } from "../../src/botcity";
import tmp from 'tmp'
import { Task } from "../../src/botcity/maestro/interfaces";

dotenv.config()

const SERVER = process.env.BOTCITY_SERVER || ""
const LOGIN = process.env.BOTCITY_LOGIN || ""
const KEY = process.env.BOTCITY_KEY || ""

let sdk: BotMaestroSdk;
let task: Task;

describe("Testing Artifact cases", () => {
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

    test("Post Artifact", async () => {
        const tmpobj = tmp.fileSync({ mode: 0o644, prefix: 'prefix-', postfix: '.txt' });
        try {
            await sdk.uploadArtifact(task.id, "My Artifact", "My artificat", tmpobj.name)
        } finally {
            tmpobj.removeCallback();
        }
    }, 10000)

    test("Get Artifacts", async () => {
        const listArtifacts = await sdk.getArtifacts("1", "1", [], "1")
        expect(listArtifacts)
    }, 10000)
})