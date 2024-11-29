import { ref } from 'vue'

export const messageContent = ref('')
export const messageType = ref('info')

export const TopMessage = {
  success: function (message) {
    addMessage('success', message)
  },
  error: function (message) {
    addMessage('error', message)
  },
  info: function (message) {
    addMessage('info', message)
  }
}

let timer
function addMessage(type, message) {
  messageType.value = type
  messageContent.value = message

  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    messageContent.value = ''
  }, 3000)
}
