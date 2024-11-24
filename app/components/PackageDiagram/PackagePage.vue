<template>
	<view>
		<uni-section title="Services" type="line">
			<scroll-view :scroll-y="true" style="height: 100%;">
				<uni-list :border="false">
					<uni-list-item v-for="item in service" :key="item.sid" :border="false"
						:title="getTitle(item.category)" :note="item.description" :rightText="`Price: $${item.price}`"
						:thumb="getThumb(item.category)" thumb-size="lg" clickable @click="()=>onServiceOpen(item)" />
				</uni-list>
			</scroll-view>
		</uni-section>
	</view>
</template>

<script setup>
import { computed, reactive, watch } from 'vue';
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
	const onServiceOpen = (item) => {
		
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
			default: ()=>[{
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