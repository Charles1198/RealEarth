<template>
  <canvas id="canvasSky" />
  <canvas id="canvasMeteor" />
  <img
    v-if="imageShow"
    :src="currentEarthImageUrl"
    alt="logo"
    class="earth-img"
    crossorigin="anonymous"
  />
  <div class="buttons">
    <div class="button" title="过去一天的地球" @click="handleShowTimeLine">
      <img v-if="showTimeLine" alt="icon" height="24" src="./assets/icon_close.svg" width="24" />
      <img v-else alt="icon" height="24" src="./assets/icon_time.svg" width="24" />
      {{ showTimeLine ? '收起' : '历史' }}
    </div>
    <div class="button" title="下载当前显示的地球到本地" @click="handleDownload">
      <img alt="icon" height="24" src="./assets/icon_download.svg" width="24" />
      下载
    </div>
    <div class="button" title="将当前地球作为壁纸" @click="handleSetWallpaper">
      <img alt="icon" height="24" src="./assets/icon_wallpaper.svg" width="24" />
      壁纸
    </div>
    <div class="button" title="刷新当前地球" @click="handleRefresh">
      <img alt="icon" height="24" src="./assets/icon_refresh.svg" width="24" />
      刷新
    </div>
    <div class="button" title="刷新当前地球" @click="handleRefresh">
      <img alt="icon" height="24" src="./assets/icon_refresh.svg" width="24" />
      开机自启动 <br />开
    </div>
  </div>

  <div v-if="currentEarthImageTime" class="refresh-at">{{ currentEarthImageTime }}</div>

  <TimeLine :show="showTimeLine" @close="showTimeLine = false" />

  <Message />

  <Dialog
    v-model="downloadDialogVisible"
    :actions="['原图', '适应屏幕']"
    title="下载方式"
    @on-click="handleDownloadOption"
  />

  <Dialog
    v-model="setWallPaperDialogVisible"
    :actions="['仅当前照片', '实时照片']"
    title="将地球设为壁纸"
    @on-click="handleSetWallpaperOption"
  />
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Dialog from './components/Dialog.vue'
import Message from './components/Message.vue'
import TimeLine from './components/TimeLine.vue'
import {
  currentEarthImageTime,
  currentEarthImageUrl,
  getEarthImageList,
  latestEarthImage
} from './index'
import { Meteor, StarrySky } from './starrySky'

onMounted(() => {
  getEarthImageList()

  const starrySky = new StarrySky('canvasSky')
  starrySky.drawStars()

  const meteor = new Meteor('canvasMeteor')
  meteor.drawMeteor()
})

/**
 * 更新图片
 */
const imageShow = ref(true)

/**
 * 刷新
 */
const handleRefresh = () => {
  getEarthImageList()
}

/**
 * 自动刷新图片
 */
const timer = setInterval(handleRefresh, 1000 * 60 * 10)
onBeforeUnmount(() => {
  clearInterval(timer)
})

/**
 * 设为壁纸
 */
const setWallPaperDialogVisible = ref(false)
const handleSetWallpaper = () => {
  setWallPaperDialogVisible.value = true
}
const handleSetWallpaperOption = (index) => {
  switch (index) {
    case 0:
      window.electron.ipcRenderer.send('setWallpaperManual')
      break
    case 1:
      window.electron.ipcRenderer.send('setWallpaperRealTime')
      break
  }
}

/**
 * 下载操作
 */
const downloadDialogVisible = ref(false)
const handleDownload = () => {
  downloadDialogVisible.value = true
}
const handleDownloadOption = (index) => {
  console.log(index)
  alert(index)
}

/**
 * 历史图片
 */
const showTimeLine = ref(false)
const handleShowTimeLine = () => {
  showTimeLine.value = !showTimeLine.value
  if (!showTimeLine.value) {
    currentEarthImageUrl.value = latestEarthImage()
  }
}
</script>

<style scoped>
#canvasSky {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
}

#canvasMeteor {
  position: absolute;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.earth-img {
  position: absolute;
  z-index: 10;
  top: 50%;
  left: 50%;
  width: 75%;
  height: 75%;
  transform: translate(-50%, -50%);
  object-fit: contain;
}

.buttons {
  position: absolute;
  z-index: 11;
  top: 0;
  right: 32px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 32px;
}

.button {
  font-size: 12px;
  display: flex;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  text-align: center;
  opacity: 0.6;
}

@media screen and (minwidth: 1000px) {
  .button {
    font-size: 14px;
  }
}

.button:hover {
  opacity: 1;
}

.refresh-at {
  font-size: 14px;
  position: absolute;
  right: 0;
  bottom: 16px;
  left: 0;
  text-align: center;
}
</style>
