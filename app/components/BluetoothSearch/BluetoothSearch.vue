<template>
	<view>
		<RadarAnimation :searching="onSearching" width="85vw" height="85vw" @click="onOpenSearch"></RadarAnimation>
		<el-form-item>
			<button class="el-button el-button--success tracing-button" @click="onOpenSearch">Enable Contact Tracing
			</button>
		</el-form-item>
	</view>
	<view>
		<uni-popup ref="searchingCheckDialog" type="dialog">
			<uni-popup-dialog type="warning" cancelText="Disagree" confirmText="Agree" title="Authorisation Required"
				@confirm="onSearchingConfirm">
				<div class="bluetooth-consent">
					COVID contact tracing requires bluetooth permission from your device to collect contact data. Please allow CovidSafe to access your bluetooth in your smartphone OS.
				</div>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref
	} from "vue";
	import RadarAnimation from "@/components/RadarAnimation/RadarAnimation"
	const onSearching = ref(false)
	const searchingCheckDialog = ref()
	const bluetoothStatus = ref(false)
	const onOpenSearch = () => {
		if(!onSearching.value)
		{
			searchingCheckDialog.value.open()
		}
		else{
			onSearching.value = !onSearching.value
			closeBluetooth()
		}
	}
	const onSearchingConfirm = () => {
		onSearching.value = !onSearching.value
		if (onSearching.value) {
			openBluetooth()
		}
	}
	// monitor bluetooth state
	uni.onBluetoothAdapterStateChange(function(res) {
		bluetoothStatus.value = res
	})

	const openBluetooth = () => {
		uni.openBluetoothAdapter({
			success(res) {
				if (res.errMsg == "openBluetoothAdapter:ok") {
					searchBluetooth()
				}
			},
			fail(res) {
				uni.openAppAuthorizeSetting()
				onSearching.value = false
			}
		})
	}
	const closeBluetooth = () => {
		uni.stopBluetoothDevicesDiscovery({})
		uni.closeBluetoothAdapter({})
	}
	const searchBluetooth = () => {
		function ab2hex(buffer) {
			const hexArr = Array.prototype.map.call(
				new Uint8Array(buffer),
				function(bit) {
					return ('00' + bit.toString(16)).slice(-2)
				}
			)
			return hexArr.join('')
		}
		uni.startBluetoothDevicesDiscovery({
			allowDuplicatesKey: false,
			powerLevel: "low"
		})
		uni.onBluetoothDeviceFound(function(device) {
			if(device.devices[0].name!=""){
				let mid = device.devices[0].deviceId.replace(/[^0-9]/g, '')
				let time = new Date().toISOString().slice(0, 19).replace("T", " ");
				console.log(`INSERT INTO report (mid, time) VALUES (${mid}, ${time})`)
				plus.sqlite.executeSql({
					name: "trace",
					sql: `INSERT INTO report (mid, time) VALUES ('${mid}', '${time}')`,
					fail:(e)=>{
						console.log(e)
					}
				})
			}
		})

	}
</script>

<style>
.tracing-button {
	width: 100%;
	height: 8vh;
	font-size: 5vw;
	background-color: cyan;
}
.bluetooth-consent {
		text-align: left;
		line-height: 2vh;
		margin: 0;
	}
</style>