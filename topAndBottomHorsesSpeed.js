import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let top200HorsesSpeed = await fetch("2019_Saratoga_Juveniles_ALL_STARTERS_TOP_200_SPEED.csv")
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
        .attr("height", 800)
    .append("g")
        .attr("transform", "translate(100, 100)");

const xAxisTop200 = d3.scaleBand()
    .domain(top200HorsesSpeed.map(function(singleDataObject) {
        return singleDataObject.STARTER_NAME;
    }))
    .range([0, 1400]);

const yAxisTop200 = d3.scaleLinear()
    .domain(rangeTop200)
    .range([500, 0]);
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
            return 500 - yAxisTop200(singleDataObject.AVERAGE_SPEED_furlongs_a_second);
        })
        .attr("fill", "green")
        .attr("stroke", "black");

// Referred to https://d3-graph-gallery.com/graph/custom_axis.html#axistitles for creating both the x-axis and y-axis labels (technically also the title of the chart)
barContainerTop200.append("text")
    .attr("x", 700)
    .attr("y", 520)
    .text("Horse");
barContainerTop200.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
    .attr("y", -50)
    .text("Average Speed (furlongs/second)");
barContainerTop200.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .text("Top 200 Horses by Average Speed");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality
const pointInfoPaneTop200  = d3.select("#fastest_horses")
    .append("div")
        .style("visibility", "hidden");

barContainerTop200.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        pointInfoPaneTop200
            .style("visibility", "visible")
            .text("Horse Name: " + singleDataObject.STARTER_NAME +
            ", Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Trainer(s): " + singleDataObject.TRAINERS + 
            ", Sire(s): " + singleDataObject.SIRES + 
            ", Jockey(s): " + singleDataObject.JOCKEYS);
        console.log("Hovering");
    })
    .on("mouseout", function() {
        pointInfoPaneTop200
            .style("visibility", "hidden");
        console.log("Not hovering");
    });