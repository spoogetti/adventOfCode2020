export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            let validPassports = countValidPassports(parsed)
            alert(validPassports)
        });
        reader.readAsText(file);
    });
}

function parseRaw(text) {
    let splitted = text.split('\r\n');
    let grouped = [];
    let group = '';
    splitted.forEach(split => {
        if(split === "") {
            grouped.push(group)
            group = ''
        } else
            group += ' ' + split
    });
    return grouped
}

function countValidPassports(parsed) {
    let valid = 1

    parsed.forEach((parse) => {
        if(validPassport(parse) && validateFields(explodeFields(parse)))
            valid++
    })

    return valid;
}

function validPassport(str) {
    return (str.match(/byr/g) || []).length === 1
        && (str.match(/iyr/g) || []).length === 1
        && (str.match(/eyr/g) || []).length === 1
        && (str.match(/hgt/g) || []).length === 1
        && (str.match(/hcl/g) || []).length === 1
        && (str.match(/ecl/g) || []).length === 1
        && (str.match(/pid/g) || []).length === 1
}

function explodeFields(passport) {
    return passport.split(' ')
}

function validateFields (passportArr) {
    let valid = true

    passportArr.forEach((field) => {
        let keyValue = field.split(':')

        switch(keyValue[0]) {
            case 'byr' :
                if(parseInt(keyValue[1]) < 1920 || parseInt(keyValue[1]) > 2002) {
                    valid = false
                }
                break
            case 'iyr' :
                if(parseInt(keyValue[1]) < 2010 || parseInt(keyValue[1]) > 2020) {
                    valid = false
                }
                break
            case 'eyr' :
                if(parseInt(keyValue[1]) < 2020 || parseInt(keyValue[1]) > 2030) {
                    valid = false
                }
                break
            case 'hgt' :
                if(!validateHgt(keyValue[1])) {
                    valid = false
                }
                break
            case 'hcl' :
                if((keyValue[1].match(/#\b[0-9A-Fa-f]{6}\b/gi) || []).length === 0) {
                    valid = false
                }
                break
            case 'ecl' :
                if(!validateEcl(keyValue[1])) {
                    valid = false
                }
                break
            case 'pid' :
                if((keyValue[1].match(/\b[0-9]{9}\b/gi) || []).length === 0) {
                    valid = false
                }
                break
        }
    })

    return valid;
}

function validateHgt(value) {
    if(value.match(/cm/g)) {
        let parsedValue = parseInt(value.split('cm'))
        return parsedValue >= 150 && parsedValue <= 193
    }

    if(value.match(/in/g)) {
        let parsedValue = parseInt(value.split('in'))
        return parsedValue >= 59 && parsedValue <= 76
    }

    return false
}

function validateEcl(str) {
    return (str.match(/amb/g) || []).length === 1
        || (str.match(/blu/g) || []).length === 1
        || (str.match(/brn/g) || []).length === 1
        || (str.match(/gry/g) || []).length === 1
        || (str.match(/grn/g) || []).length === 1
        || (str.match(/hzl/g) || []).length === 1
        || (str.match(/oth/g) || []).length === 1
}