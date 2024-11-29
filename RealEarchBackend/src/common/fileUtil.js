const fs = require('fs')
const path = require('path')

async function saveFile(file, path) {
  return new Promise((resolve) => {
    fs.writeFile(path, file, (err) => {
      if (err) {
        resolve({ data: '', err: err.message })
      } else {
        resolve({ data: path, err: '' })
      }
    })
  })
}

module.exports = { saveFile }