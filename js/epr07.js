export default function execute() {
    let filesInput = document.getElementById("file");
    filesInput.addEventListener("change", function (event) {
        let files = event.target.files;
        let file = files[0];
        let reader = new FileReader();
        reader.addEventListener("load", function (event) {
            let textFile = event.target;
            let parsed = parseRaw(textFile.result)
            // 6-1
            // alert([...new Set(findValidContainers(parsed, 'shiny gold').flat(Infinity))].length)
            // 6-2
            alert(countContainedBags(parsed, 'shiny gold'))
        });
        reader.readAsText(file);
    });
}

// bright white bags contain 1 shiny gold bag.
// muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
// dotted black bags contain no other bags.

function parseRaw(text) {
    let splitted = text.split('\r\n');
    let containers = [];
    splitted.forEach(split => {
        let containerContained = split.split(' bags contain ')
        let contained = containerContained[1].split(' bag')

        contained = contained.map((bag) => {
            while([',', 's', ' ', '.'].includes(bag.charAt(0))) {
                bag = bag.substring(1);
            }

            if(bag !== '') {
                let containerAmount = bag.split(' ')
                return [ parseInt(containerAmount[0]) , containerAmount[1] + ' ' + containerAmount[2]]
            } else
                return bag;
        })

        contained = contained.filter((bag) => {
            return bag !== '' && bag[1] !== 'other undefined'
        })

        containers.push([containerContained[0], contained])
    });

    return containers
}

// 6-1
function findValidContainers(containers, seekedContainer) {
    let valid = []

    containers.forEach((container) => {
        container[1].forEach((contained) => {
            if(contained[1] === seekedContainer) {
                valid.push(container[0])
                valid.push(findValidContainers(containers, container[0]))
            }
        })
    })

    return valid
}

// 6-2
function countContainedBags(containers, seekedContainer) {
    let valid = 0;

    containers.forEach((container) => {
        if(container[0] === seekedContainer) {
            container[1].forEach((contained) => {
                valid += contained[0] * countContainedBags(containers, contained[1]) + contained[0]
            })
        }

    })

    return valid
}


