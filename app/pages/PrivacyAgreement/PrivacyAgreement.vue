<template>
	<view>
		<h1>Privacy Agreement</h1>
		<p>
			Welcome! We are committed to protecting your privacy. This Privacy Agreement explains how we collect, use,
			and share your information.
		</p>

		<h2>Information Collection</h2>
		<p>
			We collect information you provide directly to us, such as when you create an account, fill out a form, or
			contact support. The information collected may include your name, email address, and other personal details.
		</p>

		<h2>Use of Information</h2>
		<p>
			We use the information collected to:
		<ul>
			<li>Provide and improve our services</li>
			<li>Communicate with you regarding updates or issues</li>
			<li>Analyze usage trends to enhance user experience</li>
		</ul>
		</p>

		<h2>Sharing of Information</h2>
		<p>
			We do not share your personal information with third parties except:
		<ul>
			<li>When required by law</li>
			<li>To protect the safety, rights, or property of our users</li>
		</ul>
		</p>

		<h2>Data Security</h2>
		<p>
			We take reasonable measures to protect your information from unauthorized access or misuse. However, please
			note that no system is completely secure.
		</p>

		<p>By using our service, you consent to this Privacy Agreement.</p>
	</view>
</template>

<script setup>
	const goBack = () => {
		uni.navigateBack({
			delta: 1
		});
	}
</script>

<style>

</style>