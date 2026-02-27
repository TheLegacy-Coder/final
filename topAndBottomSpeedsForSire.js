import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let HorsesSpeedForSire = await fetch("2019_Saratoga_Juveniles_ALL_STARTERS_SPEED_FOR_SIRE.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

HorsesSpeedForSire = HorsesSpeedForSire.reverse();

// console.log(HorsesSpeedForSire)

let range = [0.073, 0.09];

// Rendering the bar chart for the sires based on average speed of their offspring
const singleSVG = d3.select("#fastest_horses_for_sire");
singleSVG.selectAll("svg").remove();

// Main reference for creating the bar chart: https://d3-graph-gallery.com/graph/barplot_basic.html
const barContainer = d3.select("#fastest_horses_for_sire")
    .append("svg")
        .attr("width", 1500)
        .attr("height", 800)
    .append("g")
        .attr("transform", "translate(100, 100)");

const xAxis = d3.scaleBand()
    .domain(HorsesSpeedForSire.map(function(singleDataObject) {
        return singleDataObject.SIRE;
    }))
    .range([0, 1400]);

const yAxis = d3.scaleLinear()
    .domain(range)
    .range([500, 0]);
barContainer.append("g")
    .call(d3.axisLeft(yAxis));

barContainer.selectAll("rect")
    .data(HorsesSpeedForSire)
    .enter()
    .append("rect")
        .attr("x", function(singleDataObject) {
            return xAxis(singleDataObject.SIRE);
        })
        .attr("y", function(singleDataObject) {
            return yAxis(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("width", xAxis.bandwidth())
        .attr("height", function(singleDataObject) {
            return 500 - yAxis(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("fill", "green")
        .attr("stroke", "black");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
barContainer.append("text")
    .attr("x", 700)
    .attr("y", 520)
    .text("Sire");
barContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
    .attr("y", -50)
    .text("Average Speed of Offspring (furlongs/second)");
barContainer.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .text("Sires' Average Speed of Offspring");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
const pointInfoPane  = d3.select("#fastest_horses_for_sire")
    .append("div")
        .style("visibility", "hidden");

barContainer.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        pointInfoPane
            .style("visibility", "visible")
            .text("Sire: " + singleDataObject.SIRE + 
            ", Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Offspring: " + singleDataObject.OFFSPRING);
        console.log("Hovering");
    })
    .on("mouseout", function() {
        pointInfoPane
            .style("visibility", "hidden");
        console.log("Not hovering");
    });