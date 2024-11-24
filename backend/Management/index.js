const HttpService = require( "../HttpService/index" )
const DatabaseService = require("../DatabaseService/index")
const AccountService = require("../AccountService/index")
const CovidService = require("../CovidService/index")
const BussinessService = require("../BussinessService/index")


class SystemManagement{
    constructor(){
        this.httpService = new HttpService(this)
        this.databaseService = new DatabaseService(this)
        this.accountService= new AccountService(this)
        this.covidService = new CovidService(this)
        this.bussinessService = new BussinessService(this)
    }
}



module.exports = SystemManagement