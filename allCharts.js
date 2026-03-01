import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// ---------------- JOCKEYS ------------------
let alljockey = await fetch("data/jockey_sorted.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

alljockey = alljockey.reverse();
let alljockeyRange = [0.078, 0.09];
const alljockeyDiv = d3.select("#best_jockeys");
alljockeyDiv.selectAll("svg").remove();

// Main reference for creating the bar chart: https://d3-graph-gallery.com/graph/barplot_basic.html
const alljockeyContainer = d3.select("#best_jockeys")
    .append("svg")
        .attr("width", 1500)
        .attr("height", 275)
    .append("g")
        .attr("transform", "translate(100, 100)")

const alljockeyxAxis = d3.scaleBand()
    .domain(alljockey.map((e) => e.JOCKEY))
    .range([0, 1400])

alljockeyContainer.append("g")
    .attr("transform", "translate(0, 500)")
    .call(d3.axisBottom(alljockeyxAxis))
    .selectAll("text")
        .attr("transform", "translate(-5, 0) rotate(-30)")
        .style("text-anchor", "end");

const alljockeyyAxis = d3.scaleLinear()
    .domain(alljockeyRange)
    .range([150, 0]);

alljockeyContainer.append("g")
    .call(d3.axisLeft(alljockeyyAxis))

alljockeyContainer.selectAll("rect")
    .data(alljockey)
    .enter()
    .append("rect")
        .attr("x", (e) => alljockeyxAxis(e.JOCKEY))
        .attr("y", (e) => alljockeyyAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("width", alljockeyxAxis.bandwidth())
        .attr("height", (e) => 150 - alljockeyyAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("fill", "#6cd46c")
        .attr("stroke", "#227422");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
alljockeyContainer.append("text")
    .attr("x", 700)
    .attr("y", 175)
    .text("Jockey");

alljockeyContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "12px")
    .attr("x", -150)
    .attr("y", -50)
    .text("Average Speed of Horses (furlongs/second)");

alljockeyContainer.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .text("Jockeys' Average Speed of Ridden Horses");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
// Referred to https://stackoverflow.com/questions/25123003/how-to-assign-click-event-to-every-svg-element-in-d3js for changing bar color on mouse click and changing the stroke color on hover
const pointInfoPaneAllJockey  = d3.select("#best_jockeys")
    .append("div")
        .style("visibility", "hidden");

alljockeyContainer.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        d3.select(this).attr("stroke", "blue")
        pointInfoPaneAllJockey
            .style("visibility", "visible")
            .text( "Jockey: " + singleDataObject.JOCKEY +
            ", Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Ridden Horses: " + singleDataObject.HORSES);
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke", "#227422")
        pointInfoPaneAllJockey
            .style("visibility", "hidden");
    })
    .on("click", (event, dataPoint) => {
        alljockeyContainer.selectAll("rect")
            .attr("fill", (d) => d.JOCKEY === dataPoint.JOCKEY ? "red": "#6cd46c")
        barContainerTop200.selectAll("rect")
            .attr("fill", (d) => {
                // Referenced https://stackoverflow.com/questions/41402834/convert-string-array-to-array-in-javascript for parsing jockeys string into list
                let jockeyList = d.JOCKEYS.replace(/'/g, '"')
                
                jockeyList = JSON.parse(jockeyList)
                for (let jockey of jockeyList){
                    if (jockey === dataPoint.JOCKEY) return "red";
                }
                return "#6cd46c";
            })
        alltrainerContainer.selectAll("rect")
            .attr("fill", "#6cd46c")
        sireBarContainer.selectAll("rect")
            .attr("fill", "#6cd46c")
    })


// ------------- SIRES ----------------
let HorsesSpeedForSire = await fetch("data/2019_Saratoga_Juveniles_ALL_STARTERS_SPEED_FOR_SIRE.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

HorsesSpeedForSire = HorsesSpeedForSire.reverse();

// console.log(HorsesSpeedForSire)

let sireRange = [0.073, 0.09];

// Rendering the bar chart for the sires based on average speed of their offspring
const sireSingleSVG = d3.select("#fastest_horses_for_sire");
sireSingleSVG.selectAll("svg").remove();

// Main reference for creating the bar chart: https://d3-graph-gallery.com/graph/barplot_basic.html
const sireBarContainer = d3.select("#fastest_horses_for_sire")
    .append("svg")
        .attr("width", 1500)
        .attr("height", 275)
    .append("g")
        .attr("transform", "translate(100, 100)");

const sirexAxis = d3.scaleBand()
    .domain(HorsesSpeedForSire.map(function(singleDataObject) {
        return singleDataObject.SIRE;
    }))
    .range([0, 1400]);

const sireyAxis = d3.scaleLinear()
    .domain(sireRange)
    .range([150, 0]);
sireBarContainer.append("g")
    .call(d3.axisLeft(sireyAxis));

sireBarContainer.selectAll("rect")
    .data(HorsesSpeedForSire)
    .enter()
    .append("rect")
        .attr("x", function(singleDataObject) {
            return sirexAxis(singleDataObject.SIRE);
        })
        .attr("y", function(singleDataObject) {
            return sireyAxis(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("width", sirexAxis.bandwidth())
        .attr("height", function(singleDataObject) {
            return 150 - sireyAxis(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("fill", "#6cd46c")
        .attr("stroke", "#227422");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
sireBarContainer.append("text")
    .attr("x", 700)
    .attr("y", 175)
    .text("Sire");
sireBarContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "12px")
    .attr("x", -150)
    .attr("y", -50)
    .text("Average Speed of Offspring (furlongs/second)");
sireBarContainer.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .text("Sires' Average Speed of Offspring");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
// Referred to https://stackoverflow.com/questions/25123003/how-to-assign-click-event-to-every-svg-element-in-d3js for changing bar color on mouse click and changing the stroke color on hover
const sirePointInfoPane  = d3.select("#fastest_horses_for_sire")
    .append("div")
        .style("visibility", "hidden");

sireBarContainer.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        d3.select(this).attr("stroke", "blue")
        sirePointInfoPane
            .style("visibility", "visible")
            .text("Sire: " + singleDataObject.SIRE + 
            ", Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Offspring: " + singleDataObject.OFFSPRING);
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke", "#227422")
        sirePointInfoPane
            .style("visibility", "hidden");
    })
    .on("click", (event, dataPoint) => {
        sireBarContainer.selectAll("rect")
            .attr("fill", (d) => d.SIRE === dataPoint.SIRE ? "red": "#6cd46c")
        barContainerTop200.selectAll("rect")
            .attr("fill", (d) => d.SIRES === dataPoint.SIRE ? "red" : "#6cd46c")
        alltrainerContainer.selectAll("rect")
            .attr("fill", "#6cd46c")
        alljockeyContainer.selectAll("rect")
            .attr("fill", "#6cd46c")
    })


// ------------ TRAINERS ----------
let alltrainer = await fetch("data/trainer_sorted.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

alltrainer = alltrainer.reverse();
let alltrainerRange = [0.076, 0.088];
const alltrainerDiv = d3.select("#best_trainers");
alltrainerDiv.selectAll("svg").remove();

// Main reference for creating the bar chart: https://d3-graph-gallery.com/graph/barplot_basic.html
const alltrainerContainer = d3.select("#best_trainers")
    .append("svg")
        .attr("width", 1500)
        .attr("height", 275)
    .append("g")
        .attr("transform", "translate(100, 100)")

const alltrainerxAxis = d3.scaleBand()
    .domain(alltrainer.map((e) => e.TRAINER))
    .range([0, 1400])

const alltraineryAxis = d3.scaleLinear()
    .domain(alltrainerRange)
    .range([150, 0]);

alltrainerContainer.append("g")
    .call(d3.axisLeft(alltraineryAxis))

alltrainerContainer.selectAll("rect")
    .data(alltrainer)
    .enter()
    .append("rect")
        .attr("x", (e) => alltrainerxAxis(e.TRAINER))
        .attr("y", (e) => alltraineryAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("width", alltrainerxAxis.bandwidth())
        .attr("height", (e) => 150 - alltraineryAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("fill", "#6cd46c")
        .attr("stroke", "#227422");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
alltrainerContainer.append("text")
    .attr("x", 700)
    .attr("y", 175)
    .text("Trainer");

alltrainerContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "12px")
    .attr("x", -150)
    .attr("y", -50)
    .text("Average Speed of Horses (furlongs/second)");

alltrainerContainer.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .text("Trainers' Average Speed of Trained Horses");


const pointInfoPaneAllTrainer  = d3.select("#best_trainers")
    .append("div")
        .style("visibility", "hidden");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
// Referred to https://stackoverflow.com/questions/25123003/how-to-assign-click-event-to-every-svg-element-in-d3js for changing bar color on mouse click and changing the stroke color on hover
alltrainerContainer.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        d3.select(this).attr("stroke", "blue")
        pointInfoPaneAllTrainer
            .style("visibility", "visible")
            .text("Trainer: " + singleDataObject.TRAINER +
            ", Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Trained Horses: " + singleDataObject.HORSES);
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke", "#227422")
        pointInfoPaneAllTrainer
            .style("visibility", "hidden");
    })
    .on("click", (event, dataPoint) => {
        alltrainerContainer.selectAll("rect")
            .attr("fill", (d) => d.TRAINER === dataPoint.TRAINER ? "red": "#6cd46c")
        barContainerTop200.selectAll("rect")
            .attr("fill", (d) => d.TRAINERS === dataPoint.TRAINER ? "red" : "#6cd46c")
        sireBarContainer.selectAll("rect")
            .attr("fill", "#6cd46c")
        alljockeyContainer.selectAll("rect")
            .attr("fill", "#6cd46c")
    })

// ----------------- HORSES ------------------

let top200HorsesSpeed = await fetch("data/2019_Saratoga_Juveniles_ALL_STARTERS_TOP_200_SPEED.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

top200HorsesSpeed = top200HorsesSpeed.reverse();

// console.log(top200HorsesSpeed)

let rangeTop200 = [0.083, 0.0905];

// Rendering the bar chart for the top 200 horses by average speed
const singleSVGTop200 = d3.select("#fastest_horses");
singleSVGTop200.selectAll("svg").remove();

// Main reference for creating the bar chart: https://d3-graph-gallery.com/graph/barplot_basic.html
const barContainerTop200 = d3.select("#fastest_horses")
    .append("svg")
        .attr("width", 1500)
        .attr("height", 275)
    .append("g")
        .attr("transform", "translate(100, 100)");

const xAxisTop200 = d3.scaleBand()
    .domain(top200HorsesSpeed.map(function(singleDataObject) {
        return singleDataObject.STARTER_NAME;
    }))
    .range([0, 1400]);

const yAxisTop200 = d3.scaleLinear()
    .domain(rangeTop200)
    .range([150, 0]);
barContainerTop200.append("g")
    .call(d3.axisLeft(yAxisTop200));

barContainerTop200.selectAll("rect")
    .data(top200HorsesSpeed)
    .enter()
    .append("rect")
        .attr("x", function(singleDataObject) {
            return xAxisTop200(singleDataObject.STARTER_NAME);
        })
        .attr("y", function(singleDataObject) {
            return yAxisTop200(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("width", xAxisTop200.bandwidth())
        .attr("height", function(singleDataObject) {
            return 150 - yAxisTop200(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("fill", "#6cd46c")
        .attr("stroke", "#227422");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
barContainerTop200.append("text")
    .attr("x", 700)
    .attr("y", 175)
    .text("Horse");
barContainerTop200.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "12px")
    .attr("x", -150)
    .attr("y", -50)
    .text("Average Speed (furlongs/second)");
barContainerTop200.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .text("Top 200 Horses by Average Speed");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
// Referred to https://stackoverflow.com/questions/25123003/how-to-assign-click-event-to-every-svg-element-in-d3js for changing bar color on mouse click and changing the stroke color on hover
const pointInfoPaneTop200  = d3.select("#fastest_horses")
    .append("div")
        .style("visibility", "hidden");

barContainerTop200.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        d3.select(this).attr("stroke", "blue")
        pointInfoPaneTop200
            .style("visibility", "visible")
            .text("Horse Name: " + singleDataObject.STARTER_NAME +
            ", Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Trainer(s): " + singleDataObject.TRAINERS + 
            ", Sire(s): " + singleDataObject.SIRES + 
            ", Jockey(s): " + singleDataObject.JOCKEYS);
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke", "#227422")
        pointInfoPaneTop200
            .style("visibility", "hidden");
    })
    .on("click", (event, dataPoint) => {
        barContainerTop200.selectAll("rect")
            .attr("fill", (d) => d.STARTER_NAME === dataPoint.STARTER_NAME ? "red" : "#6cd46c")            
        alltrainerContainer.selectAll("rect")
            .attr("fill", (d) => d.TRAINER === dataPoint.TRAINERS ? "red" : "#6cd46c")
        sireBarContainer.selectAll("rect")
            .attr("fill", (d) => d.SIRE === dataPoint.SIRES ? "red" : "#6cd46c")
        alljockeyContainer.selectAll("rect")
            .attr("fill", (d) => {
                // Referenced https://stackoverflow.com/questions/41402834/convert-string-array-to-array-in-javascript for parsing jockeys string into list
                let jockeyList = dataPoint.JOCKEYS.replace(/'/g, '"')
                
                jockeyList = JSON.parse(jockeyList)
                for (let jockey of jockeyList){
                    if (jockey === d.JOCKEY) return "red";
                }
                return "#6cd46c";
            })
    })


// ------------ CLEAR BUTTON ---------

document.getElementById("clear").onclick = () => {
    barContainerTop200.selectAll("rect")
        .attr("fill", "#6cd46c")            
    alltrainerContainer.selectAll("rect")
        .attr("fill", "#6cd46c")            
    sireBarContainer.selectAll("rect")
        .attr("fill", "#6cd46c")            
    alljockeyContainer.selectAll("rect")
        .attr("fill", "#6cd46c")            
}