export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            alert(processAnswers(parsed).reduce((a, b) => a + b, 0))
        });
        reader.readAsText(file);
    });
}

// 6-1
// function parseRaw(text) {
//     let splitted = text.split('\r\n');
//     let grouped = [];
//     let group = '';
//     splitted.forEach(split => {
//         if(split === "") {
//             grouped.push(group)
//             group = ''
//         } else
//             group += split
//     });
//     return grouped
// }

// 6-2
function parseRaw(text) {
    let splitted = text.split('\r\n');
    let grouped = [];
    let group = [];
    splitted.forEach(split => {
        if(split === "") {
            grouped.push(group)
            group = []
        } else
            group.push(split)
    });
    return grouped
}

// 6-1
// function processAnswers(parsed) {
//     let uniqueAnswersAmount = []
//
//     parsed.forEach((parse) => {
//        uniqueAnswersAmount.push(makeUnique(parse).length)
//     })
//
//     return uniqueAnswersAmount;
// }

// function makeUnique(str) {
//     return String.prototype.concat(...new Set(str))
// }

// 6-2
function processAnswers(parsed) {
    let uniqueAnswersAmount = []

    parsed.forEach((parse) => {
        uniqueAnswersAmount.push(getUnique(parse).length)
    })

    return uniqueAnswersAmount;
}

function getUnique(answers) {
    let checkedLeters = []
    let validAnswers = []

    answers.forEach((answer) => {
        for (let i = 0; i < answer.length; i++) {
            if(!checkedLeters.includes(answer.charAt(i)))
                if(answerMatchAll(answer.charAt(i), answers)) {
                    validAnswers.push(answer.charAt(i))
                    checkedLeters.push(answer.charAt(i))
                }
        }
    })

    return validAnswers
}

function answerMatchAll(letter, answers) {
    return !answers.some((answer) => {
        return (answer.match(letter) || []).length === 0
    })
}