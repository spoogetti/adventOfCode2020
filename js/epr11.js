export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let baseSeats = parseRaw(textFile.result)
            // 11-1 11-2
            let processedSeats = applyInstructions(baseSeats)

            while(!compareSeats(baseSeats, processedSeats)) {
                baseSeats = processedSeats
                processedSeats = applyInstructions(baseSeats)
            }

            console.log(countOccupiedSeats(processedSeats))
        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    let splitted = text.split('\r\n')
    return splitted.map(split => split.split(''));
}

function applyInstructions (seats) {
    let seatRowLength = seats[0].length
    let totalSeatAmount = seats.length * seatRowLength
    let newSeats = JSON.parse(JSON.stringify(seats))

    // coordonnées [y][x]
    for (let i = 0; i < totalSeatAmount; i++) {
        let seatPosX = i%seatRowLength
        let seatPosY = Math.floor(i/seatRowLength)
        // let adjacents = getAdjacent(seats, seatPosX, seatPosY)
        let adjacents = getFurtherAdjacent(seats, seatPosX, seatPosY)


        // console.log(adjacents)
        switch (seats[seatPosY][seatPosX]) {
            case 'L' :
                if(!adjacents.includes('#'))
                    newSeats[seatPosY][seatPosX] = '#'
                break
            case '#' :
                // if(adjacents.filter(seat => seat === '#').length >= 4)
                if(adjacents.filter(seat => seat === '#').length >= 5)
                    newSeats[seatPosY][seatPosX] = 'L'
        }
    }

    return newSeats;
}

function getAdjacent(seats, x, y) {
    let adjacents = []

    let seatRowLength = seats.length
    let seatColLength = seats[0].length

    if(x+1 < seatColLength)
        adjacents.push(seats[y][x+1])

    if(x+1 < seatColLength && y-1 > -1)
        adjacents.push(seats[y-1][x+1])

    if(x-1 > -1)
        adjacents.push(seats[y][x-1])

    if(x-1 > -1 && y-1 > -1)
        adjacents.push(seats[y-1][x-1])

    if(y+1 < seatRowLength)
        adjacents.push(seats[y+1][x])

    if(x-1 > -1 && y+1 < seatRowLength)
        adjacents.push(seats[y+1][x-1])

    if(y-1 > -1)
        adjacents.push(seats[y-1][x])

    if(y+1 < seatRowLength && x+1 < seatColLength)
        adjacents.push(seats[y+1][x+1])

    return adjacents
}

function countOccupiedSeats(seats) {
    let occupied = 0

    seats.forEach(row => row.forEach((cell) => {
        if(cell === '#')
            occupied++
    }))

    return occupied
}

function compareSeats(base, compared) {
    if(base.length !== compared.length)
        return false

    let totalSeatAmount = 0
    let seatRowLength = base[0].length
    base.forEach(seatRow => totalSeatAmount += seatRow.length)

    // coordonnées [y][x]
    for (let i = 0; i < totalSeatAmount; i++) {
        let seatPosX = i % seatRowLength
        let seatPosY = Math.floor(i / seatRowLength)
        if(base[seatPosY][seatPosX] !== compared[seatPosY][seatPosX])
            return false
    }

    return true
}

function getFurtherAdjacent(seats, x, y) {
    let adjacents = []

    // 11-1

    // let seatRowLength = seats.length
    // let seatColLength = seats[0].length

    // if(x+1 < seatColLength)
    //     adjacents.push(seats[y][x+1])
    //
    // if(x+1 < seatColLength && y-1 > -1)
    //     adjacents.push(seats[y-1][x+1])
    //
    // if(x-1 > -1)
    //     adjacents.push(seats[y][x-1])
    //
    // if(x-1 > -1 && y-1 > -1)
    //     adjacents.push(seats[y-1][x-1])
    //
    // if(y+1 < seatRowLength)
    //     adjacents.push(seats[y+1][x])
    //
    // if(x-1 > -1 && y+1 < seatRowLength)
    //     adjacents.push(seats[y+1][x-1])
    //
    // if(y-1 > -1)
    //     adjacents.push(seats[y-1][x])
    //
    // if(y+1 < seatRowLength && x+1 < seatColLength)
    //     adjacents.push(seats[y+1][x+1])

    // 11-2

    // haut
    let up = getFirstUp(seats, x, y)
    if(up)
        adjacents.push(up)

    // haut droite
    let upRight = getFirstUpRight(seats, x, y)
    if(upRight)
        adjacents.push(upRight)

    // droite
    let right = getFirstRight(seats, x, y)
    if(right)
        adjacents.push(right)

    // bas-droite
    let downRight = getFirstDownRight(seats, x, y)
    if(downRight)
        adjacents.push(downRight)

    // bas
    let down = getFirstDown(seats, x, y)
    if(down)
        adjacents.push(down)

    // bas-gauche
    let downLeft = getFirstDownLeft(seats, x, y)
    if(downLeft)
        adjacents.push(downLeft)

    // gauche
    let left = getFirstLeft(seats, x, y)
    if(left)
        adjacents.push(left)

    // haut-gauche
    let upLeft = getFirstUpLeft(seats, x, y)
    if(upLeft)
        adjacents.push(upLeft)

    return adjacents
}

function getFirstUp(seats, x, y) {
    while(y-1 > -1) {
        y--
        if(['#', 'L'].includes(seats[y][x]))
            return seats[y][x]
    }

    return false
}

function getFirstUpRight(seats, x, y) {
    let seatColLength = seats[0].length
    while(y-1 > -1 && x+1 < seatColLength) {
        y--
        x++
        if(['#', 'L'].includes(seats[y][x]))
            return seats[y][x]
    }

    return false
}

function getFirstRight(seats, x, y) {
    let seatColLength = seats[0].length
    while(x+1 < seatColLength) {
        x++
        if(['#', 'L'].includes(seats[y][x]))
            return seats[y][x]
    }

    return false
}

function getFirstDownRight(seats, x, y) {
    let seatRowLength = seats.length
    let seatColLength = seats[0].length

    while(x+1 < seatColLength && y+1 < seatRowLength) {
        x++
        y++
        if(['#', 'L'].includes(seats[y][x]))
            return seats[y][x]
    }

    return false
}

function getFirstDown(seats, x, y) {
    let seatRowLength = seats.length
    while(y+1 < seatRowLength) {
        y++
        if(['#', 'L'].includes(seats[y][x]))
            return seats[y][x]
    }

    return false
}

function getFirstDownLeft(seats, x, y) {
    let seatRowLength = seats.length
    while(y+1 < seatRowLength && x-1 > -1) {
        y++
        x--
        if(['#', 'L'].includes(seats[y][x]))
            return seats[y][x]
    }

    return false
}

function getFirstLeft(seats, x, y) {
    while(x-1 > -1) {
        x--
        if(['#', 'L'].includes(seats[y][x]))
            return seats[y][x]
    }

    return false
}

function getFirstUpLeft(seats, x, y) {
    while(x-1 > -1 && y-1 > -1) {
        x--
        y--
        if(['#', 'L'].includes(seats[y][x]))
            return seats[y][x]
    }

    return false
}