<template>
	<view @touchmove="">
		<uni-drawer ref="diagram" mode="right" :mask-click="true" :width="getScreenWidth()">
			<ItemFilter :dataList="filterList" @extraClick="openFilter"></ItemFilter>
			<PackagePage :service="service"></PackagePage>
	    </uni-drawer>
	</view>
</template>

<script setup>
	import {
		ref,
		watch
	} from 'vue';
	import ItemFilter from './ItemFilter.vue';
	import PackagePage from './PackagePage.vue';
	const diagram = ref()
	const filter = ref()
	const openFilter = () => {
		filter.value.open()
	}
	const props = defineProps({
		visable: {
			type: Boolean,
			default: false
		},
		filterList :{
			type:Array,
			default: [
			{
				id: 0,
				name: 'Service',
				sort: true
			},
			{
				id: 1,
				name: 'Price',
				sort: true
			}]
		},
		service:{
			type:Array,
			default:()=>[]
		}
	})
	
	const emit = defineEmits(['update:visable']);
	
	const getScreenWidth = () => {
		return uni.getSystemInfoSync().screenWidth
	}
	const open = () => {
		diagram.value.open()
	}
	const close = () => {
		emit('update:visable', false);
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
</script>

<style>

</style>