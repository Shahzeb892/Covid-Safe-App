class CovidService {
    constructor(management) {
        this.management = management
    }
    init(){
        this.management.httpService.router.post('/covid/report',
            async (ctx, next) => {
                const { mid,pin  } = ctx.request.body;
                if (ctx.session.username && await this.verify(pin)) {
                    await this.report(mid);   
                    ctx.status = 200;
                    ctx.body = {
                        response: true,
                        message: 'Thank you',
                    }               
                } else {
                    ctx.status = 401;
                    ctx.body = ctx.body = {
                        response: false,
                        message: 'Report failed',
                    }
                }
            }
        )
        this.management.httpService.router.get('/covid/check',
            async (ctx, next) => {
                if (ctx.session.username) {
                    let result = await this.check()
                    ctx.status = 200;
                    ctx.body = {
                        response: true,
                        message: 'Check success',
                        data: result
                    }
                }                
                 else {
                    ctx.status = 401;
                    ctx.body = ctx.body = {
                        response: false,
                        message: 'Check fail',
                    }
                }
            }
        )

    }


    async report(mid)
    {
        let sql = "INSERT INTO report (mid, time) VALUES (?, ?);"
        let time = new Date().toISOString()
        try {
            const info = await this.management.databaseService.execute(sql, [mid,time]);
            return info
        }
        catch (error) {
            return false
        }
    }
    async check(){
        let sql = "SELECT mid FROM report;"
        try {
            const info = await this.management.databaseService.match(sql);
            return info
        }
        catch (error) {
            return false
        }
    }


    // third party verify
    // Patient Identifier Number, PIN
    // Gov
    async verify(pin){
        return true
    }
}

module.exports = CovidService