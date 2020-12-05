export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            // 3-1
            // let path = travel(parsed);
            // countTreesOnPath(path);
            // 3-2
            let paths = travels(parsed, [[1,1], [3, 1], [5, 1], [7, 1], [1, 2]])
            alert(countTreesOnPaths(paths))
        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    let splitted = text.split('\r\n');
    return splitted.map(split => split.split(''))
}

// 3-1
// function travel(parsed) {
//     let path = []
//     const pathWidth = parsed[0].length;
//     for (let y = 1; y < parsed.length; y++) {
//         let x = (y*3)%pathWidth
//         path.push(parsed[y][x])
//     }
//
//     return path;
// }

function travels(parsed, slopes) {
    let paths = []
    const pathWidth = parsed[0].length;
    // console.log(pathWidth)
    slopes.forEach((slope) => {
        console.log()
        let path = [];
        let i = 0;
        for (let y = 0; y < parsed.length; y += slope[1]) {
            let x = (i*slope[0])%pathWidth
            path.push(parsed[y][x])
            i++
        }

        paths.push(path)
    })

    return paths;
}

function countTreesOnPath(path) {
    let trees = 0
    path.forEach(pos => pos === "#" ? trees++ : null);

    return trees;
}

function countTreesOnPaths(paths) {
    let multipliedResult = 1;
    paths.forEach((path) => {
        // console.log(countTreesOnPath(path))
        multipliedResult *= countTreesOnPath(path)
    })

    return multipliedResult
}