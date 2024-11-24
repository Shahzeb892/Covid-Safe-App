<template>
	<div>
		<uni-forms style="padding: 5vw;">
			<image src="../../static/img/login/covid_safe_logo.png" style="size:70%"></image>
			<uni-forms-item>
				<uni-icons type="contact" size="20" class="el-icon el-text icon">
					<text> Username</text>
				</uni-icons>
				<uni-easyinput v-model="loginForm.username" placeholder="Input your user name"
					style="margin-top: 15rpx;" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-icons type="locked" size="20" class="el-icon el-text icon">
					<text> Password</text>
				</uni-icons>
				<uni-easyinput v-model="loginForm.password" placeholder="Input your password" type="password"
					style="margin-top: 15rpx;" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-icons type="auth" size="20" class="el-icon el-text icon">
					<text> OTP</text>
				</uni-icons>
				<div class="otp-input-get">
					<uni-easyinput v-model="loginForm.otp" placeholder="Input your One Time Password"
					style="width: 70vw" />
					<button class="el-button el-button--info" @click="getOTP" style="height: 5vh;">Get</button>
				</div>
			</uni-forms-item>
			<uni-forms-item>
				<el-row>
					<el-col :span="2">
						<checkbox-group class="icon">
							<label>
								<checkbox :checked="loginForm.usageConfirm" @click="onConfirm"></checkbox>
							</label>
						</checkbox-group>
					</el-col>
					<el-col :span="22">
						<text>
							I agree
							<a style="color: #007aff; text-decoration: underline;" @click="gotoUsage">Usage
								Agreement</a>
							and
							<a style="color: #007aff; text-decoration: underline;" @click="gotoPrivacy">Privacy
								Agreement</a>
						</text>
					</el-col>
				</el-row>
			</uni-forms-item>
			<uni-forms-item>
				<button type="info" class="el-button login-button  el-button--primary" @click="onLogin">Login</button>
			</uni-forms-item>
			<uni-forms-item>
				<button type="info" class="el-button login-button" @click="onRegister">Register</button>
			</uni-forms-item>
			<uni-forms-item>
				<a style="color: #007aff; text-decoration: underline;" @click="gotoForgotPassword">Forgot password?</a>
			</uni-forms-item>
			<uni-popup ref="warnConsent" type="dialog">
				<uni-popup-dialog type="warning" :showClose=false confirmText="I understand" title="Notice">
					<div style="font-size: 2vh; text-align: left;">
						Please read the Usage Agreement and Privacy Agreement before login.
					</div>
				</uni-popup-dialog>
			</uni-popup>
			<uni-popup ref="warnEmail" type="dialog">
				<uni-popup-dialog type="warning" :showClose="false" confirmText="I understand" title="Notice">
					<div style="font-size: 2vh; text-align: left;">
						An e-mail containing the One-Time-Pad code has been sent to your address. Please check your inbox.
					</div>
				</uni-popup-dialog>
			</uni-popup>
		</uni-forms>
	</div>
</template>

<script setup>
	import {
		ref,
		reactive
	} from "vue";
	import store from '@/store';
	import request from "@/request/index.js"
	const loginForm = reactive({
		username: "",
		password: "",
		otp: "",
		usageConfirm: false,
	})
	import { lib as CryptoLib, SHA256 } from 'crypto-js'
	const loginLoading = ref(false);
	const loginSuccess = (res) => {
		if (res.statusCode == 200) {
			let {
				message,
				username
			} = res.data
			if (username != undefined) {
				store.commit("setLogin", true)
			}
		} else {

		}
	}
	const warnConsent = ref()
	const onConfirm = () => {
		loginForm.usageConfirm = !loginForm.usageConfirm
	}
	const warnEmail = ref()
	const getOTP = () => {
		warnEmail.value.open();
	}
	const onLogin = async (event) => {
		if(!loginForm.usageConfirm){
			warnConsent.value.open();
		}
		else{
			loginLoading.value = true;
			request.userLogin(loginForm.username, SHA256(loginForm.password).toString() , loginSuccess)
		}
	}
	const onRegister = () => {
		uni.navigateTo({
			url: "/pages/Register/Register"
		})
	}
	const gotoUsage = () => {
		loginForm.usageConfirm = false
		uni.navigateTo({
			url: "/pages/UsageAgreement/UsageAgreement"
		})
	}
	const gotoPrivacy = () => {
		loginForm.usageConfirm = false
		uni.navigateTo({
			url: "/pages/PrivacyAgreement/PrivacyAgreement"
		})
	}
	const gotoForgotPassword = ()=>{
		loginForm.usageConfirm = false
		uni.navigateTo({
			url: "/pages/ForgotPassword/ForgotPassword"
		})
	}
</script>

<style scoped>
	.login-title {
		text-align: center;
		margin-bottom: 20px;
		font-size: 15vw;
		color: #333;
	}

	.icon {
		align-items: left;
		justify-content: flex-start;
		display: flex;
	}

	.forgot {
		align-items: right;
		justify-content: flex-start;
		display: flex;
	}

	.login-button {
		width: 100%;
		height: 100rpx;
		font-size: 5vw;
	}
	.otp-input-get {
		display: flex;
		align-items: center;
		gap: 2vw;
		margin-top: 15rpx;
	}
</style>