<template>
	<view class="contact-trace-container">
		<el-form>
			<h2>Welcome, Alice</h2>
			<el-form-item>
				<BluetoothSearch></BluetoothSearch>
			</el-form-item>
			<el-form-item>
				<button class="el-button el-button--success contact-trace-button" @click="covid19">
					COVID-19 Safety Guideline 
				</button>
			</el-form-item>
			<el-form-item>
				<button type="primary" class="el-button contact-trace-button" @click="openReportDialog">Report Health Condition
				</button>
			</el-form-item>
			<el-form-item>
				<button class="el-button el-button--info contact-trace-button" @click="onCheck">COVID Risk Status
				</button>
			</el-form-item>
		</el-form>
	</view>
	<view>
		<uni-popup ref="reportDialog" type="dialog">
			<uni-popup-dialog mode="input" title="Report Health Condition" value="I have gotten influenced."
				confirmText="Submit" cancelText="Cancel" @confirm="submitReport">
				<uni-forms style="padding: 2vh;">
					<uni-forms-item>
						<view class="form-title">What is your current status?</view>
						<radio-group class="radio-group" @change="testChange">
							<radio class="form-radio" :value="false">I tested negative for COVID-19</radio>
							<radio class="form-radio" :value="true">I tested positive for COVID-19</radio>
						</radio-group>
					</uni-forms-item>
					<uni-forms-item>
						<view>
							<view class="form-title">What is your Patient ID?</view>
							<uni-easyinput :disabled="reportForm.isPositive==false" v-model="reportForm.pid" placeholder="Input your Patient ID" style="margin-top: 15rpx;"></uni-easyinput>
						</view>
					</uni-forms-item>
					<uni-forms-item>
						<checkbox-group class="icon">
							<div class="checkbox-row">
								<checkbox :checked="reportForm.consent"></checkbox>
								<text class="privacy-notice">I consent to share my anonymized status for contact tracing purpose only.</text>
							</div>
						</checkbox-group>
					</uni-forms-item>
					<view>
						<div class="privacy-notice">
							*Your privacy is higly valued. Only anonymized data will be used for contact tracing.
						</div>
					</view>
				</uni-forms>
			</uni-popup-dialog>
		</uni-popup>
	</view>
	<view>
		<uni-popup ref="checkDialog" type="dialog">
			<uni-popup-dialog type="warning" confirmText="I understand" :showClose="false" title="Covid Risk Status">
				<div style="display: flex; flex-direction: column;">
					<div style="font-size: 2vh;">{{ checkContect }}</div>
					<a class="detail-link" @click="viewDetail">Click to View Details</a>
				</div>
			</uni-popup-dialog>
		</uni-popup>
	</view>
	<view>
		<uni-popup ref="tracingDialog" type="dialog">
			<uni-popup-dialog type="warning" confirmText="I understand" title="Authorisation Required">
				<div class="bluetooth-consent">
					COVID contact tracing requires bluetooth permission from your device. Please allow CovidSafe to access your bluetooth in your smartphone OS.
				</div>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive
	} from "vue";
	import BluetoothSearch from "@/components/BluetoothSearch/BluetoothSearch"
	import request from "../../request";
	const reportDialog = ref()
	const checkDialog = ref()
	const checkContect = ref("")
	const tracingDialog = ref()
	const enableTracing = () => {
		tracingDialog.value = true
	}
	const reportForm = reactive({
		isPositive: false,
		pid: '',
		consent: false,
	})
	const testChange = (event) =>{
		reportForm.isPositive = event.detail.value
	}
	const covid19 = () => {
		let url =
			"https://www.sahealth.sa.gov.au/wps/wcm/connect/public+content/sa+health+internet/conditions/infectious+diseases/covid-19/covid-19"
		plus.runtime.openWeb(url)
	}
	const openReportDialog = () => {
		reportDialog.value.open()
	}
	const submitReport = (pid) => {
		if(reportForm.isPositive){
			onReport(pid);
		}
		reportForm.isPositive = false;
		reportForm.pid = '';
		reportForm.consent = false;
	}
	const viewDetail = () => {
		uni.navigateTo({
			url: "/pages/ContactTracing/ViewDetail"
		})
	}
	const onReport = (pid) => {
		plus.sqlite.selectSql({
			name: "trace",
			sql: "SELECT * FROM report WHERE time >= DATE('now', '-3 days')",
			success: (data) => {
				request.report(data)
			}
		})
		uni.showLoading({
			title: 'We are verifying'
		})
		setTimeout(() => {
			uni.hideLoading()
		}, 3000)
	}
	const onCheckSuccess = (res) => {
		if (res.data.response) {
			plus.sqlite.selectSql({
				name: "trace",
				sql: "SELECT * FROM report WHERE time >= DATE('now', '-3 days')",
				success: (data) => {
					let midArray = data.map(item => item.mid);
					let compArray = res.data.data.map(item => item.mid);
					let overlappingElements = midArray.filter(item => compArray.includes(item));
					checkDialog.value.open()
					if (overlappingElements.length >= 1) {
						checkContect.value = "🥵Oooops! You are in high risk."
					} else {
						checkContect.value = "😊Good! You are in low risk."
					}
				}
			})
		} else {

		}
	}
	const onCheck = () => {
		request.check(onCheckSuccess)
	}
</script>

<style scoped>
	.contact-trace-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		background-color: #f2f3f5;
	}

	.contact-trace-button {
		width: 100%;
		height: 8vh;
		font-size: 5vw;
	}

	.icon {
		align-items: left;
		justify-content: flex-start;
		display: flex;
	}
	.form-title {
		display: flex;
		text-align: left;
	}
	.privacy-notice {
		display: flex;
		text-align: left;
		font-size: 2vw;
	}

	.form-radio {
		white-space: nowrap;
		font-size: 3vw;
		margin-top: 1vh;
		justify-items: left;
		text-align: left;
	}

	.radio-group {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	.checkbox-row {
		display: flex;
		align-items: center;
	}
	.detail-link {
		font-size: 2vh;
		color: #007aff;
		text-decoration: underline;
	}
</style>