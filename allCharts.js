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
        .attr("width", 1300)
        .attr("height", 240)
    .append("g")
        .attr("transform", "translate(100, 50)")

const alljockeyxAxis = d3.scaleBand()
    .domain(alljockey.map((e) => e.JOCKEY))
    .range([0, 1200])

alljockeyContainer.append("g")
    .attr("transform", "translate(0, 500)")
    .call(d3.axisBottom(alljockeyxAxis))
    .selectAll("text")
        .attr("transform", "translate(-5, 0) rotate(-30)")
        .style("text-anchor", "end");

const alljockeyyAxis = d3.scaleLinear()
    .domain(alljockeyRange)
    .range([150, 0]);

// Referenced https://d3js.org/d3-axis#axis_ticks for custom amount of ticks
alljockeyContainer.append("g")
    .call(
        d3.axisLeft(alljockeyyAxis)
            .ticks(7)
    )

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
    .text("Jockey")
    .attr("font-weight", "bold");

alljockeyContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "12px")
    .attr("x", -175)
    .attr("y", -50)
    .attr("font-weight", "bold")
    .text("Avg. Speed of Horses (furlongs/sec)");

alljockeyContainer.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .attr("font-weight", "bold")
    .text("Jockeys' Average Speed of Ridden Horses");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
// Referred to https://stackoverflow.com/questions/25123003/how-to-assign-click-event-to-every-svg-element-in-d3js for changing bar color on mouse click and changing the stroke color on hover


alljockeyContainer.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        d3.select(this).attr("stroke", "blue")
        document.getElementById("hover_pane_text").innerHTML = "<b>Jockey: </b><p>" + singleDataObject.JOCKEY + "</p>" +
            "\n\n<b>Average Speed (furlongs/second): </b><p>" + singleDataObject.AVERAGE_SPEED_furlongs_a_second + "</p>" +
            "\n\n<b>Ridden Horses: </b><p>" + singleDataObject.HORSES + "</p>"
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke", "#227422")
        document.getElementById("hover_pane_text").innerText = ""
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
        .attr("width", 1300)
        .attr("height", 240)
    .append("g")
        .attr("transform", "translate(100, 50)");

const sirexAxis = d3.scaleBand()
    .domain(HorsesSpeedForSire.map(function(singleDataObject) {
        return singleDataObject.SIRE;
    }))
    .range([0, 1200]);

const sireyAxis = d3.scaleLinear()
    .domain(sireRange)
    .range([150, 0]);

// Referenced https://d3js.org/d3-axis#axis_ticks for custom amount of ticks
sireBarContainer.append("g")
    .call(
        d3.axisLeft(sireyAxis)
            .ticks(7)
    );

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
    .attr("font-weight", "bold")
    .text("Sire");
sireBarContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "12px")
    .attr("x", -185)
    .attr("y", -50)
    .attr("font-weight", "bold")
    .text("Avg. Speed of Offspring (furlongs/sec)");
sireBarContainer.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .attr("font-weight", "bold")
    .text("Sires' Average Speed of Offspring");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
// Referred to https://stackoverflow.com/questions/25123003/how-to-assign-click-event-to-every-svg-element-in-d3js for changing bar color on mouse click and changing the stroke color on hover

sireBarContainer.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        d3.select(this).attr("stroke", "blue")
        document.getElementById("hover_pane_text").innerHTML = "<b>Sire: </b><p>" + singleDataObject.SIRE + "</p>" +
            "\n\n<b>Average Speed (furlongs/second): </b><p>" + singleDataObject.AVERAGE_SPEED_furlongs_a_second + "</p>" +
            "\n\n<b>Offspring: </b><p>" + singleDataObject.OFFSPRING + "</p>"
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke", "#227422")
        document.getElementById("hover_pane_text").innerText = "";
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
        .attr("width", 1300)
        .attr("height", 240)
    .append("g")
        .attr("transform", "translate(100, 50)")

const alltrainerxAxis = d3.scaleBand()
    .domain(alltrainer.map((e) => e.TRAINER))
    .range([0, 1200])

const alltraineryAxis = d3.scaleLinear()
    .domain(alltrainerRange)
    .range([150, 0]);

// Referenced https://d3js.org/d3-axis#axis_ticks for custom amount of ticks
alltrainerContainer.append("g")
    .call(
        d3.axisLeft(alltraineryAxis)
            .ticks(7)
    )

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
    .attr("font-weight", "bold")
    .text("Trainer");

alltrainerContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "12px")
    .attr("x", -175)
    .attr("y", -50)
    .attr("font-weight", "bold")
    .text("Avg. Speed of Horses (furlongs/sec)");

alltrainerContainer.append("text")
    .attr("x", 600)
    .attr("y", 0)
    .attr("font-weight", "bold")
    .text("Trainers' Average Speed of Trained Horses");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
// Referred to https://stackoverflow.com/questions/25123003/how-to-assign-click-event-to-every-svg-element-in-d3js for changing bar color on mouse click and changing the stroke color on hover
alltrainerContainer.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        d3.select(this).attr("stroke", "blue")
        document.getElementById("hover_pane_text").innerHTML = "<b>Trainer: </b><p>" + singleDataObject.TRAINER + "</p>" +
            "\n\n<b>Average Speed (furlongs/second): </b><p>" + singleDataObject.AVERAGE_SPEED_furlongs_a_second + "</p>" +
            "\n\n<b>Trained Horses: </b><p>" + singleDataObject.HORSES + "</p>"
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke", "#227422")
        document.getElementById("hover_pane_text").innerText = "";
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
        .attr("width", 1300)
        .attr("height", 240)
    .append("g")
        .attr("transform", "translate(100, 50)");

const xAxisTop200 = d3.scaleBand()
    .domain(top200HorsesSpeed.map(function(singleDataObject) {
        return singleDataObject.STARTER_NAME;
    }))
    .range([0, 1200]);

const yAxisTop200 = d3.scaleLinear()
    .domain(rangeTop200)
    .range([150, 0]);

// Referenced https://d3js.org/d3-axis#axis_ticks for custom amount of ticks
barContainerTop200.append("g")
    .call(
        d3.axisLeft(yAxisTop200)
            .ticks(7)
    );

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
    .attr("font-weight", "bold")
    .text("Horse");
barContainerTop200.append("text")
    .attr("transform", "rotate(-90)")
    .attr("font-size", "12px")
    .attr("x", -160)
    .attr("y", -50)
    .attr("font-weight", "bold")
    .text("Avg. Speed (furlongs/sec)");
barContainerTop200.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .attr("font-weight", "bold")
    .text("Top 200 Horses by Average Speed");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
// Referred to https://stackoverflow.com/questions/25123003/how-to-assign-click-event-to-every-svg-element-in-d3js for changing bar color on mouse click and changing the stroke color on hover
barContainerTop200.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        d3.select(this).attr("stroke", "blue")
        document.getElementById("hover_pane_text").innerHTML = "<b>Horse Name: </b><p>" + singleDataObject.STARTER_NAME + "</p>" + 
            "\n\n<b>Average Speed (furlongs/second): </b><p>" + singleDataObject.AVERAGE_SPEED_furlongs_a_second + "</p>" +
            "\n\n<b>Trainer(s): </b><p>" + singleDataObject.TRAINERS + "</p>" +
            "\n\n<b>Sire(s): </b><p>" + singleDataObject.SIRES + "</p>" + 
            "\n\n<b>Jockey(s): </b><p>" + singleDataObject.JOCKEYS + "</p>"
    })
    .on("mouseout", function() {
        d3.select(this).attr("stroke", "#227422")
        document.getElementById("hover_pane_text").innerText = "";
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
        
        document.getElementById("info_pane_horse_name").textContent = dataPoint.STARTER_NAME;
        document.getElementById("info_pane_average_speed").textContent = dataPoint.AVERAGE_SPEED_furlongs_a_second;
        document.getElementById("info_pane_trainer").textContent = dataPoint.TRAINERS;
        document.getElementById("info_pane_sire").textContent = dataPoint.SIRES;
        document.getElementById("info_pane_jockey").textContent = dataPoint.JOCKEYS;
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
        .attr("fill", "#6cd46c");            
}