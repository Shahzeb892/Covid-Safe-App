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
				<uni-easyinput v-model="regForm.name" placeholder="Input your perferedName" type="number"
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
				<uni-icons type="loop" size="17" class="el-icon el-text icon">
					<text> Google Auth</text>
				</uni-icons>
				<uni-easyinput v-model="regForm.googleAuth" placeholder="Input your Google Auth"
					style="margin-top: 25rpx;" />
			</uni-forms-item>
			<uni-forms-item>
				<button @click="onRegister" type="primary" :disabled="disable()">Reginster</button>
			</uni-forms-item>
			<uni-forms-item>
				<text>We will not save the real contect of your name, phone and email. They are used to reset your password.</text>
			</uni-forms-item>
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
		username: "123456",
		password: "1234",
		password2: "1234",
		name: "123",
		email: "123",
		phone: "123",
		googleAuth: "123"
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
</script>

<style>
	.icon {
		align-items: left;
		justify-content: flex-start;
		display: flex;
		white-space: nowrap;
		width: 100%;
	}
</style>