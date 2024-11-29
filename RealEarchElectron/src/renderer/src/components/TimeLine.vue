<template>
  <div v-if="show" class="top-buttons">
    <div @click="handleClose">收起</div>
    <div v-if="animationRunning" @click="stopAnimation">停止</div>
    <div v-else @click="startAnimation">动画</div>
  </div>
  <div :class="{ show: show }" class="timeline">
    <div v-for="item in earthImageList" :key="item.imageUrl" @click="handleClickEarth(item)">
      <img v-lazy="item.imageUrl" alt="" src="../assets/earth_no_image.png" />
      <span>{{ item.beijingTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  currentEarthImageTime,
  currentEarthImageUrl,
  earthImageList,
  getEarthImageList,
  latestEarthImage
} from '../index'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  }
})

watch(
  () => props.show,
  () => {
    if (props.show) {
      getEarthImageList()
    } else {
      getEarthImageList()
    }
  }
)

const handleClickEarth = (earth) => {
  currentEarthImageUrl.value = earth.imageUrl
  currentEarthImageTime.value = earth.beijingTime
}

/**
 * 动画
 */
const animationRunning = ref(false)
let animationTimer
const startAnimation = () => {
  animationRunning.value = true
  let i = earthImageList.value.length
  animationTimer = setInterval(() => {
    i--
    if (i <= 0) {
      i = earthImageList.value.length - 1
    }
    currentEarthImageUrl.value = earthImageList.value[i].imageUrl
    currentEarthImageTime.value = earthImageList.value[i].beijingTime
  }, 100)
}
const stopAnimation = () => {
  animationRunning.value = false
  clearInterval(animationTimer)
  currentEarthImageUrl.value = latestEarthImage()
}

/**
 * 收起
 */
const emit = defineEmits(['close'])
const handleClose = () => {
  emit('close')
}
</script>
6
<style scoped>
.top-buttons {
  position: absolute;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 180px;
  height: 48px;
}

.top-buttons > div {
  cursor: pointer;
  opacity: 0.7;
}

.top-buttons > div:hover {
  opacity: 1;
}

.timeline {
  position: absolute;
  z-index: 11;
  top: 48px;
  bottom: 0;
  left: -180px;
  overflow-y: auto;
  transition: left 0.3s ease-in-out;
}

.timeline.show {
  left: 0;
}

.timeline::-webkit-scrollbar {
  width: 0 !important;
}

.timeline > div {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 180px;
  cursor: pointer;
  transition: transform 0.3s ease-in-out;
}

.timeline > div:hover {
  transform: scale(1.1);
}

.timeline > div > span {
  font-size: 14px;
  margin-top: 4px;
  margin-bottom: 16px;
}

.timeline > div > img {
  width: 100px;
  height: 100px;
}
</style>
