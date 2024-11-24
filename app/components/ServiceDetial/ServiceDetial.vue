<template>
	<uni-section title="OrderState" type="line" padding>
		<uni-steps :options="orderState" :active="states" />
	</uni-section>
</template>

<script setup>
	import {
		ref
	} from "vue"
	const props = defineProps({
		state:{
			type:Number,
			default:0
		}
	})
	const states = ref(props.state)
	const orderState = [{
			title: "Shopping",
		},
		{
			title: "Placed",
		},
		{
			title: "Received",
		},
		{
			title: "NeedPay",
		},
		{
			title: "Ongoing",
		},
		{
			title: "Finsh",
		}
	]
</script>

<style>

</style>