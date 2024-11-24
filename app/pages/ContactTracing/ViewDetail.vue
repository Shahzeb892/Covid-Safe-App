<template>
  <view class="title-row">
    <text class="title-text">Anonymous Contact Tracing</text>
  </view>
  <view class="container">
    <view class="card">
      <view class="card-header">User Information</view>
      <view class="card-content">
        <view class="user-detail">
          <text>ID: 12345</text>
          <text>Status: Low Risk</text>
          <text>Last Report: 2024-11-22 18:43</text>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="card-header">Explosure Risk Over Time</view>
      <view>
        <image src="../../static/img/contacttracing/risk_level_trend.png" mode="aspectFit" />
      </view>
    </view>

    <view class="card">
      <view class="card-header">Contact Statistics (Last 14 Days)</view>
      <view class="card-content">
        <view class="contact-statistic">
          <text>Total Contact: 47</text>
          <text>High Risk Contact: 0</text>
          <text>Medium Risk Contact: 3</text>
          <text>Low Risk Contact: 44</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
</script>

<style scoped>
.container {
  background-color: #f0f0f0;
  padding: 20px;
}
.title-row {
  background-color: #007aff;
  padding: 1vw 1vh;
  height: 5vh;
  text-align: center;
  align-content: center;
  font-size: 3vh;
  font-weight: bold;
  color: #ffffff;
}
.card {
  background-color: #ffffff; 
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
.card-header {
  font-size: 2vh;
  font-weight: bold;
  margin-bottom: 10px;
}
.card-content {
  font-size: 2vh;
  color: #333;
}
.user-detail text,
.contact-statistic text {
  display: block;
  margin-bottom: 5px;
}
</style>