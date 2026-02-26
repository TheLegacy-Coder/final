import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let top10HorsesSpeed = await fetch("2019_Saratoga_Juveniles_ALL_STARTERS_TOP_10_SPEED.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

top10HorsesSpeed = top10HorsesSpeed.reverse();

// console.log(top10HorsesSpeed)

let bottom10HorsesSpeed = await fetch("2019_Saratoga_Juveniles_ALL_STARTERS_BOTTOM_10_SPEED.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

bottom10HorsesSpeed = bottom10HorsesSpeed.reverse();

// console.log(bottom10HorsesSpeed)

let rangeTop10 = [0.085, 0.095];
let rangeBottom10 = [0.07, 0.08];

// Rendering the bar chart for the top 10 horses by average speed
const singleSVGTop10 = d3.select("#fastest_horses");
singleSVGTop10.selectAll("svg").remove();

// Main reference for creating the bar chart: https://d3-graph-gallery.com/graph/barplot_basic.html
const barContainerTop10 = d3.select("#fastest_horses")
    .append("svg")
        .attr("width", 800)
        .attr("height", 800)
    .append("g")
        .attr("transform", "translate(100, 100)");

const xAxisTop10 = d3.scaleBand()
    .domain(top10HorsesSpeed.map(function(singleDataObject) {
        return singleDataObject.STARTER_NAME;
    }))
    .range([0, 500]);
barContainerTop10.append("g")
    .attr("transform", "translate(0, 500)")
    .call(d3.axisBottom(xAxisTop10))
    .selectAll("text")
        .attr("transform", "translate(-5, 0) rotate(-30)")
        .style("text-anchor", "end");

const yAxisTop10 = d3.scaleLinear()
    .domain(rangeTop10)
    .range([500, 0]);
barContainerTop10.append("g")
    .call(d3.axisLeft(yAxisTop10));

barContainerTop10.selectAll("rect")
    .data(top10HorsesSpeed)
    .enter()
    .append("rect")
        .attr("x", function(singleDataObject) {
            return xAxisTop10(singleDataObject.STARTER_NAME);
        })
        .attr("y", function(singleDataObject) {
            return yAxisTop10(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("width", xAxisTop10.bandwidth())
        .attr("height", function(singleDataObject) {
            return 500 - yAxisTop10(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("fill", "green")
        .attr("stroke", "black");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
barContainerTop10.append("text")
    .attr("x", 225)
    .attr("y", 575)
    .text("Starter Name");
barContainerTop10.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
    .attr("y", -50)
    .text("Average Speed (furlongs/second)");
barContainerTop10.append("text")
    .attr("x", 175)
    .attr("y", -20)
    .text("Top 10 Horses by Average Speed");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
const pointInfoPaneTop10  = d3.select("#fastest_horses")
    .append("div")
        .style("visibility", "hidden");

barContainerTop10.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        pointInfoPaneTop10
            .style("visibility", "visible")
            .text("Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Trainer(s): " + singleDataObject.TRAINERS + 
            ", Sire(s): " + singleDataObject.SIRES + 
            ", Jockey(s): " + singleDataObject.JOCKEYS);
        console.log("Hovering");
    })
    .on("mouseout", function() {
        pointInfoPaneTop10
            .style("visibility", "hidden");
        console.log("Not hovering");
    });


// Rendering the bar chart for the bottom 10 horses by average speed
const singleSVGBottom10 = d3.select("#slowest_horses");
singleSVGBottom10.selectAll("svg").remove();

// Main reference for creating the bar chart: https://d3-graph-gallery.com/graph/barplot_basic.html
const barContainerBottom10 = d3.select("#slowest_horses")
    .append("svg")
        .attr("width", 800)
        .attr("height", 800)
    .append("g")
        .attr("transform", "translate(100, 100)");

const xAxisBottom10 = d3.scaleBand()
    .domain(bottom10HorsesSpeed.map(function(singleDataObject) {
        return singleDataObject.STARTER_NAME;
    }))
    .range([0, 500]);
barContainerBottom10.append("g")
    .attr("transform", "translate(0, 500)")
    .call(d3.axisBottom(xAxisBottom10))
    .selectAll("text")
        .attr("transform", "translate(-5, 0) rotate(-30)")
        .style("text-anchor", "end");

const yAxisBottom10 = d3.scaleLinear()
    .domain(rangeBottom10)
    .range([500, 0]);
barContainerBottom10.append("g")
    .call(d3.axisLeft(yAxisBottom10));

barContainerBottom10.selectAll("rect")
    .data(bottom10HorsesSpeed)
    .enter()
    .append("rect")
        .attr("x", function(singleDataObject) {
            return xAxisBottom10(singleDataObject.STARTER_NAME);
        })
        .attr("y", function(singleDataObject) {
            return yAxisBottom10(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("width", xAxisBottom10.bandwidth())
        .attr("height", function(singleDataObject) {
            return 500 - yAxisBottom10(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("fill", "orange")
        .attr("stroke", "black");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
barContainerBottom10.append("text")
    .attr("x", 225)
    .attr("y", 575)
    .text("Starter Name");
barContainerBottom10.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
    .attr("y", -50)
    .text("Average Speed (furlongs/second)");
barContainerBottom10.append("text")
    .attr("x", 175)
    .attr("y", -20)
    .text("Bottom 10 Horses by Average Speed");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
const pointInfoPaneBottom10  = d3.select("#slowest_horses")
    .append("div")
        .style("visibility", "hidden");

barContainerBottom10.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        pointInfoPaneBottom10
            .style("visibility", "visible")
            .text("Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Trainer(s): " + singleDataObject.TRAINERS + 
            ", Sire(s): " + singleDataObject.SIRES + 
            ", Jockey(s): " + singleDataObject.JOCKEYS);
        console.log("Hovering");
    })
    .on("mouseout", function() {
        pointInfoPaneBottom10
            .style("visibility", "hidden");
        console.log("Not hovering");
    });