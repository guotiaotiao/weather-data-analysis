const { once } = require('events')
const { createReadStream } = require('fs')
const { createInterface } = require('readline')

const loadWeatherFile = async (filename) => {
  try {
    const rl = createInterface({
      input: createReadStream(filename),
      crlfDelay: Infinity,
    })

    let minTempDiff = 10000
    let result
    let month
    let year

    rl.on('line', (line) => {
      const arr = removeEmptyFromArr(line.split(' '))
      if (arr[0] === 'MMU') {
        month = arr[1]
        year = arr[2]
      } else if (
        arr.length &&
        !isNaN(+arr[1]) &&
        minTempDiff > arr[1] - arr[2]
      ) {
        minTempDiff = arr[1] - arr[2]
        result = arr
      }
    })

    await once(rl, 'close')
    console.log(
      `The day with the smallest temperature diffrence is ${result[0]} ${month} ${year},difference is ${minTempDiff}, min temperature is ${result[2]}, max temperature is ${result[1]}`
    )
  } catch (err) {
    console.log(err)
  }
}

const removeEmptyFromArr = (arr) => {
  return arr.filter((item) => !!item)
}

loadWeatherFile('weather.txt')
