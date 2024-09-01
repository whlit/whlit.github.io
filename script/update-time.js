const glob = require('glob')
const fs = require('fs-extra')
const { spawn } = require('cross-spawn')
const { basename, dirname } = require('path')

const cache = new Map()

function getGitTimestamp(file) {
  const cached = cache.get(file)
  if (cached) return cached

  if (!fs.existsSync(file)) return 0

  return new Promise((resolve, reject) => {
    const child = spawn('git', ['log', '-1', '--pretty="%ai"', basename(file)], { cwd: dirname(file) })

    let output = ''
    child.stdout.on('data', (d) => (output += String(d)))

    child.on('close', () => {
      const timestamp = +new Date(output)
      cache.set(file, timestamp)
      resolve(timestamp)
    })

    child.on('error', reject)
  })
}

function updateTimestamp() {
  const promises = []
  const times = {}
  // 遍历docs目录
  glob.sync(`docs/**/*.md`).forEach((file) => {
    // 替换斜杠，统一分割符为‘/’
    file = file.replace(/\\/g, '/')
    const time = getGitTimestamp(file)
    promises.push(time)
    time.then((data) => {
      times[file] = data
    })
  })

  Promise.all(promises)
    .then(() => {
      if (!fs.existsSync('cache')) {
        fs.mkdirSync('cache')
      }
      fs.writeJSONSync('cache/timestamp.json', times, { spaces: 2 })
    })
    .catch((err) => {
      console.log(err)
    })
}

updateTimestamp()
