<template>
	<view>
		<uni-forms>
			<uni-forms-item>
				<uni-icons type="contact" size="17" class="el-icon el-text icon">
					<text> Username</text>
				</uni-icons>
				<uni-easyinput v-model="regForm.username" placeholder="Input your user name"
					style="margin-top: 17rpx;" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-icons type="locked" size="17" class="el-icon el-text icon">
					<text> Password</text>
				</uni-icons>
				<uni-easyinput v-model="regForm.password" placeholder="Input your password" type="password"
					style="margin-top: 25rpx;" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-icons type="locked" size="17" class="el-icon el-text icon">
					<text> Reinput Password</text>
				</uni-icons>
				<uni-easyinput v-model="regForm.password2" placeholder="Input your password" type="password"
					style="margin-top: 25rpx;" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-icons type="personadd" size="17" class="el-icon el-text icon">
					<text> Perfered name</text>
				</uni-icons>
				<uni-easyinput v-model="regForm.name" placeholder="Input your perferredName"
					style="margin-top: 25rpx;" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-icons type="phone" size="17" class="el-icon el-text icon">
					<text> Phone number</text>
				</uni-icons>
				<uni-easyinput v-model="regForm.phone" placeholder="Input your phone" type="number"
					style="margin-top: 25rpx;" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-icons type="link" size="17" class="el-icon el-text icon">
					<text> Email number</text>
				</uni-icons>
				<uni-easyinput v-model="regForm.email" placeholder="Input your Email" type="text"
					style="margin-top: 25rpx;" />
			</uni-forms-item>
			<uni-forms-item>
				<uni-icons type="auth" size="17" class="el-icon el-text icon">
					<text> Google Auth</text>
				</uni-icons>
				<div class="otp-input-get">
					<uni-easyinput v-model="regForm.googleAuth" placeholder="Input your Google Auth"
					style="width: 70vw"/>
					<button class="el-button el-button--info" @click="getOTP" style="height: 4.5vh;">Get</button>
				</div>
			</uni-forms-item>
			<uni-forms-item>
				<button @click="onRegister" type="primary" :disabled="disable()">Register</button>
			</uni-forms-item>
			<uni-forms-item>
				<text>We will not save the real contact of your name, phone and email. They are used to reset your password.</text>
			</uni-forms-item>
			<uni-popup ref="warnEmail" type="dialog">
				<uni-popup-dialog type="warning" :showClose="false" confirmText="I understand" title="Notice">
					<div style="font-size: 2vh; text-align: left;">
						An e-mail containing the One-Time-Pad code has been sent to your address. Please check your inbox.
					</div>
				</uni-popup-dialog>
			</uni-popup>
		</uni-forms>
	</view>
</template>

<script setup>
	import request from "@/request/index.js"
	import {
		ref
	} from "vue";
	import { lib as CryptoLib, SHA256 } from 'crypto-js'
	const regForm = ref({
		username: "",
		password: "",
		password2: "",
		name: "",
		email: "",
		phone: "",
		googleAuth: ""
	})
	const onRegister = () => {
		uni.showLoading({

		})
		request.userRegister(regForm.value.username, 
		SHA256(regForm.value.password).toString(), 
		SHA256(regForm.value.name).toString(), 
		SHA256(regForm.value.phone).toString(),
		SHA256(regForm.value.email).toString(), 
		regForm.value.googleAuth, (res) => {
				console.log(res)
				uni.hideLoading()
				uni.navigateBack()
			})
	}
	const disable = () => {
		let empty = Object.values(regForm.value).every(value => value !== null && value !== "")
		return !(empty && (regForm.value.password == regForm.value.password2))
	}
	const warnEmail = ref()
	const getOTP = () => {
		warnEmail.value.open();
	}
</script>

<style>
	.icon {
		align-items: left;
		justify-content: flex-start;
		display: flex;
		white-space: nowrap;
		width: 100%;
	}
	.otp-input-get {
		display: flex;
		align-items: center;
		gap: 2vw;
		margin-top: 15rpx;
	}
</style>