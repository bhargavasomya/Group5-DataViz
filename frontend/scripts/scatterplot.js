
function setupScatterPlot(data) {
    var width = 540;
    var height = 570;
    var margin = {
        top: 50,
        left: 50,
        right: 25,
        bottom: 50
    };

    //anything inside bracket will be selected
    var svg = d3.select(".scatterplot-cosine")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var xScale = d3.scaleLinear()
        .domain([-5,10])
        .range([margin.left, width-margin.right]);

    var yScale = d3.scaleLinear()
        .domain([-5,5])
        .range([height-margin.bottom, margin.top]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var xAxis = svg.append("g")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).ticks(10));

    var yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    var circle = svg.selectAll("circle")//empty selection
        .data(data)
        .enter() //empty placeholder
        .append("circle")
        .attr("cx", function(d){return xScale(d.p1);})
        .attr("cy", function(d){return yScale(d.p2);})
        .attr("r", 3)
        .attr("fill", "blue");
}

var storedData;
var firstHistogramDisplayed = new Set();
var secondHistogramDisplayed = new Set();

dispatch.on("dataLoaded.scatterplot", function(data) {
    storedData = data;
    setupScatterPlot(data);
});

dispatch.on("disablePoints.scatterplot", function (data, histogramNumber) {
    if (histogramNumber === ".histogram-q1") {
        firstHistogramDisplayed.add(data);
    } else if (histogramNumber === ".histogram-q2") {
        secondHistogramDisplayed.add(data);
    }
    console.log(firstHistogramDisplayed);
    console.log(secondHistogramDisplayed);
});

dispatch.on("enablePoints.scatterplot", function (data, histogramNumber) {
    if (histogramNumber === ".histogram-q1") {
        firstHistogramDisplayed.delete(data);
    } else if (histogramNumber === ".histogram-q2") {
        secondHistogramDisplayed.delete(data);
    }
    console.log(firstHistogramDisplayed);
    console.log(secondHistogramDisplayed);
});
