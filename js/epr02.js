export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            countInvalidOccurences(parsed);
        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    let splitted = text.split('\r\n');

    splitted = splitted.map((split) => {
        // 5-10 s: nskdmzwrmpmhsrzts
        let split1 = split.split(':');
        let split2 = split1[0].split(' ');

        let split3 = split2[0].split("-");

        // console.log(split1, split2, split3)
        return [split3[0], split3[1] ,split2[1], split1[1]];
    })

    return splitted;
}

function countInvalidOccurences(parsed) {
    let invalid = 0
    parsed.forEach((parse) => {
        let occOfLtrInStr = getOccOfLetrInStr(parse[2], parse[3]);
        if(occOfLtrInStr < parseInt(parse[0]) || occOfLtrInStr > parseInt(parse[1]))
            invalid++
    })

    alert(invalid)
    return invalid
}

function getOccOfLetrInStr(ltr, str) {
    console.log(ltr, str, (str.match(new RegExp(ltr, "g")) || []).length)
    return (str.match(new RegExp(ltr, "g")) || []).length
}