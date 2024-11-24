<template>
	<view>
		<uni-drawer ref="diagram" mode="right" :mask-click="true" :width="getScreenWidth()">
			<uni-section title="Orders" type="line">
				<scroll-view scroll-y="true" style="height: 1200rpx;">
					<uni-list :border="false">
						<uni-list-item v-for="item in order" :key="item.oid" :border="false"
							:title="getTitle(item.state)" :note="getNote(item.bid)" :rightText="`Price: $${item.price}`"
							:thumb="getThumb(item.sid)" thumb-size="lg" clickable @click="selectOrder(item)">
						</uni-list-item>
					</uni-list>
				</scroll-view>
			</uni-section>
		</uni-drawer>
	</view>
	<view>
		<uni-popup ref="popup" background-color="#fff" :style="{ zIndex: 9998 }">
			<view>
				<ServiceDetial :state="currentService.state+1"></ServiceDetial>
			</view>
			<view>
				<uni-forms-item class="service-info" name="service">
					<uni-list-item  :key="currentService.sid" :border="false"
						:title="getTitle(currentService.sid)" :note="currentService.description" :rightText="`Price: $${currentService.price}`"
						:thumb="getThumb(currentService.sid)" thumb-size="lg" />
				</uni-forms-item>
				<uni-section title="Secure Chat" type="line">
					<uni-row>
						<uni-col class="chat-box">
							<scroll-view v-for="(msg, index) in msgLog" :key="index" scroll-y="true">
								<uni-row v-if="msg.type==1">
									<uni-col :span="16" :offset="7" class="user-col">
										<text style="text-align: right;">
											{{ msg.message }}
										</text>
									</uni-col>
								</uni-row>
								<uni-row v-else-if="msg.type==0">
									<uni-col :span="16" :offset="1" class="business-col">
										<text style="text-align: left;">
											{{ msg.message }}
										</text>
									</uni-col>
								</uni-row>
							</scroll-view>
						</uni-col>
					</uni-row>
					<view>
						<uni-row class="bottom-row">
							<uni-col :span="17" :offset="1">
								<uni-easyinput v-model="msgInput" class="el-input" placeholder="Input Message"></uni-easyinput>
							</uni-col>
							<uni-col :span="6">
								<button class="el-button el-button--primary" :disabled="msgInput==''" @click="onSend">Send</button>
							</uni-col>
						</uni-row>
					</view>
					<uni-row class="bottom-row" v-if="currentService.state+1 === 3">
						<uni-col :span="12">
							<button @click="cancelOrder" class="el-button el-button--danger" style="width: 80%;">Cancel
							</button>
						</uni-col>
						<uni-col :span="12">
							<button @click="payOrder" class="el-button el-button--success" style="width: 80%;">Pay
							</button>
						</uni-col>
					</uni-row>
					<uni-row class="bottom-row" v-if="currentService.state+1 === 4">
						<uni-col :span="24">
							<button @click="finishOrder" class="el-button el-button--success" style="width: 80%;">Finsh
							</button>
						</uni-col>
					</uni-row>
					<uni-row class="bottom-row" v-if="currentService.state+1 === 5">
						<uni-col :span="24">
							<uni-section title="Give your feedback" type="line">
								<uni-rate :touchable="false" :value="5" margin="30"/>
							</uni-section>
						</uni-col>
					</uni-row>
				</uni-section>
			</view>
		</uni-popup>
	</view>
</template>

<script setup>
	import {
		ref,
		watch,
		reactive
	} from 'vue';
	import request from '../../request';
	const msgLog = reactive([
		{
			type: 0,
			message: "We have received your order. It will be processed soon.",
		},
		{
			type: 0,
			message: "Your order has been confirmed. Please select your payment",
		}
	])
	const msgInput = ref('')
	const onSend = () => {
		msgLog.push({type: 1, message: msgInput.value});
		autoReply();
		msgInput.value = '';
	}
	const autoReply = () => {
		if (msgInput.value.toLowerCase().includes("pay")) {
			msgLog.push({type: 0, message: "We accept debit and credit card from VISA, MasterCard and American Express. Surcharge may apply to credit card and American Express debit card."})
		}
		if (msgInput.value.toLowerCase().includes("repair")){
			msgLog.push({type: 0, message: "We understand your urgency and want to help. Friday is the earliest we can come."})
		}
		if (msgInput.value.toLowerCase().includes("complete")){
			msgLog.push({type: 0, message: "We can definitely finish the job on the same day without compromising the quality."})
		}
		if (msgInput.value.toLowerCase().includes("thank")){
			msgLog.push({type: 0, message: "All Good. We are here for your help. See you soon."})
		}
	}
	const onShow = (event) =>{
		alert(event.url)
	}
	const diagram = ref()
	const openFilter = () => {
		filter.value.open()
	}
	const category = ['created', 'receive', 'needPayment', 'ongoing', 'finish']
	const categoryThumb = [
		"https://cdn-icons-png.flaticon.com/128/619/619153.png",
		"https://cdn-icons-png.flaticon.com/512/4514/4514764.png",
		"https://cdn-icons-png.flaticon.com/128/939/939119.png",
		"https://cdn-icons-png.flaticon.com/512/4961/4961759.png",
		"https://cdn-icons-png.flaticon.com/512/9752/9752284.png"
	]
	const currentService = ref({
		sid: 0
	})
	const popup = ref()
	const selectOrder = (item) => {
		popup.value.open('center')
		currentService.value = item
	}
	const cancelOrder = () => {
		uni.showLoading({})
		request.cancelOrder(currentService.value.oid, (res) => {
			uni.hideLoading()
			emit('update:orders');
			popup.value.close()
		})
	}
	const finishOrder = () => {
		uni.showLoading()
		request.finishOrder(currentService.value.oid, (res) => {
			console.log(res)
			uni.hideLoading()
			emit('update:orders');
			popup.value.close()
			console.log(currentService)
		})
	}
	const payOrder = () => {
		let url="https://buy.stripe.com/test_28o3dY0BcgFabgAcMM?locale=en-GB&__embed_source=1"
		plus.runtime.openWeb(url)
		uni.showLoading({})
		request.payOrder(currentService.value.oid, 123, (res) => {
			uni.hideLoading()
			emit('update:orders');
			popup.value.close()
		})
	}
	const getThumb = (value) => {
		let currentService = props.service.filter(item => item.sid == value)
		return categoryThumb[currentService[0].category]
	}
	const getTitle = (value) => {
		return category[value]
	}
	const getNote = (value) => {
		let currentBusiness = props.business.filter(item => item.bid = value)
		return currentBusiness[0].name
	}
	const props = defineProps({
		visable: {
			type: Boolean,
			default: false
		},
		order: {
			type: Array,
			default: () => []
		},
		service: {
			type: Array,
			default: () => []
		},
		business: {
			type: Array,
			default: () => []
		}
	})
	const emit = defineEmits(['update:visable', 'update:orders']);
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
	.chat-box {
		height: 40vh;
		overflow-y: auto;
	}
	.business-col {
		display: flex;
		justify-content: flex-start;
		border: 2px solid #90EE90;
		background-color: #90EE90;
		border-radius: 12px;
		padding: 10px;
		margin-bottom: 1vh;
	}
	.user-col {
		display: flex;
		justify-content: flex-end;
		border: 2px solid #56eed8;
		background-color: #56eed8;
		border-radius: 12px;
		padding: 10px;
		margin-bottom: 1vh;
	}
	.bottom-row {
		height: 6vh;
		align-content: center;
	}
	.service-info{
		height: 8vh;
	}
</style>