<script>
	import request from './request';
	import store from '@/store';
	export default {
		onLaunch: function() {
			request.userCheck((res) => {
				if (res.data.response) {
					store.commit("setLogin", true)
				}
			})
			plus.sqlite.openDatabase({
				name: "trace",
				path: "_doc/a.db",
				success: () => {
					plus.sqlite.executeSql({
						name: "trace",
						sql: `CREATE TABLE IF NOT EXISTS report (
						mid TEXT PRIMARY KEY,
						time TEXT NOT NULL)`,
						fail: (e) => {
							console.log(e)
						}
					})
					plus.sqlite.executeSql({
						name: "trace",
						sql: "DELETE FROM report",
						fail: (e) => {
							console.log(e)
						}
					})
				}
			})
			uni.addInterceptor('switchTab', {
				invoke(e) {
					if (e.url == "/pages/tabbar/PersonnalPage/PersonnalPage" || e.url ==
						"/pages/tabbar/HomeServicePage/HomeServicePage") {
						if (!store.state.hasLogin) {
							uni.switchTab({
								url: "/pages/tabbar/MainPage/MainPage"
							})
							return false
						}

					}
				},
			})
		},
		onShow: function() {
			request.userCheck((res) => {
				if (res.data.response) {
					store.commit("setLogin", true)
				}
			})
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		},
	};
</script>

<style>
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
		font-size: 3.5vh;
	}
</style>