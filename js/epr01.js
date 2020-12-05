export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let cast = parseRaw(textFile.result)
            createPairs(cast);
        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    let splitted = text.split('\r\n');
    return splitted.map(split => parseInt(split))
}

function createPairs(cast) {
    let pairs = []
    cast.forEach((valueA, indexA) => {
        let localPairs = [];
        cast.forEach((valueB, indexB) => {
            if(indexA !== indexB) {
               localPairs.push(valueA + valueB)
                if(valueA + valueB === 2020)
                    alert(valueA * valueB)
            }
        })
        pairs.push(localPairs)
    })

    return pairs;
}