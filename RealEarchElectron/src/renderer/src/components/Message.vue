<template>
  <div :class="`top-message ${messageType} ${!!messageContent ? 'visible' : ''}`">
    {{ messageContent }}
  </div>
</template>

<script setup>
import { messageContent, messageType } from './message'
</script>

<style scoped>
.top-message {
  position: absolute;
  z-index: 101;
  top: -40px;
  left: 50%;
  padding: 4px 20px;
  transition: top 0.3s ease;
  transform: translateX(-50%);
  border-radius: 4px;
}

.top-message.visible {
  top: 32px;
  opacity: 1;
}

.success {
  background: #67c23a;
}

.info {
  background: #909399;
}

.error {
  background: #f56c6c;
}
</style>
