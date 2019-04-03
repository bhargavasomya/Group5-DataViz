var scatterPlotWidth = 540;
var scatterPlotHeight = 540;
var scatterPlotMargin = {
    top: 50,
    left: 25,
    right: 25,
    bottom: 50
};

//anything inside bracket will be selected
var scatterPlotSvg = d3.select(".scatterplot-cosine")
    .append("svg")
    .attr("width", scatterPlotWidth)
    .attr("height", scatterPlotHeight);

var scatterPlotXScale = d3.scaleLinear()
    .domain([-20,20])
    .range([scatterPlotMargin.left, scatterPlotWidth-scatterPlotMargin.right]);

var scatterPlotScale = d3.scaleLinear()
    .domain([-20,20])
    .range([scatterPlotHeight-scatterPlotMargin.bottom, scatterPlotMargin.top]);

function setupScatterPlot(data) {
    scatterPlotSvg.append("g")
        .attr("transform", `translate(0,${scatterPlotHeight-scatterPlotMargin.bottom})`)
        .call(d3.axisBottom().scale(scatterPlotXScale).ticks(10));

    scatterPlotSvg.append("g")
        .attr("transform", `translate(${scatterPlotMargin.left},0)`)
        .call(d3.axisLeft().scale(scatterPlotScale));

    var selectedText = d3.select(".selected-text").style("opacity", 0);

    scatterPlotSvg.selectAll("circle")//empty selection
        .data(data)
        .enter() //empty placeholder
        .append("circle")
        .attr("cx", function(d){return scatterPlotXScale(d.x);})
        .attr("cy", function(d){return scatterPlotScale(d.y);})
        .attr("r", 3)
        .style("opacity", 0.7)
        .attr("fill", "#9B59B6")
        .on('mouseover', function (d, i) {
            d3.select(this).attr("fill", 'orange');
            selectedText.transition()
                .duration(50)
                .style('opacity', 1)

            let q = d.question;
            selectedText.html(q);
        })
        .on('mouseout', function (d, i) {
            d3.select(this).attr("fill", '#9B59B6');
            selectedText.transition()
                .duration(50)
                .style('opacity', 0);
        });
}

var storedData;
var firstHistogramDisplayed = new Set();
var secondHistogramDisplayed = new Set();

dispatch.on("dataLoaded.scatterplot", function(data) {
    storedData = data;
    setupScatterPlot(data);
});

function setOpacityAndColorForGroup(value, opacityValue, colorValue) {
    value.forEach(function(v) {
        scatterPlotSvg.selectAll("circle").filter(function (d) {
            return d === v;
        }).attr("fill-opacity", opacityValue).attr("fill", colorValue)

    });
}

dispatch.on("disablePoints.scatterplot", function (data, histogramNumber) {
    if (histogramNumber === ".histogram-q1") {
        firstHistogramDisplayed.add(data);
    } else if (histogramNumber === ".histogram-q2") {
        secondHistogramDisplayed.add(data);
    }

    scatterPlotSvg.selectAll("circle").attr("fill-opacity", 0.0);
    firstHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#B92B27")});
    secondHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#2b6dad")});
});


dispatch.on("enablePoints.scatterplot", function (data, histogramNumber) {
    if (histogramNumber === ".histogram-q1") {
        firstHistogramDisplayed.delete(data);
    } else if (histogramNumber === ".histogram-q2") {
        secondHistogramDisplayed.delete(data);
    }

    if (firstHistogramDisplayed.size == 0 && secondHistogramDisplayed.size == 0) {
        scatterPlotSvg.selectAll("circle").attr("fill-opacity", .7);
    } else {
        scatterPlotSvg.selectAll("circle").attr("fill-opacity", 0.0);
        firstHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#B92B27")});
        secondHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#2b6dad")});
    }
});
