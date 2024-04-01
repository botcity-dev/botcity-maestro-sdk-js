import dotenv from "dotenv"
import { BotMaestroSdk } from "../../src/botcity";
import { Task } from "../../src/botcity/maestro/interfaces";

dotenv.config()

const SERVER = process.env.BOTCITY_SERVER || ""
const LOGIN = process.env.BOTCITY_LOGIN || ""
const KEY = process.env.BOTCITY_KEY || ""

let sdk: BotMaestroSdk;
let task: Task;


describe("Testing tasks cases", () => {
    beforeAll(async () => {
        sdk = new BotMaestroSdk(SERVER, LOGIN, KEY);
        await sdk.login()
        const parameters = {
            "test_to_test": "testing",
            "integer_to_test": 123,
            "double_to_test": 1.0
        }
        const priority = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(1) + 1)) + Math.ceil(1);
        const now = new Date()
        now.setHours(now.getHours() - 1)
        task = await sdk.createTask("TestCI", parameters, false, priority, now)
    }, 10000);

    test("Create Task", async () => {
        const parameters = {
            "test_to_test": "testing",
            "integer_to_test": 123,
            "double_to_test": 1.0
        }
        const priority = Math.floor(Math.random() * (Math.floor(10) - Math.ceil(1) + 1)) + Math.ceil(1);
        const now = new Date()
        now.setHours(now.getHours() - 1)
        const actualTask = await sdk.createTask("TestCI", parameters, false, priority, now)
        expect(actualTask)
    }, 10000)

    test("Get Task", async () => {
        const actualTask = await sdk.getTask(task.id)
        expect(actualTask.activityLabel).toBe("TestCI")
    }, 10000)

    test("Interrupting Task", async () => {
        const actualTask = await sdk.interruptTask(task.id)
        expect(actualTask.interrupted).toBeTruthy()
    }, 10000)

    test("Finish Task to Success", async () => {
        const actualTask = await sdk.finishTask(task.id, "SUCCESS", "Task Finished with Success.")
        expect(actualTask.finishStatus).toEqual("SUCCESS")
    }, 10000)

    test("Finish Task to Partially Completed", async () => {
        const actualTask = await sdk.finishTask(task.id, "PARTIALLY_COMPLETED", "Task Finished with partially completed.")
        expect(actualTask.finishStatus).toEqual("PARTIALLY_COMPLETED")
    }, 10000)

    test("Finish Task to Failed", async () => {
        const actualTask = await sdk.finishTask(task.id, "FAILED", "Task Finished with failed.")
        expect(actualTask.finishStatus).toEqual("FAILED")
    }, 10000)

    test("Finish Task no report items", async () => {
        const actualTask = await sdk.finishTask(task.id, "SUCCESS", "Task Finished with Success.")
        expect(actualTask.totalItems).toBeNull()
        expect(actualTask.processedItems).toBeNull()
        expect(actualTask.failedItems).toBeNull()
    }, 10000)

    test("Finish Task to report items", async () => {
        const createdTask = await sdk.createTask("TestCI", {})
        const actualTask = await sdk.finishTask(createdTask.id, "SUCCESS", "Task Finished with Success.", 10, 5, 5)
        expect(actualTask.totalItems).toEqual(10)
        expect(actualTask.processedItems).toEqual(5)
        expect(actualTask.failedItems).toEqual(5)
    }, 10000)

    test("Finish Task to report processed and failed items", async () => {
        const createdTask = await sdk.createTask("TestCI", {})
        const actualTask = await sdk.finishTask(createdTask.id, "SUCCESS", "Task Finished with Success.", null, 5, 5)
        expect(actualTask.totalItems).toEqual(10)
        expect(actualTask.processedItems).toEqual(5)
        expect(actualTask.failedItems).toEqual(5)
    }, 10000)

    test("Finish Task to report error invalid total items", async () => {
        const createdTask = await sdk.createTask("TestCI", {})
        const expected = async () => {
            await sdk.finishTask(createdTask.id, "SUCCESS", "Task Finished with Success.", 10, 6, 5)
        }
        expect(expected()).rejects.toThrow("Total items is not equal to the sum of processed and failed items.")
    }, 10000)

    test("Finish Task to report error invalid total items", async () => {
        const createdTask = await sdk.createTask("TestCI", {})
        const expected = async () => {
            await sdk.finishTask(createdTask.id, "SUCCESS", "Task Finished with Success.", 10)
        }
        expect(expected()).rejects.toThrow("You must inform at least two of the following parameters: totalItems, processedItems, failedItems.")
    }, 10000)
})