const SystemManagement = require( "./Management/index" )



class Application{
    constructor(port){
        this.port = port
        this.systemManagement =  new SystemManagement()
    }
    init(){
        this.systemManagement.databaseService.init()
        this.systemManagement.accountService.init()
        this.systemManagement.covidService.init()
        this.systemManagement.bussinessService.init()
    }
    start(){
        this.systemManagement.httpService.init()
        this.systemManagement.httpService.listen(3000)
    }

}


const myApp = new Application()


myApp.init()
myApp.start()