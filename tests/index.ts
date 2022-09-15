// import { BotMaestroSdk } from "../src/botcity"

// const sdk = new BotMaestroSdk(

// )

// const tasks = async () => {
    // await sdk.login()
    // const parametersCreateTask = {
    //     "param1": "value1",
    //     "param2": 2,
    //     "paramN": "etc"
    // }
    // const createTask =  await sdk.createTask("atv_teste_demo", parametersCreateTask, true)
    // console.log({createTask})

    // const finishTask = await sdk.finishTask("27191", "FINISHED", "SUCCESS", "Your custom finish message here!")
    // console.log({finishTask})

    // const getTask = await sdk.getTask("26948")
    // console.log({getTask})
// }   

// const logs = async () => {
//     await sdk.login()
    // const columnsLog= [
    //     {"name": "Column 1", "label": "col1", "width": 100},
    //     {"name": "Column 2", "label": "col2", "width": 200},
    //     {"name": "Column 3", "label": "col3", "width": 150}
    // ]

    // const deleteLog = await sdk.deleteLog("botJavaGabriel")
    // console.log({deleteLog})

    // const createLog =  await sdk.createLog("botJavaGabriel", columnsLog)
    // console.log({createLog})

    // const getLogs =  await sdk.getLogs()
    // console.log({getLogs})
    // console.log({"machines": getLogs[0].machines, notification: getLogs[0].notification})

    // const getLog =  await sdk.getLog("botJavaGabriel")
    // console.log({ getLog })

    // const logEntry = await sdk.logEntry("botJavaGabriel", {"name": "Column 1", "label": "col1", "width": 100})
    // console.log({logEntry})

    // const fetchDataLog =  await sdk.fetchDataLog("botJavaGabriel")
    // console.log({fetchDataLog, _id: fetchDataLog[0]._id, columns: fetchDataLog[0].columns})

    // const downloadCsvLog =  await sdk.downloadCsvLog("botJavaGabriel", "test.csv")
    // console.log({downloadCsvLog})
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
    // await sdk.login()

    // const createArtifact =  await sdk.createArtifact("26137", "User Facing Name.txt", "filename.txt")
    // console.log({ createArtifact })

    
    // const uploadFile =  await sdk.uploadFile(`${createArtifact.id}`, "C:\\Users\\Kayque\\Pictures\\botcity.png")
    // console.log({ uploadFile })

    // const uploadArticact = await sdk.uploadArtifact("26137", "Botcity", "botcity.png", "C:\\Users\\Kayque\\Pictures\\botcity.png")
    // console.log({ uploadArticact })

    // const getArtifacts = await sdk.getArtifacts("50", "0")
    // console.log({getArtifacts, content: getArtifacts.content, sort: getArtifacts.pageable.sort})

    // const downloadArtifacts = await sdk.downloadArtifact(`${createArtifact.id}`, "test.png")
    // console.log({downloadArtifacts})
// }   

// tasks()
// logs()
// alerts()
// messages()
// artifacts()
