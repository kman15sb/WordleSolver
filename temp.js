const words = require('./letterArrLong.json')
const frqMap = require('./frqMap.json')
const fs = require('fs')


console.log(frqMap[0][words[0].join('')] + frqMap[0][words[1].join('')])

// let arr = frequencies.sort((a, b) => b[1] - a[1])
// fs.writeFileSync('./sortedFrqs.json', JSON.stringify(arr))

// let arr = []
// for (let i = 0; i < frequencies.length; i++) {
//     let sig = 1 / (1 + Math.exp(-50000 * frequencies[i][1]+2))
//     arr.push(sig)
// }
// console.log(arr)
// fs.writeFileSync('./temp2.json', arr)
