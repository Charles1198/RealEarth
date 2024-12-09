import { ref } from 'vue'

export const latestEarthImage = () =>
  `http://real-earth.oss-cn-beijing.aliyuncs.com/latest/latest.png?_=${new Date().getTime()}`

export const currentEarthImageUrl = ref(latestEarthImage())
export const currentEarthImageTime = ref()

export const earthImageList = ref([])

export const getEarthImageList = async () => {
  earthImageList.value = []
  const { code, data } = await window.electron.ipcRenderer.invoke('getEarthImages')
  if (code !== 200) {
    return
  }

  earthImageList.value = data.map((item) => {
    const { updateAt, url } = item
    const time = updateAt.slice(0, 16)
    const date = new Date(`${time}Z`)
    let beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000)
    beijingTime = beijingTime.toISOString().replace('T', ' ').substring(0, 16)
    return { time, beijingTime, imageUrl: url }
  })

  if (earthImageList.value.length > 0) {
    currentEarthImageTime.value = earthImageList.value[0].beijingTime
  }
}
