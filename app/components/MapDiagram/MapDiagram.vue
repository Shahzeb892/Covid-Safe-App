<template>
	<view>
		<uni-drawer ref="diagram" mode="right" :mask-click="true" :width="getScreenWidth()">
			<view>
				<iframe ref="map" :style="webviewStyles"
					src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=-34.919380,138.606646+(Bussiness)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
				</iframe>
			</view>
			<view>
				<scroll-view :scroll-y="true" style="height:400rpx">
					<uni-table class="el-table" emptyText="No more data">
						<uni-tr>
							<uni-th align="center" width="100">Name</uni-th>
							<uni-th align="center">Services</uni-th>
							<uni-th align="center" :sortable="true">Distance(km)</uni-th>
						</uni-tr>
						<uni-tr v-for="item in business" @click="selectBusiness(item)">
							<uni-th align="center" width="100">{{ item.name }}</uni-th>
							<uni-th align="center">
								<view >
									<uni-tag text="Inspection" type="default" class="tag-view"/>
								</view>
								<view >
									<uni-tag text="Electrical" type="default" class="tag-view"/>
								</view>
								<view >
									<uni-tag text="Speical" type="default" class="tag-view"/>
								</view>
								<view >
									<uni-tag text="Repair" type="default" class="tag-view"/>
								</view>
								<view >
									<uni-tag text="Package" type="default" class="tag-view"/>
								</view>
							</uni-th>
							<uni-th align="center">{{ item.distance ? item.distance.toFixed(2) : 'N/A'}}</uni-th>
						</uni-tr>
					</uni-table>
				</scroll-view>
			</view>
			<view>
				<uni-popup ref="popup" background-color="#fff">
					<view>
						<ServiceDetial></ServiceDetial>
					</view>
					<view>
						<uni-forms :model="formData">
							<uni-forms-item label="Service" name="service">
								<uni-list-item v-for="item in currentServices" :key="item.sid" :border="true"
									:title="getTitle(item.category)" :note="item.description"
									:thumb="getThumb(item.category)" thumb-size="lg" :clickable="true"
									@click="selectService(item)">
									<template v-slot:footer>
										<text v-if="item.sid != currentService.sid"
											class="el-text">{{`Price: $${item.price}`}}
										</text>
										<uni-icons v-if="item.sid == currentService.sid" type="checkmarkempty" size="20"
											class="el-text" color="#3498db"></uni-icons>
									</template>
								</uni-list-item>
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
								<uni-datetime-picker type="datetime" returnType="date"
									v-model="formData.PerferedTime" />
							</uni-forms-item>
							<uni-forms-item label="ExtraInfo" name="info">
								<uni-easyinput type="text" v-model="formData.ExtraInfo"
									placeholder="Wirte you special info here" />
							</uni-forms-item>
						</uni-forms>
					</view>
					<view>
						<button class="el-button el-button--info" @click="cancelPopup">Cancel</button>
						<button class="el-button el-button--primary" @click="placeOrder">Place order</button>
					</view>
				</uni-popup>
			</view>
		</uni-drawer>
	</view>
</template>

<script setup>
	import {
		createElementVNode,
		getCurrentInstance,
		ref,
		watch
	} from 'vue';
import request from '../../request';
	const getCurrentService = (bid) => {
		return [props.service.filter(item => {
			return bid == item.bid
		})]
	}
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
	const diagram = ref()
	const map = ref()
	const webviewStyles = ref(`border: none; width: 100 % ; height: ${uni.getSystemInfoSync().screenWidth}px`)
	const props = defineProps({
		visable: {
			type: Boolean,
			default: false
		},
		service: {
			type: Array,
			default: () => []
		},
		business: {
			type: Array,
			default: () => []
		},
		latitude: {
			type: Number,
			default: -34
		},
		longitude: {
			type: Number,
			default: 138
		}

	})
	const mapLatitude = ref(-34)
	const mapLongitude = ref(138)
	const emit = defineEmits(['update:visable']);
	const getMapurl = () => {
		return `https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=${mapLatitude.value},${mapLongitude.value}+(Bussiness)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed`
	}
	const currentServices = ref()
	const currentService = ref({
		sid: 0
	})
	const selectBusiness = (item) => {
		mapLatitude.value = item.latitude
		mapLongitude.value = item.longitude
		currentServices.value = props.service.filter(s => s.bid == item.bid)
		popup.value.open('bottom')
	}
	const popup = ref()
	const formData = ref({
		PerferedName: "",
		PerferedContact: "",
		PerferedTime: "",
		ExtraInfo: ""
	})
	const cancelPopup = () => {
		popup.value.close()
	}
	const selectService = (item) => {
		currentService.value = item
	}
	const placeOrder = () => {
		uni.showLoading()
		let desc = formData.value.PerferedName + '\n' + formData.value.PerferedContact + "\n" + formData.value.ExtraInfo
		request.placeOrder(currentService.value.sid,
			formData.value.PerferedTime, desc, (res) => {
				console.log(res)
				popup.value.close()
				uni.hideLoading()
			})
	}

	const getScreenWidth = () => {
		return uni.getSystemInfoSync().screenWidth
	}
	const open = () => {
		plus.key.addEventListener('backbutton', handleKeydown);
		diagram.value.open()
	}
	const close = () => {
		emit('update:visable', false);
		plus.key.removeEventListener('backbutton', handleKeydown);
		diagram.value.close()
	}
	watch(
		() => props.visable,
		(newValue, oldValue) => {
			if (newValue) {
				open()
			} else {
				close()
			}
		}
	);
	const handleKeydown = (event) => {
		close()
	};
</script>

<style>
	.tag-view {
	  width: 150rpx;
	  background-color: transparent;
	  border: none;
	  color: blue;
	  text-decoration: underline;
	}
	
</style>