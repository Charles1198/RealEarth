<script setup>
import { reactive } from 'vue'

const versions = reactive({ ...window.electron.process.versions })
</script>

<template>
  <ul class="versions">
    <li class="electron-version">Electron v{{ versions.electron }}</li>
    <li class="chrome-version">Chromium v{{ versions.chrome }}</li>
    <li class="node-version">Node v{{ versions.node }}</li>
  </ul>
</template>

<style scoped>
.versions {
  font-family: 'Menlo', 'Lucida Console', monospace;
  position: absolute;
  bottom: 30px;
  display: inline-flex;
  overflow: hidden;
  align-items: center;
  margin: 0 auto;
  padding: 15px 0;
  border-radius: 22px;
  background-color: #202127;
  backdrop-filter: blur(24px);
}

.versions li {
  font-size: 14px;
  line-height: 14px;
  display: block;
  float: left;
  padding: 0 20px;
  opacity: 0.8;
  border-right: 1px solid var(--ev-c-gray-1);

  &:last-child {
    border: none;
  }
}
</style>
/
