import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


// --------------- TOP 10 ---------------------
let top10 = await fetch("jockey_top_10.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

top10 = top10.reverse();
let top10Range = [0.08, 0.09];
const top10Div = d3.select("#best_jockeys");
top10Div.selectAll("svg").remove();

const top10Container = d3.select("#best_jockeys")
    .append("svg")
        .attr("width", 800)
        .attr("height", 800)
    .append("g")
        .attr("transform", "translate(100, 100)")

const top10xAxis = d3.scaleBand()
    .domain(top10.map((e) => e.JOCKEY))
    .range([0, 500])

top10Container.append("g")
    .attr("transform", "translate(0, 500)")
    .call(d3.axisBottom(top10xAxis))
    .selectAll("text")
        .attr("transform", "translate(-5, 0) rotate(-30)")
        .style("text-anchor", "end");

const top10yAxis = d3.scaleLinear()
    .domain(top10Range)
    .range([500, 0]);

top10Container.append("g")
    .call(d3.axisLeft(top10yAxis))

top10Container.selectAll("rect")
    .data(top10)
    .enter()
    .append("rect")
        .attr("x", (e) => top10xAxis(e.JOCKEY))
        .attr("y", (e) => top10yAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("width", top10xAxis.bandwidth())
        .attr("height", (e) => 500 - top10yAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("fill", "green")
        .attr("stroke", "black");

top10Container.append("text")
    .attr("x", 225)
    .attr("y", 575)
    .text("Jockey Name");

top10Container.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
    .attr("y", -50)
    .text("Average Speed of Horses (furlongs/second)");

top10Container.append("text")
    .attr("x", 175)
    .attr("y", -20)
    .text("Top 10 Jockeys by Average Speed of Ridden Horses");


// ---------------- BOTTOM 10 ------------
let bottom10 = await fetch("jockey_bottom_10.csv")
    .then(response => response.text())
    .then(dataString => d3.csvParse(dataString));

//bottom10 = bottom10.reverse();
let bottom10Range = [0.075, 0.085];
const bottom10Div = d3.select("#worst_jockeys");
bottom10Div.selectAll("svg").remove();

const bottom10Container = d3.select("#worst_jockeys")
    .append("svg")
        .attr("width", 800)
        .attr("height", 800)
    .append("g")
        .attr("transform", "translate(100, 100)")

const bottom10xAxis = d3.scaleBand()
    .domain(bottom10.map((e) => e.JOCKEY))
    .range([0, 500])

bottom10Container.append("g")
    .attr("transform", "translate(0, 500)")
    .call(d3.axisBottom(bottom10xAxis))
    .selectAll("text")
        .attr("transform", "translate(-5, 0) rotate(-30)")
        .style("text-anchor", "end");

const bottom10yAxis = d3.scaleLinear()
    .domain(bottom10Range)
    .range([500, 0]);

bottom10Container.append("g")
    .call(d3.axisLeft(bottom10yAxis))

bottom10Container.selectAll("rect")
    .data(bottom10)
    .enter()
    .append("rect")
        .attr("x", (e) => bottom10xAxis(e.JOCKEY))
        .attr("y", (e) => bottom10yAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("width", bottom10xAxis.bandwidth())
        .attr("height", (e) => 500 - bottom10yAxis(e.AVERAGE_SPEED_furlongs_a_second))
        .attr("fill", "orange")
        .attr("stroke", "black");

bottom10Container.append("text")
    .attr("x", 225)
    .attr("y", 575)
    .text("Jockey Name");

bottom10Container.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -400)
    .attr("y", -50)
    .text("Average Speed of Horses (furlongs/second)");

bottom10Container.append("text")
    .attr("x", 175)
    .attr("y", -20)
    .text("Bottom 10 Jockeys by Average Speed of Ridden Horses");