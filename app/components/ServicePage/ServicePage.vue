<template>
	<view>
		<uni-section title="Services" type="line">
			<scroll-view :scroll-y="true" style="height: 1200rpx;">
				<uni-list :border="false">
					<uni-list-item v-for="item in service" :key="item.sid" :border="false"
						:title="getTitle(item.category)" :note="item.description" :rightText="`Price: $${item.price}`"
						:thumb="getThumb(item.category)" thumb-size="lg" clickable @click="()=>onServiceOpen(item)" />
				</uni-list>
			</scroll-view>
		</uni-section>
	</view>
	<view>
		<uni-popup ref="popup" background-color="#fff">
			<view>
				<ServiceDetial></ServiceDetial>
			</view>
			<view>
				<uni-forms :model="formData">
					<uni-forms-item label="Service" name="service">
						<uni-list-item  :key="currentService.sid" :border="false"
							:title="getTitle(currentService.category)" :note="currentService.description" :rightText="`Price: $${currentService.price}`"
							:thumb="getThumb(currentService.category)" thumb-size="lg" />
					</uni-forms-item>
					<uni-forms-item required label="Name" name="name">
						<uni-easyinput type="text" v-model="formData.PerferedName"
							placeholder="Provide your nick name" />
					</uni-forms-item>
					<uni-forms-item label="Contact" name="contact">
						<uni-easyinput type="text" v-model="formData.PerferedContact"
							placeholder="Provide your contact" />
					</uni-forms-item>
					<uni-forms-item label="Time" name="time">
						<uni-datetime-picker type="datetime" returnType="date" v-model="formData.PerferedTime" />
					</uni-forms-item>
					<uni-forms-item label="ExtraInfo" name="info">
						<uni-easyinput type="text" v-model="formData.ExtraInfo"
							placeholder="Wirte you special info here" />
					</uni-forms-item>
				</uni-forms>
			</view>
			<view style="height: 6vh;">
				<button class="el-button el-button--primary" @click="placeOrder">Place order</button>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		computed,
		reactive,
		watch,
		ref
	} from 'vue';
	import ServiceDetial from '../ServiceDetial/ServiceDetial.vue';
import request from '../../request';
	const category = [
		"House Inspection",
		"Electrical system check",
		"House Repair",
		"Special service",
		"Package"
	]
	const categoryThumb = [
		"https://cdn-icons-png.flaticon.com/128/619/619153.png",
		"https://cdn-icons-png.flaticon.com/512/4514/4514764.png",
		"https://cdn-icons-png.flaticon.com/128/939/939119.png",
		"https://cdn-icons-png.flaticon.com/512/4961/4961759.png",
		"https://cdn-icons-png.flaticon.com/512/9752/9752284.png"
	]
	const getThumb = (value) => {
		return categoryThumb[value]
	}
	const getTitle = (value) => {
		return category[value]
	}
	const currentService = ref()
	const popup = ref()
	const onServiceOpen = (item) => {
		currentService.value = item
		popup.value.open('center')
	}
	const formData = ref({
		PerferedName: "",
		PerferedContact: "",
		PerferedTime: "",
		ExtraInfo: ""
	})
	const buttonDisable = ()=>{
		return Object.values(formData.value).some(value => value.trim() !== "");
	}
	const placeOrder = ()=>{
		uni.showLoading()
		let desc = formData.value.PerferedName + '\n' + formData.value.PerferedContact+"\n"+formData.value.ExtraInfo
		request.placeOrder(currentService.value.sid,
		formData.value.PerferedTime,desc,(res)=>{
			console.log(res)
			popup.value.close()
			uni.hideLoading()
		})
	}
	const props = defineProps({
		service: {
			type: {
				sid: Number,
				category: Number,
				bid: Number,
				price: Number,
				description: String
			},
			default: () => [{
				sid: 1,
				category: 2,
				bid: 3,
				price: 4,
				description: "test"
			}]
		}
	})
</script>

<style>

</style>