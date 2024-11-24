<template>
	<view>
		<uni-drawer ref="diagram" mode="right" :mask-click="true" :width="getScreenWidth()">
			<view class="container">
				<uni-data-select v-model="typeFilter" :localdata="getTypes()" placeholder="filter the service type"
					emptyTips="no data"></uni-data-select>
				<uni-data-select v-model="priceFilter " :localdata="sortTypes" placeholder="sort price"
					emptyTips="no data"></uni-data-select>
			</view>
			<ServicePage :service="filteredData()"></ServicePage>
		</uni-drawer>
	</view>
</template>

<script setup>
	import {
		onBeforeMount,
		onBeforeUnmount,
		onMounted,
		ref,
		watch
	} from 'vue';
	import ServicePage from '../ServicePage/ServicePage.vue';
	const diagram = ref()
	const typeFilter = ref(-1)
	const priceFilter = ref(-1)
	const category = [
		"House Inspection",
		"Electrical system check",
		"House Repair",
		"Special service",
		"Package"
	]
	const sortTypes = [
		{
			text: "increase",
			value: 1
		},
		{
			text: "decrease",
			value: 2
		},
		{
			text: "All",
			value: -1
		}]
	const getTypes = () => {
		let uniqueData = [...new Map(props.service.map(item => [item.sid, item])).values()];

		let mappedData = uniqueData.map(item => ({
			text: category[item.sid-1],
			value: item.sid
		}));
		mappedData.push({
			text: "All",
			value: -1
		})
		return mappedData
	}
	const filteredData = ()=>{
		var data = props.service
		if(typeFilter.value == 1){
			data  = props.service.filter(item => item.sid === 1);
		}
		if(typeFilter.value == 2){
			data  = props.service.filter(item => item.sid === 1);
		}
		if(typeFilter.value == 3){
			data  = props.service.filter(item => item.sid === 1);
		}
		if(typeFilter.value == 4){
			data  = props.service.filter(item => item.sid === 1);
		}
		if(typeFilter.value == 5){
			data  = props.service.filter(item => item.sid === 1);
		}
		if(priceFilter.value ==1)
		{
			data= data.sort((a, b) => a.price - b.price);
		}
		if(priceFilter.value ==2)
		{
			data= data.sort((a, b) => b.price - a.price);
		}
		return data
	}
	const props = defineProps({
		visable: {
			type: Boolean,
			default: false
		},
		service: {
			type: Array,
			default: () => []
		}
	})

	const emit = defineEmits(['update:visable']);

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
.container {
  display: flex;
  gap: 20rpx;  /* 设置选择框之间的间隔 */
  flex-direction: row;  /* 设置水平排列 */
  justify-content: space-between; /* 可选，调整间距的分布 */
  align-items: center;  /* 垂直居中对齐 */
}
</style>