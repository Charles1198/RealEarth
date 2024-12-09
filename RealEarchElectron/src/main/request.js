export const getEarthImages = fetchRequest('http://jiayueji.cn:3001/earth/past24hour')

function fetchRequest(url) {
  return new Promise((resolve) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => resolve({ code: 500, message: error.message }))
  })
}
