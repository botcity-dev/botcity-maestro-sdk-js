import dotenv from "dotenv"
import { BotMaestroSdk } from "../../src/botcity";
import { v4 as uuid4} from 'uuid';

dotenv.config()

const SERVER = process.env.BOTCITY_SERVER || ""
const LOGIN = process.env.BOTCITY_LOGIN || ""
const KEY = process.env.BOTCITY_KEY || ""

let sdk: BotMaestroSdk;
let credentialLabel = `testing-${uuid4()}`
let credentialKey = `testing-${uuid4()}`

describe("Testing Credential cases", () => {
    beforeAll(async () => {
        sdk = new BotMaestroSdk(SERVER, LOGIN, KEY);
        await sdk.login()
    }, 10000);

    test("Create Credential", async () => {
        await sdk.createCredential(credentialLabel, credentialKey, "testing")
    }, 10000)

    test("Get Credential", async () => {
        const credential = await sdk.getCredential(credentialLabel, credentialKey)
        expect(credential).toEqual("testing")
    }, 10000)
})