<template>
  <div :class="{ visible: modelValue }" class="dialog-mask" @click="handleClickOutside">
    <div class="dialog-window" @click="handleClickInside">
      <div class="title">{{ title }}</div>

      <div class="actions">
        <div v-for="(action, i) in actions" :key="action" @click="handleClick(i)">{{ action }}</div>
        <div @click="handleCancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  actions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue', 'onClick'])

const handleClick = (index) => {
  emit('onClick', index)
  emit('update:modelValue', false)
}
const handleClickOutside = () => {
  emit('update:modelValue', false)
}
const handleClickInside = (e) => {
  e.preventDefault()
  e.stopPropagation()
}
const handleCancel = () => {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.dialog-mask {
  position: absolute;
  z-index: 100;
  top: 10%;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  transition: all 0.2s ease-in-out;
  transform: scale(0.5);
  opacity: 0;
  background: rgba(0, 0, 0, 0.5);
}

.dialog-mask.visible {
  top: 0;
  transform: scale(1);
  opacity: 1;
}

.dialog-window {
  width: 400px;
  padding: 32px;
  color: #32363f;
  border-radius: 8px;
  background: #f2f2f2;
}

.title {
  font-size: 22px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  column-gap: 16px;
}

.actions > div {
  padding: 4px 12px;
  cursor: pointer;
  border-radius: 4px;
  background: #d8d8d8;
}

.actions > div:hover {
  background: #d0d0d0;
}
</style>
