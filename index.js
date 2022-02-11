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

var bLetters = ''
var yLetters = ['', '', '', '', '']
var gLetters = ['', '', '', '', '']

looseFilter = (word, arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (!word.includes(arr[i]) && arr[i] != '') {
            return false
        }
    }
    return true
}

looseFilter2 = (word, arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (arr.length > 0 && word.includes(arr[i])) {
            return false
        }
    }
    return true

}

whitelistPlacement = (word, arr) => {
    for (let i = 0; i < word.length; i++) {
        if (arr[i].length == 1 && word[i] != arr[i]) {
            return false
        }
    }
    return true
}

blacklistPlacement = (word, arr) => {
    for (let i = 0; i < word.length; i++) {
        if (arr[i] != '') {
            let letterArr = arr[i].split('')
            for (let j = 0; j < letterArr.length; j++) {
                if (word[i] == letterArr[j]) {
                    return false
                }
            }
        }
    }
    return true
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
    let sum = 0
    for (let i = 0; i < words.length; i++) {
        sum += frqMap[0][words[i].join('')]
    }

    let max = [0, 0]
    for (let i = 0; i < words.length; i++) {
        let patterns = getPatterns(words, i)
        let e = entropy(patterns)
        let pe = ((frqMap[0][list[i].join('')] / sum * 100) * e)
        if (pe > max[0]) {
            max = [pe, i]
        }
    }
    return max
}

var t = timer('Guess')

let list = newList(initializedList, bLetters, yLetters, gLetters)
let nextGuess = guessNext(list)

if (list[nextGuess[1]] != undefined) {
    console.log('Guess: ' + list[nextGuess[1]].join('') + ', Entropy Frq: ' + nextGuess[0])
} else {
    console.log('no result')
}


t.stop()