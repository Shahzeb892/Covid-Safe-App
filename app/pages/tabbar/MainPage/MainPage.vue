<template>
	<view>
		<LoginDiagram v-if="!store.state.hasLogin" />
		<ContactTraceDiagram v-if="store.state.hasLogin"></ContactTraceDiagram>		
	</view>
</template>

<script setup>
	import LoginDiagram from '@/components/LoginDiagram/LoginDiagram.vue';
	import ContactTraceDiagram from "@/components/ContactTraceDiagram/ContactTraceDiagram.vue"
  import store from '@/store';

</script>



<style>

</style>