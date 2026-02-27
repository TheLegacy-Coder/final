import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


let alljockey = await fetch("jockey_sorted.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

alljockey = alljockey.reverse();
let alljockeyRange = [0.078, 0.09];
const alljockeyDiv = d3.select("#best_jockeys");
alljockeyDiv.selectAll("svg").remove();

const alljockeyContainer = d3.select("#best_jockeys")
    .append("svg")
        .attr("width", 1500)
        .attr("height", 800)
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
    .range([500, 0]);

alljockeyContainer.append("g")
    .call(d3.axisLeft(alljockeyyAxis))

alljockeyContainer.selectAll("rect")
    .data(alljockey)
    .enter()
    .append("rect")
        .attr("x", (e) => alljockeyxAxis(e.JOCKEY))
        .attr("y", (e) => alljockeyyAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("width", alljockeyxAxis.bandwidth())
        .attr("height", (e) => 500 - alljockeyyAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("fill", "green")
        .attr("stroke", "black");

alljockeyContainer.append("text")
    .attr("x", 700)
    .attr("y", 575)
    .text("Jockey");

alljockeyContainer.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
    .attr("y", -50)
    .text("Average Speed of Horses (furlongs/second)");

alljockeyContainer.append("text")
    .attr("x", 600)
    .attr("y", -20)
    .text("Jockeys' Average Speed of Ridden Horses");

// Referred to https://d3-graph-gallery.com/graph/interactivity_tooltip.html for adding an info pane for the bars, as well as the mouseover and mouseout functionality

const pointInfoPaneAllJockey  = d3.select("#best_jockeys")
    .append("div")
        .style("visibility", "hidden");

alljockeyContainer.selectAll("rect")
    .on("mouseover", function(singleMouseEvent, singleDataObject) {
        pointInfoPaneAllJockey
            .style("visibility", "visible")
            .text("Average Speed (furlongs/second): " + singleDataObject.AVERAGE_SPEED_furlongs_a_second +
            ", Ridden Horses: " + singleDataObject.HORSES);
    })
    .on("mouseout", function() {
        pointInfoPaneAllJockey
            .style("visibility", "hidden");
    });
