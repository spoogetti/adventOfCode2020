export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            // 7-1
            // console.log(runProgram(parsed))
            // 7-2
            console.log(repairLoopAndRun(parsed))
        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    return text.split('\r\n');
}

function runProgram (program) {
    let acc = 0
    let visited = []
    let instructions = []

    let noloop = false
    for (let i = 0; i < program.length; i++) {
        let keyValue = program[i].split(' ')

        if(visited.includes(i)) {
            break
        }

        visited.push(i);
        instructions.push(keyValue[0])

        switch(keyValue[0]) {
            case 'acc' :
                acc += parseInt(keyValue[1])
                break
            case 'jmp' :
                i += parseInt(keyValue[1]) - 1
                break
            case 'nop' :
                break
        }

        noloop = i === program.length - 1
    }

    return [acc, visited, instructions, noloop];
}

function repairLoopAndRun(parsed) {
    let programsRun = []

    let jmpInstructions = getJmpInstructions(parsed.map(parse => parse.split(' ')[0]))
    // checkIntruction(parsed, jmpInstructions)

    jmpInstructions.forEach((jmp) => {
        // console.log(parsed[jmp])
        programsRun.push(modifyJmp(parsed, jmp))
        // console.log(parsed[jmp])
    })

    let nopInstructions = getNopInstructions(parsed.map(parse => parse.split(' ')[0]))
    // checkIntruction(parsed, jmpInstructions)

    nopInstructions.forEach((jmp) => {
        programsRun.push(modifyNop(parsed, jmp))
    })

    return programsRun.filter((program => program[3] === true))
}

function getJmpInstructions(instructions) {
    let i = 0
    // console.log(instructions)
    instructions = instructions.map((instruction) => {
        if(instruction === 'jmp')
            instruction = i
        else
            instruction = -1
        i++
        return instruction
    })

    return instructions.filter(instruction => instruction !== -1)
}

function modifyJmp(parsed, jmpIndex) {
    parsed[jmpIndex] = "nop " + parsed[jmpIndex].split(' ')[1]
    let programRun = runProgram(parsed)
    parsed[jmpIndex] = "jmp " + parsed[jmpIndex].split(' ')[1]
    return programRun
}

function getNopInstructions(instructions) {
    let i = 0
    instructions = instructions.map((instruction) => {
        if(instruction === 'nop')
            instruction = i
        else
            instruction = -1
        i++
        return instruction
    })

    return instructions.filter(instruction => instruction !== -1)
}

function modifyNop(parsed, nopIndex) {
    parsed[nopIndex] = "jmp " + parsed[nopIndex].split(' ')[1]
    let programRun = runProgram(parsed)
    parsed[nopIndex] = "nop " + parsed[nopIndex].split(' ')[1]
    return programRun
}

function checkIntruction(parsed, instructions) {
    instructions.forEach(instruction => console.log(parsed[instruction]))
}