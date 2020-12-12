export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let instructions = parseRaw(textFile.result)
            // 12-1
            // console.log(applyInstructions(instructions))
            // 12-2
            console.log(applyTrueInstructions(instructions))

        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    let splitted = text.split('\r\n')
    return splitted.map(split => {
        let furtherSplit = split.split('')
        let firstChar = furtherSplit.shift()
        furtherSplit = furtherSplit.join('')
        return [firstChar, parseInt(furtherSplit)]
    });
}

function applyInstructions (instructions) {
    let boatDir = 'E'
    let northSouth = 0
    let eastWest = 0


    for (let i = 0; i < instructions.length; i++) {
        switch (instructions[i][0]) {
            case 'N' :
                northSouth += instructions[i][1]
                break
            case 'S' :
                northSouth -= instructions[i][1]
                break
            case 'E' :
                eastWest += instructions[i][1]
                break
            case 'W' :
                eastWest -= instructions[i][1]
                break
            case 'L' :
                // console.log('pos1', boatDir)
                boatDir = turnLeft(boatDir, instructions[i][1])
                // console.log('pos2', boatDir)
                break
            case 'R' :
                boatDir = turnRight(boatDir, instructions[i][1])
                break
            case 'F' :
                switch (boatDir) {
                    case 'N' :
                        northSouth += instructions[i][1]
                        break
                    case 'S' :
                        northSouth -= instructions[i][1]
                        break
                    case 'E' :
                        eastWest += instructions[i][1]
                        break
                    case 'W' :
                        eastWest -= instructions[i][1]
                        break
                }
                break
        }
    }

    return Math.abs(northSouth) + Math.abs(eastWest);
}

function turnLeft(boatDir, degrees) {
    let rads = getRadsFromDirection(boatDir)

    console.log('pos1', rads, boatDir, 'left')

    rads += (Math.PI/180) * degrees
    rads = rads%(2 * Math.PI)

    console.log('pos2', rads, getDirectionFromRads(rads))

    return getDirectionFromRads(rads)
}

function turnRight(boatDir, degrees) {
    let rads = getRadsFromDirection(boatDir)

    console.log('pos1', rads, boatDir, 'right')

    rads -= (Math.PI/180) * degrees
    rads = rads%(2 * Math.PI)
    if(rads < 0)
        rads += (Math.PI*2)

    console.log('pos2', rads, getDirectionFromRads(rads))

    return getDirectionFromRads(rads)
}

function getRadsFromDirection(boatDir) {
    switch (boatDir) {
        case 'N' :
            return Math.PI/2
        case 'S' :
            return (3*Math.PI)/2
        case 'E' :
            return 0
        case 'W' :
            return Math.PI
        default :
            console.log('Error getRadsFromDirection')
    }
}

function getDirectionFromRads(rads) {
    if(rads > Math.PI/4 && rads < (3*Math.PI)/4)
        return 'N'

    else if(rads > (3*Math.PI)/4 && rads < (5*Math.PI)/4)
        return 'W'

    else if(rads > (5*Math.PI)/4 && rads < (7*Math.PI)/4)
        return 'S'

    else
        return 'E'
}

function applyTrueInstructions(instructions) {
    let northSouth = 0
    let eastWest = 0
    let newCoords = []

    let wpNorthSouth = 1
    let wpEastWest = 10

    for (let i = 0; i < instructions.length; i++) {
        switch (instructions[i][0]) {
            case 'N' :
                wpNorthSouth += instructions[i][1]
                break
            case 'S' :
                wpNorthSouth -= instructions[i][1]
                break
            case 'E' :
                wpEastWest += instructions[i][1]
                break
            case 'W' :
                wpEastWest -= instructions[i][1]
                break
            case 'L' :
                newCoords = turnWpLeft(wpNorthSouth, wpEastWest, instructions[i][1])
                wpNorthSouth = newCoords[0]
                wpEastWest = newCoords[1]
                break
            case 'R' :
                newCoords = turnWpRight(wpNorthSouth, wpEastWest, instructions[i][1])
                wpNorthSouth = newCoords[0]
                wpEastWest = newCoords[1]
                break
            case 'F' :
                for (let j = 0; j < instructions[i][1]; j++) {
                    northSouth += wpNorthSouth
                    eastWest += wpEastWest
                }
                break
        }
    }

    return Math.abs(northSouth) + Math.abs(eastWest);
}

function turnWpLeft(wpNorthSouth, wpEastWest, degrees) {
    let tmp = 0
    switch (degrees) {
        case 90 :
            tmp = -wpNorthSouth
            wpNorthSouth = wpEastWest
            wpEastWest = tmp
            break
        case 180 :
            wpNorthSouth = -wpNorthSouth
            wpEastWest = -wpEastWest
            break
        case 270 :
            tmp = -wpEastWest
            wpEastWest = wpNorthSouth
            wpNorthSouth = tmp
            break
    }

    return [wpNorthSouth, wpEastWest]
}

function turnWpRight(wpNorthSouth, wpEastWest, degrees) {
    let tmp = 0
    switch (degrees) {
        case 90 :
            tmp = -wpEastWest
            wpEastWest = wpNorthSouth
            wpNorthSouth = tmp
            break
        case 180 :
            wpNorthSouth = -wpNorthSouth
            wpEastWest = -wpEastWest
            break
        case 270 :
            tmp = -wpNorthSouth
            wpNorthSouth = wpEastWest
            wpEastWest = tmp
            break
    }

    return [wpNorthSouth, wpEastWest]
}