<template>
	<view>
		<button type="default" @click="goBack">Back</button>
	</view>
	<view>
		<h1>Usage Agreement</h1>
		<p>
			Welcome to our platform! Before using our services, please carefully read the following terms and
			conditions.
		</p>
		<h2>Terms of Use</h2>
		<ul>
			<li>You must be at least 18 years old to use this service.</li>
			<li>You agree not to misuse the platform for any illegal or unauthorized purposes.</li>
			<li>All content provided on the platform is for personal use only.</li>
		</ul>
		<h2>Privacy Policy</h2>
		<p>
			We value your privacy. All personal data collected will be handled in accordance with our privacy policy.
			Your data will not be shared with third parties without your consent.
		</p>
		<h2>Limitation of Liability</h2>
		<p>
			We are not responsible for any damages or losses resulting from the use of our platform.
		</p>
		<p>
			By continuing to use our services, you agree to these terms. If you do not agree, please discontinue using
			our platform.
		</p>
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
	h1 {
		text-align: center;
		color: #333;
	}

	p {
		margin: 10px 0;
	}

	ul {
		margin: 10px 0;
		padding-left: 20px;
	}
</style>