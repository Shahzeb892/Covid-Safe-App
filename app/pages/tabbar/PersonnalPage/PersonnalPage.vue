<template>
	<view>
		<view class="avatar-section">
			<image class="avatar" src="https://cdn-icons-png.flaticon.com/512/847/847969.png" mode="aspectFill" />
			<text class="el-text" style="font-size: 80rpx;"> Welcome!</text>
		</view>
		<uni-collapse accordion v-model="accordionVal">
			<uni-collapse-item :show-animation="true">
				<template v-slot:title>
					<view class="item">
						<uni-icons type="paperplane" size="30" class="collapse">
							<text>Account</text>
						</uni-icons>
					</view>
				</template>
				<view class="content">
					<button @click="quitLogin" type="primary">
						Quit login state
					</button>
				</view>
			</uni-collapse-item>
			<uni-collapse-item>
				<template v-slot:title>
					<view class="item">
						<uni-icons type="list" size="30" class="collapse">
							<text>Setting</text>
						</uni-icons>
					</view>
				</template>
				<view class="content">
					<text class="text">Just for exhibition.</text>
				</view>
			</uni-collapse-item>
			<uni-collapse-item :show-animation="true">
				<template v-slot:title>
					<view class="item">
						<uni-icons type="help" size="30" class="collapse">
							<text>About</text>
						</uni-icons>
					</view>
				</template>
				<view class="content">
					<text class="text">This app is for SSE assignment only. </text>
				</view>
			</uni-collapse-item>
		</uni-collapse>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue';
import request from '../../../request';
import store from '../../../store';
	const accordionVal = ref()
	const  quitLogin = ()=>{
		request.userQuit((res)=>{
			if(res.data.response)
			{
				store.commit("setLogin", false)
				uni.switchTab({
					url:"/pages/tabbar/MainPage/MainPage"
				})
			}
		})
	}
</script>

<style lang="scss" scoped>
	.collapse {
		align-items: left;
		justify-content: flex-start;
		display: flex;
		margin-right: 40rpx;
	}

	.avatar-section {
		margin-top: 50rpx;
	}

	.item {
		height: 200rpx;
		padding-left: 45rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 4rpx solid #ddd;
		box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
	}
</style>