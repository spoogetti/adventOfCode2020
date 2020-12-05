export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            countValidOccurences(parsed);
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

        // 2-1
        // return [split3[0], split3[1] ,split2[1], split1[1]];
        // 2-2
        return [split3[0], split3[1] ,split2[1], getLettersInPos(split1[1], split3[0], split3[1])];
    })

    return splitted;
}

function countValidOccurences(parsed) {
    let valid = 0
    parsed.forEach((parse) => {
        let occOfLtrInStr = getOccOfLetrInStr(parse[2], parse[3]);
        // 2-1
        // if(occOfLtrInStr >= parseInt(parse[0]) && occOfLtrInStr <= parseInt(parse[1]))
        //     valid++
        // 2-2
        if(occOfLtrInStr === 1)
            valid++
    })

    alert(valid)
    return valid
}

function getOccOfLetrInStr(ltr, str) {
    return (str.match(new RegExp(ltr, "g")) || []).length
}

function getLettersInPos(str, posA, posB) {
    return str.charAt(parseInt(posA)) + str.charAt(parseInt(posB));
}