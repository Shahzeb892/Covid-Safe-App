<template>
	<el-container>
		<el-main>
			<el-row>
				<el-col :span="24">
					<!-- Information Flow Implemented by Swiper Box -->
					<swiper class="swiper-box" @change="change" :current="swiperDotIndex" :autoplay="true">
						<swiper-item v-for="(item, index) in swiperItems" @click="clickItem" :key="index">
							<!-- Display the image -->
							<view v-if="item.type==='image'" class="swiper-item">
								<image class="swiper-image" :src="item.src" mode="aspectFill"></image>
							</view>
							<!-- Display the video -->
							<view v-if="item.type==='video'" class="swiper-item">
								<iframe width="100%" height="100%" class="swiper-video" :src="item.src" allow="autoplay; encrypted-media; gyroscope"></iframe>
							</view>
						</swiper-item>
					</swiper>
				</el-col>
				<el-col :span="24">
					<button class="service-button el-button el-link--default" @click="showServices">
						Service Request
					</button>
				</el-col>
				<el-col :span="24">
					<button class="service-button el-button el-link--default" @click="showPackages">
						Service Package
					</button>
				</el-col>
				<el-col :span="24">
					<button class="service-button el-button el-link--default" @click="showNearby">
						Nearby Services
					</button>
				</el-col>
				<el-col :span="24">
					<button class="service-button el-button el-link--default" @click="showOrder">
						My Order
					</button>
				</el-col>
			</el-row>
		</el-main>
	</el-container>
	<DrawerDiagram :visable="diagramVisable" @update:visable="diagramVisable = false" :service="service">
	</DrawerDiagram>
	<MapDiagram :visable="mapVisable" @update:visable="mapVisable = false" :latitude="latitude" :longitude="longitude"
	:service="service" :business="business">
	</MapDiagram>
	<OrderDiagram :visable="orderVisable" @update:visable="orderVisable = false" :service="service" :business="business"
	:order="order" @update:orders="getOrders()"></OrderDiagram>
</template>
<script setup lang="js">
	import {
		reactive,
		ref,
		watch
	} from 'vue';
	import store from '@/store';
	import request from '../../../request';
	import DrawerDiagram from '../../../components/DrawerDiagram/DrawerDiagram.vue';
	import MapDiagram from '../../../components/MapDiagram/MapDiagram.vue';
	import OrderDiagram from '../../../components/OrderDiagram/OrderDiagram.vue';
	const diagramVisable = ref(false)
	const mapVisable = ref(false)
	const orderVisable = ref(false)
	const service = ref()
	const business = ref()
	const order = ref()
	const latitude = ref(0)
	const longitude = ref(0)
	const swiperItems = ref([
		{ type: 'image', src: '../../../static/img/homeservice/covid_prevention.gif' },
		{ type: 'image', src: '../../../static/img/homeservice/sale_info.jpg' },
		{ type: 'video', src: 'https://www.youtube.com/embed/bPITHEiFWLc?si=XVI2Wqcslhs3WZGg'},
	])
	const swiperDotIndex = ref(0);
	const getServices = (filter) => {
		uni.getLocation({
			success: (result) => {
				latitude.value = result.latitude
				longitude.value = result.longitude
				request.getService(9999999999, latitude.value, latitude.value, (res) => {
					service.value = filter(res.data.data.services)
					uni.hideLoading()
				})
			}
		})
	}
	const onGetServiceSuccess = (res) => {

	}
	const filterServices = (data) => {
		return data.filter(item => item.category < 4)
	}
	const showServices = () => {
		uni.showLoading()
		getServices(filterServices)
		diagramVisable.value = true
	}
	const filterPackages = (data) => {
		return data.filter(item => item.category == 4)
	}
	const showPackages = () => {
		uni.showLoading()
		getServices(filterPackages)
		diagramVisable.value = true
	}
	const getNearby = () => {
		uni.getLocation({
			success: (result) => {
				latitude.value = result.latitude
				longitude.value = result.longitude
				request.getService(20,latitude.value,longitude.value,(res)=>{
					business.value = res.data.data.business
					service.value = res.data.data.services
					uni.hideLoading()
				})
			}
		})
		
	}
	const showNearby = () => {
		uni.showLoading()
		getNearby()
		mapVisable.value = true
	}
	const getOrders= ()=>{
		uni.getLocation({
			success: (result) => {
				latitude.value = result.latitude
				longitude.value = result.longitude
				request.getOrders((res)=>{
					business.value = res.data.data.business
					service.value = res.data.data.services
					order.value= res.data.data.orders
					uni.hideLoading()
				})
			}
		})
	}
	const showOrder = ()=>{
		uni.showLoading()
		getOrders()
		orderVisable.value = true
	}
	
</script>
<style lang="css" scoped>
	.service-button {
		height: 15vh;
		width: 100%;
		font-size: 3.5vh;
	}
	.swiper-box {
		height: 200px;
	}
	.swiper-item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 200px;
		color: #fff;
	}
	.swiper-image {
		width: 99%;
		height: 99%;
	}
</style>