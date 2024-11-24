<template>
  <view :class='searchStyle' :style='{width:width,height:height}'>
    <view :class='circleStyle'></view>
  </view>
</template>
<script setup>
import { defineProps, watch } from 'vue';

const props = defineProps({
  searching:{
	  type:Boolean,
	  default:false,
  },
  width: {
    type: String,
    default: "30vw"
  },
  height: {
    type: String,
    default: "30vw"
  }
});
var searchStyle = "gray-radar-container"
var circleStyle = "gray-circle"
watch(()=>props.searching,(newVal,oldVal)=>{
	if(newVal == true){
		circleStyle = "circle"
		searchStyle = "radar-container"
	}
	else{
		circleStyle = "gray-circle"
		searchStyle = "gray-radar-container"
	}
})

</script>
<style>
.radar-container {
  display: flex;;
  justify-content: center;
  justify-items: center;
  align-items: center;
  place-items: center;
  background: #ffffff00;
  width: 30vw;
  height: 30vw;
  overflow: hidden;
}

.radar-container .circle {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  --border-size: 3px;
  --border-angle: 0turn;
  --grid-bg: radial-gradient(
    transparent 69%,
    rgb(64, 158, 255) 69%,
    rgb(64, 158, 255) 70%,
    transparent 70%
  );
  --line-bg: transparent 50%, rgb(64, 158, 255) 50%, transparent 50.5%;
  background-image: conic-gradient(from var(--border-angle), transparent 10%, rgb(76, 166, 255) 99%, rgb(64, 158, 255) 99.5%), linear-gradient(0deg, var(--line-bg)), linear-gradient(45deg, var(--line-bg)), linear-gradient(90deg, var(--line-bg)), linear-gradient(135deg, var(--line-bg)), var(--grid-bg), var(--grid-bg), var(--grid-bg);
  background-size: cover, cover, cover, cover, cover, 25% 25%, 50% 50%, 75% 75%;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 50%;
  border: solid 0.5vmin rgb(64, 158, 255);
  -webkit-animation: bg-spin 3s linear infinite;
  animation: bg-spin 3s linear infinite;
  position: relative;
  filter: blur(0.5px) contrast(200%);
}

@-webkit-keyframes bg-spin {
  to {
    --border-angle: 1turn;
  }
}

@keyframes bg-spin {
  to {
    --border-angle: 1turn;
  }
}



@-webkit-keyframes move {
  33% {
    transform: translate(25vmin, 10vmin);
  }
  66% {
    transform: translate(15vmin, 30vmin);
  }
  100% {
    transform: translate(0vmin, 0vmin);
  }
}

@keyframes move {
  33% {
    transform: translate(25vmin, 10vmin);
  }
  66% {
    transform: translate(15vmin, 30vmin);
  }
  100% {
    transform: translate(0vmin, 0vmin);
  }
}

.circle::before {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: solid 1vmin rgb(64, 158, 255);
  -webkit-animation: scale 1.5s linear infinite;
  animation: scale 1.5s linear infinite;
}

@-webkit-keyframes scale {
  from {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes scale {
  from {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  51%, 100% {
    opacity: 0;
  }
}

@property --border-angle {
  syntax: "<angle>";
  inherits: true;
  initial-value: 0turn;
}
.gray-radar-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff00;
  width: 30vw;
  height: 30vw;
  overflow: hidden;
}

.gray-radar-container .gray-circle {
  width: 80%;
  height: 80%;
  border-radius: 50%;
  --border-size: 3px;
  --border-angle: 0turn;
  --grid-bg: radial-gradient(
    transparent 69%,
    rgb(169, 169, 169) 69%,
    rgb(169, 169, 169) 70%,
    transparent 70%
  );
  --line-bg: transparent 50%, rgb(169, 169, 169) 50%, transparent 50.5%;
  background-image: conic-gradient(from var(--border-angle), transparent 10%, rgb(128, 128, 128) 99%, rgb(169, 169, 169) 99.5%), 
                    linear-gradient(0deg, var(--line-bg)), 
                    linear-gradient(45deg, var(--line-bg)), 
                    linear-gradient(90deg, var(--line-bg)), 
                    linear-gradient(135deg, var(--line-bg)), 
                    var(--grid-bg), 
                    var(--grid-bg), 
                    var(--grid-bg);
  background-size: cover, cover, cover, cover, cover, 25% 25%, 50% 50%, 75% 75%;
  background-position: center center;
  background-repeat: no-repeat;
  border: solid 0.5vmin rgb(169, 169, 169);
  position: relative;
  filter: blur(0.5px) contrast(200%);
}

.gray-circle::before {
  content: "";
  display: block;
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: solid 1vmin rgb(169, 169, 169);
  transform: scale(1); /* No animation */
  opacity: 0.8; /* Slight opacity to keep the effect soft */
}




</style>