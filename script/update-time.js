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

function getCommitFiles() {
  return new Promise((resolve, reject) => {
    const child = spawn('git', ['diff', '--name-only', 'HEAD', 'HEAD~'], { cwd: process.cwd() })

    let output = ''
    child.stdout.on('data', (d) => (output += String(d)))

    child.on('close', () => {
      resolve(output.split('\n').filter(Boolean))
    })
    child.on('error', reject)
  })
}

async function updateTimestamp() {
  const promises = []
  let times = {}
  const files = []
  if (fs.existsSync('cache/timestamp.json')) {
    const reg = /\.md$/
    const commitFiles = await getCommitFiles()
    files.push(...commitFiles.filter((file) => reg.test(file)))
    times = fs.readJSONSync('cache/timestamp.json')
  } else {
    files.push(...glob.sync(`docs/**/*.md`))
  }
  // 遍历docs目录
  for (let file of files) {
    // 替换斜杠，统一分割符为‘/’
    file = file.replace(/\\/g, '/')
    times[file] = await getGitTimestamp(file)
  }

  if (!fs.existsSync('cache')) {
    fs.mkdirSync('cache')
  }
  fs.writeJSONSync('cache/timestamp.json', times, { spaces: 2 })
}

updateTimestamp()
