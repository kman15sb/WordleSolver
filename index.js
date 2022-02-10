const initializedList = require('./letterArrLong.json')

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

var bLetters = 'taescnybdfl'
var yLetters = 'our'
var gLetters = ['', '', '', '', 'r']

looseFilter = (word, arr) => {
    return word.some(letter => arr.includes(letter))
}

strictFilter = (word, arr) => {
    for (let i = 0; i < arr.length; i++) {
        if (!word.some(letter => arr[i].includes(letter))) {
            return false
        }
    }
    return true
}

exactPlacement = (word, arr) => {
    for (let i = 0; i < word.length; i++) {
        if (arr[i].length == 1 && word[i] != arr[i]) {
            return false
        }
    }
    return true
}

newList = (words, blankLetters, includedLetters, exactLetters) => {
    let wordArr = []
    for (let i = 0; i < words.length; i++) {
        if (!looseFilter(words[i], blankLetters.split('')) && strictFilter(words[i], includedLetters.split('')) && exactPlacement(words[i], exactLetters)) {
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
console.log('Guess: ' + list[nextGuess[1]].join(''), 'Entropy: ' + nextGuess[0])

t.stop()