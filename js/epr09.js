export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            // 9-1
            // console.log(firstInvalid(parsed))
            // 9-2
            let contiguous = getContiguous(firstInvalid(parsed), parsed)
            console.log(Math.max(...contiguous) + Math.min(...contiguous))
        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    return text.split('\r\n').map(value => parseInt(value));
}

function firstInvalid (parsed) {
    let last25 = parsed.slice(0, 25)

    for (let i = 25; i < parsed.length; i++) {
        let value = parsed[i]

        if(!includesSumOf(value, last25))
            return value
        else
            last25.shift()
            last25.push(value)
    }
    return false;
}

function includesSumOf(value, last25) {
    let sums = []

    for (let i = 0; i < 25; i++) {
        let sum = []
        for (let j = 0; j < 25; j++) {
            if(i !== j)
                sum.push(last25[i] + last25[j])
        }
        sums.push(sum)
    }

    return sums.flat(1).includes(value)
}

function getContiguous(value, parsed) {
    let contiguous = []

    for (let i = 0; i < parsed.length; i++) {
        let contiguousSum = contiguous.reduce((a, b) => a + b, 0)

        if(contiguousSum === value)
            return contiguous
        else if(contiguousSum < value)
            contiguous.push(parsed[i])
        else {
            return shiftAndAdd(value, contiguous, i + 1, parsed);
        }
    }

    return 'no contiguous found getContiguous'
}

function shiftAndAdd(value, contiguous, i, parsed) {
    if(i > parsed.length || contiguous.length < 2)
        return 'no contiguous found shiftAndAdd'

    let shiftedContiguous = shiftValues(value, contiguous)
    let contiguousSum = shiftedContiguous.reduce((a, b) => a + b, 0)

    if (contiguousSum === value) {
        return shiftedContiguous
    } else if(contiguousSum < value) {
        contiguous.push(parsed[i])
        return shiftAndAdd(value, contiguous, i + 1, parsed)
    }
}

function shiftValues(value, contiguous) {
    while(contiguous.reduce((a, b) => a + b, 0) > value)
        contiguous.shift()

    return contiguous
}