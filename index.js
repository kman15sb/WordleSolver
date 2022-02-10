const initializedList = require('./letterArrLong.json')
const frqMap = require('./frqMap.json')

timer = (name) => {
    var start = new Date();
    return {
        stop: () => {
            var end = new Date();
            var time = end.getTime() - start.getTime();
            console.log(name, 'finished in', time, 'ms');
        }
    }
};

var bLetters = 'tr'
var yLetters = ['', '', '', '', 'a']
var gLetters = ['', 'a', 'u', 's', 'e']

looseFilter = (word, arr) => {
    if (arr.length > 0) {
        for (let i = 0; i < word.length; i++) {
            if (arr.length > 0 && word.includes(arr[i])) {
                return true
            }
        }
        return false
    } else {
        return true
    }
}

looseFilter2 = (word, arr) => {
    if (arr.length > 0) {
        for (let i = 0; i < word.length; i++) {
            if (arr.length > 0 && word.includes(arr[i])) {
                return false
            }
        }
        return true
    } else {
        return true
    }
}

strictFilter = (word, arr) => {
    if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
            if (!word.some(letter => arr[i].includes(letter))) {
                return false
            }
        }
        return true
    } else {
        return true
    }
}

whitelistPlacement = (word, arr) => {
    if (arr.length > 0) {
        for (let i = 0; i < word.length; i++) {
            if (arr[i].length == 1 && word[i] != arr[i]) {
                return false
            }
        }
        return true
    } else {
        return true
    }
}

blacklistPlacement = (word, arr) => {
    if (arr.length > 0) {
        for (let i = 0; i < word.length; i++) {
            if (arr[i].length == 1 && word[i] == arr[i]) {
                return false
            }
        }
        return true
    } else {
        return true
    }
}

newList = (words, blankLetters, includedLetters, exactLetters) => {
    let wordArr = []
    for (let i = 0; i < words.length; i++) {
        if (looseFilter2(words[i], blankLetters.split('')) && looseFilter(words[i], includedLetters) && blacklistPlacement(words[i], includedLetters) && whitelistPlacement(words[i], exactLetters)) {
            wordArr.push(words[i])
        }
    }
    return wordArr
}

checkWordle = (word, guess) => {
    let pattern = ''
    for (let i = 0; i < word.length; i++) {
        if (word[i] == guess[i]) {
            pattern += 'g'
        } else if (word.some(letter => guess[i].includes(letter))) {
            pattern += 'y'
        } else {
            pattern += 'b'
        }
    }
    return pattern
}

entropy = (map) => {
    let entropy = 0
    let sum = [...map.values()].reduce((a, b) => a + b)
    for (let i = 0; i < [...map.values()].length; i++) {
        let probability = [...map.values()][i] / sum
        entropy -= (probability * (Math.log2(probability)))
    }
    return entropy
}

getPatterns = (words, index) => {
    let arr = []
    for (let i = 0; i < words.length; i++) {
        arr.push(checkWordle(words[index], words[i]))
    }
    return arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
}

guessNext = (words) => {
    let max = [0, 0]
    for (let i = 0; i < words.length; i++) {
        let patterns = getPatterns(words, i)
        let e = entropy(patterns)
        if (e > max[0]) {
            max = [e, i]
        }
    }
    return max
}

// likely = (words) => {
//     for (let i = 0; i < words.length; i++) {
//         let sig = 1/(1+Math.exp(-100*))
//     }
// }

var t = timer('Guess')

let list = newList(initializedList, bLetters, yLetters, gLetters)
let nextGuess = guessNext(list)

let tempSum = 0
for (let i = 0; i < list.length; i++) {
    tempSum += frqMap[0][list[i].join('')]
}
for (let i = 0; i < list.length; i++) {
    if (frqMap[0][list[i].join('')] / tempSum * 100 > 1) {
        console.log(list[i].join(''), (frqMap[0][list[i].join('')] / tempSum * 100).toFixed(2)+'%')
    }
}

console.log('Guess: ' + list[nextGuess[1]].join(''), 'Entropy: ' + nextGuess[0])


t.stop()