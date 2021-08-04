// Ar(G)HLL{L}Tab

// #################################
//
// TEMPLATES
//
// #################################

const html = String.raw;

const pointTemplate = (amount, color) => html`<span class="${color} points">${"⬤".repeat(amount)}</span>`;
const innerLineTemplate = (startMIL, endMIL, points, color) => html`<div class="${color} innerLine"><span class="startMIL">${startMIL}</span><span class="pointsContainer">${points.join("")}</span><span class="endMIL">${endMIL}</span></div>`;
const lineTemplate = (fromDistance, toDistance, lines) => html`<div class="line"><span class="distanceContainer"><span class="fromDistance">${fromDistance}</span> - <span class="toDistance">${toDistance}</span></span><span class="innerLinesContainer">${lines.join("")}</span></div>`;
const subSectionTemplate = (lines) => html`<div class="subSection">${lines.join("")}</div>`;
const sectionTemplate = (title, subsection) => html`<div class="section"><h3 class="sectionTitle">${title}</h3>${subsection.join("")}</div>`;
const pageTemplate = (sections) => html`<div class="page">${sections.join("")}</div>`;

// #################################
//
// GENERATOR
//
// #################################

/**
 * The formular for each artillery is `x * distance + y = mil` where distance is the distance to the target
 * and mil the height the artillery has to be set to hit said target. 
 * You can easily get these values by solving a simple system of equations using two sets of results from a 
 * given artillery information table on the left once inside the artillery. To achieve optimal results its recommended
 *  to use the maximum and minium distance given in the table.
 */

const US_GER_CalculatorConstants = {
    x: -89 / 375, 
    y: 15026 / 15
};

const RUS_CalculatorConstants = {
    x: -16 / 75,
    y: 3424 / 3
}

function calculate(distance, constants) {
    return Math.round(constants.x * distance + constants.y);
}

/**
 * 
 * @returns 
 */
function generateData() {
    var subSectionSize = settings.sectionSize / settings.subSections;
    var data = {};

    // loop through each section
    for(var section = settings.startDistance; section <= settings.endDistance; section += settings.sectionSize) {
        var subSections = [];

        // loop through each subsection
        for (var subSection = 0; subSection < settings.subSections; subSection++) {
            var lines = [];

            // loop through each line in that subsection
            for (var line = 0; line < subSectionSize / settings.lineSize; line++) {
                var start = section + subSection * subSectionSize + line * settings.lineSize;
                var end = start + settings.lineSize;

                var constants = [];

                // loop through all the constants
                for (var constantIndex in settings.calculatorConstants) {
                    var constant = settings.calculatorConstants[constantIndex];
                    var currentMils = calculate(start, constant);
                    var currentDistance = start;
                    var res = 0;
                    var values = [];

                    // loop through each calculated value 
                    for (var i = start; i <= end + settings.lineShift; i++) {
                        res = calculate(i, constant);
                        
                        if (res !== currentMils) {
                            values.push({
                                mil: currentMils,
                                distance: Math.abs(i - currentDistance)
                            });

                            currentDistance = i;
                            currentMils = res;
                        }
                    }

                    values.push({
                        mil: calculate(end + settings.lineShift, constant),
                        distance: Math.abs(end - currentDistance)
                    });
                    constants.push(values);
                }

                lines.push({
                    start: start,
                    end: end,
                    constants: constants
                });
            }
            subSections.push(lines);
        }
        data[section] = subSections;
    }

    return data;
}

// #################################
//
// BUILDER
//
// #################################

function buildInnerLine(innerLine, innerLineColor) {
    var points = [];
    var numbers = [];
    var pointColor = 0;

    for (var point in innerLine) {
        numbers.push(innerLine[point].mil);
        points.push(
            pointTemplate(innerLine[point].distance, "color-" + innerLineColor + "-" + pointColor++)
        );
    }

    return innerLineTemplate(
        numbers[0],
        numbers.length > 1 ? numbers.slice(1, numbers.length).join(", ") : numbers[0], 
        points, "color-" + innerLineColor);
}

function buildLine(line) {
    var points = [];
    var number = 0;

    for (var constant in line.constants) {
        points.push(
            buildInnerLine(line.constants[constant], number++)
        );
    }

    return lineTemplate(line.start, line.end, points);
}

function buildSubSection(subSection) {
    var lines = [];

    subSection.forEach((line) => 
        lines.push(
            buildLine(line)
        )
    );

    return subSectionTemplate(lines);
}

function buildSection(section) {
    var subSections = [];

    section.data.forEach(
        (subSection) => subSections.push(
            buildSubSection(subSection)
        )
    );

    return sectionTemplate(section.title, subSections);
}

function buildPage() {
    var data = generateData();
    var sections = [];
    var body = document.getElementById("body");

    for (var section in data) {
        sections.push(
            buildSection(
                {
                    title: section,
                    data: data[section]
                }
            )
        );
    }

    body.innerHTML = pageTemplate(sections);
}

function onLoaded() {
    buildPage();
}

document.addEventListener("DOMContentLoaded", onLoaded);

// #################################
//
// SETTINGS
//
// #################################

var settings = {
    /**
     * Which values to use to calculate the MILs for each distance.
     * 
     * Possible Values: [US_GER_CalculatorConstants, RUS_CalculatorConstants]
     */
    calculatorConstants: [US_GER_CalculatorConstants, RUS_CalculatorConstants],

    startDistance: 100,
    endDistance: 1600,

    sectionSize: 100,

    subSections: 4,

    lineSize: 5,
    lineShift: -1,

    // not tested
    pointSize: 1
};
