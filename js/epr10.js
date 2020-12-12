export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            // 10-1
            let sortedAdapters = adapterList(parsed)
            // console.log(sortedAdapters[1], sortedAdapters[2], sortedAdapters[1] * sortedAdapters[2], sortedAdapters[0])
            // 10-2
            let exhaustivePossibilities = gatherPossibilities(sortedAdapters[0])
            // console.log(sortedAdapters[0], sortedAdapters[0].length, sortedAdapters[0][sortedAdapters[0].length - 1])
            adapterListList(exhaustivePossibilities,  [[0]], sortedAdapters[0][sortedAdapters[0].length - 1])
            console.log(countPossibilities(sortedAdapters[0], exhaustivePossibilities))

        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    return text.split('\r\n').map(value => parseInt(value));
}

function adapterList (parsed) {
    let sortedList = []
    let difOne = 0
    let difThree = 1
    let neighbors = 0
    let jolts = 0

    for (let i = 0; i < parsed.length; i++) {
        let nextAdapter = Math.min(...parsed.filter((parse) => parse < jolts + 4 && parse > jolts))
        sortedList.push(nextAdapter)

        if(nextAdapter - 1 === jolts) {
            difOne++
            neighbors += parsed.filter((parse) => parse < jolts + 4 && parse > jolts).length - 1
        }
        if(nextAdapter - 3 === jolts) {
            difThree++
        }

        jolts = nextAdapter
    }
    return [sortedList, difOne, difThree];
}

function gatherPossibilities(sorted) {
    let possibilities = new Map()

    possibilities[0] = sorted.filter((parse) => parse < 4 && parse > 0)
    sorted.forEach((sort) => {
        possibilities[sort] = sorted.filter((parse) => parse < sort + 4 && parse > sort)
    })

    return possibilities
}

function adapterListList (possibilities, permutations, endValue) {
    let endOfLoop = false
    let endPermutations = []
    // let endPermutations = 0

    while(!endOfLoop) {
        let shiftedPermutation = permutations.shift()

        // console.log(shiftedPermutation[shiftedPermutation.length - 1], endValue)
        if(shiftedPermutation[shiftedPermutation.length - 1] === endValue) {
            // console.log(shiftedPermutation)
            endPermutations.push(shiftedPermutation)
            // endPermutations++
        }
        else {
            let lastElemOfPermu = shiftedPermutation[shiftedPermutation.length - 1]
            let nextPermus = possibilities[lastElemOfPermu]
            nextPermus.forEach((permu) => {
                let newPermutation = shiftedPermutation.slice()
                newPermutation.push(permu)
                permutations.push(newPermutation)
            })
        }

        endOfLoop = permutations.length === 0
    }

    console.log(endPermutations)
}

function countPossibilities(perfectPermutation, possibilities) {
   let count = 1
    // console.log(perfectPermutation, possibilities)

    perfectPermutation.unshift(0)
    for (let i = 0; i < perfectPermutation.length; i++) {
        let localPossibilities = possibilities[perfectPermutation[i]].filter((possibility) => perfectPermutation.includes(possibility)).length
        count += localPossibilities !== 0 ? localPossibilities : 1

        // if(possibilities[perfectPermutation[i]].length === 0 && perfectPermutation.length - 1 > 0) {
        //     // console.log(perfectPermutation.slice(0, i), count, countPossibilities(perfectPermutation.slice(0, i), possibilities))
        //     count -= countPossibilities(perfectPermutation.slice(0, i), possibilities)
        // }
    }
    // perfectPermutation.forEach((permutation) => {
    //     count *= possibilities[permutation].length ? possibilities[permutation].length : 1
    // })

    return count
}

// 1
// 2
// 4
// 7
// 13
// 24
// 44
// 81