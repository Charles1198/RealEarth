export const getLatestRefreshTime = fetchRequest('http://localhost:3000/earth/latestTime')

export const getEarthImages = fetchRequest('http://localhost:3000/earth/images')

function fetchRequest(url) {
  return new Promise((resolve) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => resolve(data))
      .catch((error) => resolve({ code: 500, message: error.message }))
  })
}
