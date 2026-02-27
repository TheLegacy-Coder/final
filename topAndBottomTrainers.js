import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


let alltrainer = await fetch("trainer_sorted.csv")
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
        .attr("height", 800)
    .append("g")
        .attr("transform", "translate(100, 100)")

const alltrainerxAxis = d3.scaleBand()
    .domain(alltrainer.map((e) => e.TRAINER))
    .range([0, 1400])

const alltraineryAxis = d3.scaleLinear()
    .domain(alltrainerRange)
    .range([500, 0]);

alltrainerContainer.append("g")
    .call(d3.axisLeft(alltraineryAxis))

alltrainerContainer.selectAll("rect")
    .data(alltrainer)
    .enter()
    .append("rect")
        .attr("x", (e) => alltrainerxAxis(e.TRAINER))
        .attr("y", (e) => alltraineryAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("width", alltrainerxAxis.bandwidth())
        .attr("height", (e) => 500 - alltraineryAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("fill", "green")
        .attr("stroke", "black");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
alltrainerContainer.append("text")
    .attr("x", 700)
    .attr("y", 520)
    .text("Trainer");

alltrainerContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
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
alltrainerContainer.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        pointInfoPaneAllTrainer
            .style("visibility", "visible")
            .text("Trainer: " + singleDataObject.TRAINER +
            ", Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Trained Horses: " + singleDataObject.HORSES);
    })
    .on("mouseout", function() {
        pointInfoPaneAllTrainer
            .style("visibility", "hidden");
    });