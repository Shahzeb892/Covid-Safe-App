
class AccountService {
    constructor(management) {
        this.management = management
    }
    init() {
        this.management.httpService.router.post('/account/quit',
            async (ctx, next) => {
                if (ctx.session.username) {
                    ctx.status = 200;
                    ctx.session.username = null
                    ctx.session = null
                    ctx.body = {
                        response: true,
                        message: 'Quit successful',
                    }
                    
                }
                else {
                    ctx.status = 401
                    ctx.body = ctx.body = {
                        response: false,
                        message: 'Quit fail',
                    }
                }
            }
        )
        this.management.httpService.router.post('/account/check',
            async (ctx, next) => {
                if (ctx.session.username) {
                    ctx.status = 200;
                    ctx.body = {
                        response: true,
                    }
                }
                else {
                    ctx.status = 401
                    ctx.body = {
                        response: false,
                    }
                }
            }
        )
        this.management.httpService.router.post('/account/login',
            async (ctx, next) => {
                const { username, password, otp } = ctx.request.body;
                let result = await this.queryUser(username)
                if (result != undefined && result.passwordhash == password && await this.googleOPTverify(otp, result.googleauth)) {
                    ctx.session.username = username;
                    ctx.status = 200;
                    ctx.body = {
                        message: 'Login successful',
                        response: true,
                        username: ctx.session.username
                    }
                }
                else {
                    ctx.status = 401
                    ctx.body =  ctx.body = {
                        message: 'Login fail',
                        response: false,
                    }
                }
            }
        )
        this.management.httpService.router.post('/account/register',
            async (ctx, next) => {
                const { username, password, name, phone, email, googleauth } = ctx.request.body;
                let result = await this.queryUser(username)
                if (result == undefined && await this.registerUser(username, password, googleauth) && await this.addInfo(username, name, phone, email)) {
                    ctx.status = 200;
                    ctx.body = {
                        response: true,
                        message: 'Register successful',
                    }
                }
                else {
                    ctx.status = 401
                    ctx.body = {
                        response: false,
                        message: 'Register fail',
                    }
                }

            }
        )
        this.management.httpService.router.post('/account/reset',
            async (ctx, next) => {
                const { username, password, name, phone, email, otp } = ctx.request.body;
                let result = await this.queryUser(username)
                if (result != undefined && await this.compUserInfo(username, name, phone, email) && await this.googleOPTverify(otp, result.googleauth)) {
                    await this.resetPassword(username,password)
                    ctx.status = 200;
                    ctx.body = {
                        response: true,
                        message: 'Reset successful',
                    }
                }
                else {
                    ctx.status = 401
                    ctx.body = {
                        response: false,
                        message: 'Reset fail',
                    }
                }

            }
        )
    }


    //Services
    // Return false if error
    async queryUser(uid) {
        let sql = "SELECT uid,passwordhash FROM users WHERE uid = ?";
        try {
            const info = await this.management.databaseService.execute(sql, [uid]);
            return info
        }
        catch (error) {
            return false
        }
    }
    // Return false if error
    async registerUser(uid, password, googleauth) {
        let sql = "INSERT INTO users (uid, passwordhash,googleauth) VALUES (?, ? , ?)";
        try {
            const userId = await this.management.databaseService.execute(sql, [uid, password, googleauth]);
            return true
        } catch (error) {
            console.log(error)
            console.log("Clash in same uid")
            return false
        }
    }
    async addInfo(uid, name, phone, email) {
        let sql = "INSERT INTO user_info (uid, name, mobile,email) VALUES (?, ?, ?,? )";
        try {
            const userId = await this.management.databaseService.execute(sql, [uid, name, phone, email]);
            return true
        } catch (error) {
            console.log("Addinfo in same uid")
            return false
        }
    }
    async compUserInfo(uid, name, phone, email) {
        let sql = "SELECT name,mobile,email FROM user_info WHERE uid = ?";
        try {
            const user = await this.management.databaseService.execute(sql, [uid]);
            if (user.mobile == phone && user.email == email && user.name == name) {
                return true
            }
            return false
        } catch (error) {
            return false
        }
    }
    async resetPassword(uid, password) {
        let sql = " UPDATE users SET passwordhash = ? WHERE uid = ? "
        try {
            const user = await this.management.databaseService.execute(sql, [uid, passwordhash]);
            return true
        } catch (error) {
            return false
        }
    }
    async googleOPTverify(otp, googleauth) {
        return true
    }



}


module.exports = AccountService