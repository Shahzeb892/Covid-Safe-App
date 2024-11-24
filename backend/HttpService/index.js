//这个文件只放模块
const Router = require('koa-router');
const Koa = require('koa');
const session = require('koa-session');
const path = require('path');
const https = require('https');
const fs = require('fs');
const CONFIG = {
    key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    secure: true, /** (boolean) secure cookie*/
    sameSite: null, /** (string) session cookie sameSite options (default null, don't set it) */
  };
const crypto = require('crypto');


class HttpService {
    constructor(systemManagement) {
        this.app = new Koa();
        this.router = new Router();
        this.management = systemManagement
        this.credentials = {
            key: fs.readFileSync(path.join(__dirname, 'server.key')),
            cert: fs.readFileSync(path.join(__dirname, 'server.cert')),
        };
    }
    async applyMidware(midware) {
        this.app.use(midware);
    }
    async init() {
        const bodyParser = require('koa-bodyparser');
        this.app.keys = [crypto.randomBytes(64).toString('hex')]
        await this.applyMidware(bodyParser())
        await this.applyMidware(session(CONFIG, this.app))
        await this.applyMidware(this.router.routes())
        await this.applyMidware(this.router.allowedMethods())
    }
    listen(port) {
        this.httpsServer = https.createServer(this.credentials, this.app.callback());
        this.httpsServer.listen(port, () => {
            console.log(`HTTPS Server is running on https://localhost:${port}`);
        });
        return true
    }
}



module.exports = HttpService;