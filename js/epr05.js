export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            let seatIds = processSeatsIds(parsed)
            // 5-1
            // alert(highestId(seatIds))
            // 5-2
            alert(missingSeat(seatIds))
        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    let splitted = text.split('\r\n');
    return splitted.map(split => split.split(''))
}

function processSeatsIds(parsed) {
    let seats = []

    parsed.forEach((parse) => {
        let minRow = 0
        let maxRow = 127

        let minCol = 0
        let maxCol = 7

        parse.forEach((op) => {
            switch(op) {
                case 'F':
                    maxRow -= Math.floor((maxRow - minRow) / 2) + 1
                    break
                case 'B':
                    minRow += (Math.floor((maxRow - minRow) / 2)) + 1
                    break
                case 'L':
                    maxCol -= Math.floor((maxCol - minCol) / 2) + 1
                    break
                case 'R':
                    minCol += Math.floor((maxCol - minCol) / 2) + 1
                    break
            }
        })
        seats.push(maxRow * 8 + maxCol)
    })

    return seats;
}

function highestId(seatIds) {
    return Math.max(...seatIds)
}

function missingSeat(seats) {
    let missingSeats = []

    let sortedSeats = seats.sort(function(a, b) {
        return a - b;
    })

    let lastId = 88
    sortedSeats.forEach((seat) => {
        lastId++
        if(Number(seat) !== Number(lastId)) {
            missingSeats.push(lastId)
            lastId++
        }
    })

    return missingSeats
}