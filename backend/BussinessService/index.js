
const { getDistanceFromLatLonInKm } = require("../Util/util")
const { serviceState } = require("./model")


class AccountService {
    constructor(management) {
        this.management = management
    }
    async init() {
        this.management.httpService.router.post('/bussiness/getService',
            async (ctx, next) => {
                if (ctx.session.username) {
                    const { distance, latitude, longitude } = ctx.request.body;
                    const result = await this.getService(distance, latitude, longitude)
                    if (result != false) {
                        ctx.status = 200;
                        ctx.body = {
                            response: true,
                            data: result,
                        }
                    }
                    else {
                        ctx.status = 401;
                        ctx.body = {
                            response: false,
                            message:"Check your network"
                        }
                    }
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        response: false,
                        message:"Check your network"
                    }
                }
            }
        )
        this.management.httpService.router.post('/bussiness/getOrders',
            async (ctx, next) => {
                if (ctx.session.username) {
                    const result = await this.getOrder(ctx.session.username)
                    if (result) {
                        ctx.status = 200;
                        ctx.body = {
                            response: true,
                            data: result,
                        }
                    }
                    else {
                        ctx.status = 401;
                        ctx.body = {
                            response: false,
                            message:"Check your network"
                        }
                    }
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        response: false,
                        message:"Check your network"
                    }
                }
            }
        )
        this.management.httpService.router.post('/bussiness/placeOrder',
            async (ctx, next) => {
                if (ctx.session.username) {
                    const { sid, start_time,desc } = ctx.request.body;
                    const result = await this.placeOrder(ctx.session.username, sid, start_time,desc)
                    if (result) {
                        ctx.status = 200;
                        
                        ctx.body = {
                            response: true,
                            data: result,
                        }
                    }
                    else {
                        ctx.status = 401;
                        ctx.body = {
                            response: false,
                            message:"Check your network"
                        }
                    }
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        response: false,
                        message:"Check your network"
                    }
                }
            }
        )
        this.management.httpService.router.post('/bussiness/userCancel',
            async (ctx, next) => {
                if (ctx.session.username) {
                    const { oid } = ctx.request.body;
                    const result = await this.userCancel(ctx.session.username, oid)
                    if (result) {
                        ctx.status = 200;
                        ctx.body = {
                            response: true,
                            data: result,
                        }
                    }
                    else {
                        ctx.status = 401;
                        ctx.body = {
                            response: false,
                            message:"Check your network"
                        }
                    }
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        response: false,
                        message:"Check your network"
                    }
                }
            }
        )
        // oid , pid
        this.management.httpService.router.post('/bussiness/payOrder',
            async (ctx, next) => {
                if (ctx.session.username) {
                    const { oid,pid } = ctx.request.body;
                    const result = await this.payOrder(ctx.session.username, oid, pid)
                    if (result) {
                        ctx.status = 200;
                        ctx.body = {
                            response: true,
                            data: result,
                        }
                    }
                    else {
                        ctx.status = 401;
                        ctx.body = {
                            response: false,
                            message:"Check your network"
                        }
                    }
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        response: false,
                        message:"Check your network"
                    }
                }
            }
        )
        this.management.httpService.router.post('/bussiness/finishOrder',
            async (ctx, next) => {
                if (ctx.session.username) {
                    const { oid } = ctx.request.body;
                    const result = await this.finishOrder(ctx.session.username, oid)
                    if (result) {
                        ctx.status = 200;
                        ctx.body = {
                            response: true,
                            data: result,
                        }
                    }
                    else {
                        ctx.status = 401;
                        ctx.body = {
                            response: false,
                            message:"Check your network"
                        }
                    }
                } else {
                    ctx.status = 401;
                    ctx.body = {
                        response: false,
                        message:"Check your network"
                    }
                }
            }
        )
    }
    async getService(distance, latitude, longitude) {
        try {
            let sql = "SELECT bid,name,latitude,longitude FROM business;"

            let result = await this.management.databaseService.match(sql);
            for (let i in result) {
                result[i].distance = getDistanceFromLatLonInKm(result[i].latitude, result[i].longitude, latitude, longitude)
            }
            // let filteredResults = result.filter(item => item.distance < distance);
            let filteredResults = result.filter(item => item);
            let matchingBids = filteredResults.map(item => item.bid);
            if (matchingBids.length === 0) {
                return { business: [], services: [] };
            }
            const placeholders = matchingBids.map(() => '?').join(',');
            const serviceSql = `SELECT * FROM service WHERE bid IN (${placeholders});`;
            let services = await this.management.databaseService.match(serviceSql, matchingBids);
            // filteredResults = filteredResults.map(({ bid, ...rest }) => rest);
            return { business: filteredResults, services: services };
        } catch (error) {
            console.error("Error matching services:", error);
            return false
        }
    }
    async getOrder(uid) {
        try {
            var sql = "SELECT * FROM orders where uid = ?;"
            let orders = await this.management.databaseService.match(sql, [uid])
            sql = "SELECT bid,name,latitude,longitude FROM business;"
            let business = await this.management.databaseService.match(sql);
            sql = `SELECT * FROM service WHERE bid`;
            let services = await this.management.databaseService.match(sql);


            return {orders:orders,business: business, services: services }

        }
        catch (error) {
            console.error("Error matching services:", error);
            return false
        }
    }
    async placeOrder(uid, sid, start_time,desc) {
        try {
            let sql = "SELECT bid,price FROM service where sid = ?;"
            let service = await this.management.databaseService.execute(sql, [sid])
            console.log(service)
            if (service == undefined) {
                return false
            }
            let insert = "INSERT INTO orders (state, uid, bid, sid, start_time, price,description) VALUES (?, ?, ?, ?, ?, ?,?)"
            await  this.management.databaseService.execute(insert, [2, uid, service.bid, sid, start_time, service.price,desc])   
            return true

        }
        catch (error) {
            console.error("Error matching services:", error);
            return false
        }
    }
    
    async receiveOrder(bid, oid, price) {
        let order = "SELECT state, bid FROM orders where oid = ?"
        let sql = "UPDATE orders SET state = ?,price = ? WHERE oid = ?"
        try {
            let state = await this.management.databaseService.execute(order, [oid])
            if (state.state != serviceState.created && state.bid == bid) {
                return false
            }
            let result = await this.management.databaseService.execute(sql, [serviceState.needPayment, price, oid])
            return true
        }
        catch (error) {
            console.error("Error matching services:", error);
            return false
        }
    }
    async payOrder(uid, oid, pid) {
        if (!await this.thirdPartyPayment(pid)) {
            return false
        }
        let orderSql = "SELECT state,uid FROM orders where oid = ?"
        let sql = "UPDATE orders SET state = ? WHERE oid = ?"

        try {
            let order = await this.management.databaseService.execute(orderSql, [oid])


            if (order.state != serviceState.needPayment || uid != order.uid) {
                return false
            }
            let result = await this.management.databaseService.execute(sql, [serviceState.ongoing, oid])
            return true
        }
        catch (error) {
            console.error("Error matching services:", error);
            return false
        }
    }
    async userCancel(uid, oid) {
        let order = "SELECT state,uid FROM orders where oid = ?"
        let sql = "DELETE FROM orders WHERE oid = ?;"
        try {
            let state = await this.management.databaseService.execute(order, [oid])
            if (state.state != serviceState.needPayment || uid != state.uid) {
                return false
            }
            let result = await this.management.databaseService.execute(sql, [oid])
            return true
        }
        catch (error) {
            console.error("Error matching services:", error);
            return false
        }
    }
    async businessCancel(bid, oid) {
        try {
            let order = "SELECT state,bid FROM orders where oid = ?"
            let sql = "DELETE FROM orders WHERE oid = ?;"
            let state = await this.management.databaseService.execute(order, [oid])
            if (state.state != serviceState.needPayment && (bid == order.bid)) {
                return false
            }
            let result = await this.management.databaseService.execute(sql, [oid])
            return true
        }
        catch (error) {
            console.error("Error matching services:", error);
            return false
        }
    }
    async finishOrder(uid, oid) {
        try {
            let orderSQL = "SELECT state,uid FROM orders where oid = ?"
            let sql = "UPDATE orders SET state = ? WHERE oid = ?"
            let order = await this.management.databaseService.execute(orderSQL, [oid])
            if (order.state != serviceState.ongoing || uid != order.uid) {
                return false
            }
            let result = await this.management.databaseService.execute(sql, [serviceState.finish,oid])
            return true
        }
        catch (error) {
            console.error("Error matching services:", error);
            return false
        }
    }


    async thirdPartyPayment(pid) {
        return true
        // pay error
        // return false
    }

}


module.exports = AccountService