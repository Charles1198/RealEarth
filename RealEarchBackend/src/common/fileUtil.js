const fs = require('fs')

async function saveFile(file, filePath) {
  const dir = filePath.substring(0, filePath.lastIndexOf('\\'))
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  return new Promise((resolve) => {
    fs.writeFile(filePath, file, (err) => {
      if (err) {
        resolve({ data: '', err: err.message })
      } else {
        resolve({ data: filePath, err: '' })
      }
    })
  })
}

module.exports = { saveFile }