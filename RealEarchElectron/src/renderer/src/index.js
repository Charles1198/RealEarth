import { ref } from 'vue'

export const latestEarthImage = () =>
  `http://localhost:3000/earth_latest.png?_=${new Date().getTime()}`

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
    const [year, month, day, hour, minute] = item.split('.')[0].split('_')
    const time = `${year}-${month}-${day} ${hour}:${minute}`
    const imageUrl = `http://localhost:3000/earth/${item}`
    const date = new Date(`${time}Z`)
    let beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000)
    beijingTime = beijingTime.toISOString().replace('T', ' ').substring(0, 16)
    return { time, beijingTime, imageUrl }
  })

  if (earthImageList.value.length > 0) {
    currentEarthImageTime.value = earthImageList.value[0].beijingTime
  }
}
