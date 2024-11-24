// const base="192.168.0.211"
// const base="10.13.72.102"
const base="10.13.110.122"
const host = "https://" + base + ":3000"


const apiTable = {
	userLogin: "/account/login",
	userRegister: "/account/register",
	userReset: "/account/reset",
	userCheck: "/account/check",
	userQuit: "/account/quit",

	getService: "/bussiness/getService",
	getOrders: "/bussiness/getOrders",
	placeOrder: "/bussiness/placeOrder",
	userCancel: "/bussiness/userCancel",
	payOrder: "/bussiness/payOrder",
	finishOrder: "/bussiness/finishOrder",


	check: "/covid/check",
	report: "/covid/report"
}

class Request {
	constructor() {
		uni.configMTLS({
			certificates: [{
				'host': base,
			}],
			success({
				code
			}) {}
		})
	}
	defaultSuccess(res) {
		if(res.data.message){
			uni.showLoading({
				title:res.data.message
			})
			setTimeout(function () {
				uni.hideLoading();
			}, 800);
		}
	}
	defaultError(error) {

	}
	post(url, data, success = this.defaultSuccess, fail = this.defaultError) {
		return uni.request({
			url: url,
			data: data,
			method: "POST",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Connection': 'keep-alive'
			},
			success: (res) => {
				success(res)
				if(success!=this.defaultSuccess){
					this.defaultSuccess(res)
				}
			},
			fail: (e) => {
				fail(e)
			}
		})
	}
	get(url, success = this.defaultSuccess, fail = this.defaultError) {
		return uni.request({
			url: url,
			method: "GET",
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Connection': 'keep-alive'
			},
			success: (res) => {
				success(res)
			},
			fail: (e) => {
				fail(e)
			},
		})
	}
	userLogin(username, password, success) {
		this.post(host + apiTable.userLogin, {
			username: username,
			password: password
		}, success)
	}
	userRegister(username, password, name, phone, email, googleauth, success) {
		this.post(host + apiTable.userRegister, {
			username: username,
			password: password,
			name: name,
			phone: phone,
			email: email,
			googleauth: googleauth
		}, success)
	}
	userReset(username, password, name, phone, email, otp, success) {
		this.post(host + apiTable.userReset, {
			username: username,
			password: password,
			name: name,
			phone: phone,
			email: email,
			otp: otp
		}, success)
	}
	userCheck(success) {
		this.post(host + apiTable.userCheck, {}, success)
	}
	userQuit(success) {
		this.post(host + apiTable.userQuit, {}, success)
	}
	getService(distance, latitude, longitude, success) {
		this.post(host + apiTable.getService, {
			distance: distance,
			latitude: latitude,
			longitude: longitude
		}, success)
	}
	getOrders(success) {
		this.post(host + apiTable.getOrders, {}, success)
	}
	placeOrder(sid, start_time, desc, success) {
		this.post(host + apiTable.placeOrder, {
			sid: sid,
			start_time: start_time,
			desc: desc
		}, success)
	}
	payOrder(oid, pid, success) {
		this.post(host + apiTable.payOrder, {
			oid: oid,
			pid: pid
		}, success)
	}
	cancelOrder(oid, success) {
		this.post(host + apiTable.userCancel, {
			oid: oid
		}, success)
	}
	finishOrder(oid, success) {
		this.post(host + apiTable.finishOrder, {
			oid: oid
		}, success)
	}
	report(pid) {
		this.post(host + apiTable.report, {
			pid: pid
		})
	}
	check(success) {
		this.get(host + apiTable.check, success)
	}

}

let request = new Request()
export default request;