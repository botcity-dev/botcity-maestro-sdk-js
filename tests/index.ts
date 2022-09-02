// import { Sdk } from "../src/botcity"

// const sdk = new Sdk(
// )

// const tasks = async () => {
//     await sdk.login()
//     const parametersCreateTask = {
//         "param1": "value1",
//         "param2": 2,
//         "paramN": "etc"
//     }
//     const createTask =  await sdk.createTask("atv_combux", parametersCreateTask, true)
//     console.log({createTask})

//     const finishTask = await sdk.finishTask(createTask.id, "FINISHED", "SUCCESS", "Your custom finish message here!")
//     console.log({finishTask})

//     const getTask = await sdk.getTask(createTask.id)
//     console.log({getTask})
// }   

// const logs = async () => {
//     await sdk.login()
//     const columnsLog= [
//         {"name": "Column 1", "label": "col1", "width": 100},
//         {"name": "Column 2", "label": "col2", "width": 200},
//         {"name": "Column 3", "label": "col3", "width": 150}
//     ]
//     const createLog =  await sdk.createLog("BotPythonGabriel", columnsLog)
//     console.log({createLog})

//     const getLogs =  await sdk.getLogs()
//     console.log({getLogs})

//     const getLog =  await sdk.getLog("BotPythonGabriel")
//     console.log({getLog})

//     const logEntry = await sdk.logEntry("BotPythonGabriel", {"name": "Column 1", "label": "col1", "width": 100})
//     console.log({logEntry})

//     const fetchDataLog =  await sdk.fetchDataLog("BotPythonGabriel")
//     console.log({fetchDataLog})

//     const downloadCsvLog =  await sdk.downloadCsvLog("BotPythonGabriel", "test.csv")
//     console.log({downloadCsvLog})

//     const deleteLog = await sdk.deleteLog("BotPythonGabriel")
//     console.log({deleteLog})
// }   


// const alerts = async () => {
//     await sdk.login()

//     const createAlert =  await sdk.createAlert("26137", "My Alert Title", "My message", "INFO")
//     console.log({ createAlert })

// }   

// const messages = async () => {
//     await sdk.login()

//     const createMessage =  await sdk.createMessage(["govetrikayque@gmail.com"], [], "Subject of the E-mail", "This is the e-mail body", "TEXT")
//     console.log({ createMessage })

// }   

// const artifacts = async () => {
//     await sdk.login()

//     const createArtifact =  await sdk.createArtifact("26137", "User Facing Name.txt", "filename.txt")
//     console.log({ createArtifact })

    
//     const uploadFile =  await sdk.uploadFile(createArtifact.id, "C:\\Users\\Kayque\\Pictures\\botcity.png")
//     console.log({ uploadFile })

//     const uploadArticact = await sdk.uploadArtifact("26137", "Botcity", "botcity.png", "C:\\Users\\Kayque\\Pictures\\botcity.png")
//     console.log({uploadArticact})

//     const getArtifacts = await sdk.getArtifacts("50", "0")
//     console.log({getArtifacts})

//     const downloadArtifacts = await sdk.downloadArtifact(createArtifact.id, "teste.png")
//     console.log({downloadArtifacts})
// }   

// tasks()
// logs()
// alerts()
// messages()
// artifacts()
