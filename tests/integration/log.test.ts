import dotenv from "dotenv"
import { BotMaestroSdk, Column } from "../../src/botcity";
import { v4 as uuid4} from 'uuid';

dotenv.config()

const SERVER = process.env.BOTCITY_SERVER || ""
const LOGIN = process.env.BOTCITY_LOGIN || ""
const KEY = process.env.BOTCITY_KEY || ""

let sdk: BotMaestroSdk;

const activityLabelToLog = `TestCI-${uuid4()}`

const columns = [
    new Column("Date/Time", "timestamp", 300),
    new Column("# Records", "records", 200),
    new Column("Status", "status", 100),
]

describe("Testing log cases", () => {
    beforeAll(async () => {
        sdk = new BotMaestroSdk(SERVER, LOGIN, KEY);
        await sdk.login()
    }, 10000);

    test("Create log", async () => {
        const log = await sdk.createLog(activityLabelToLog, columns)
        expect(log.activityLabel).toEqual(activityLabelToLog)
    }, 10000)

    test("Create new log entry", async () => {
        await sdk.logEntry(activityLabelToLog, {
            "timestamp": new Date().toISOString(),
            "records": 10,
            "status": "SUCCESS"
,        })
    }, 10000)

    test("Get log", async () => {
        const log = await sdk.getLog(activityLabelToLog)
        console.log({ log })
        expect(log.id).toBe(`botcity-${activityLabelToLog}`)
    }, 10000)

    test("Delete log", async () => {
        await sdk.deleteLog(activityLabelToLog)
    }, 10000)
})