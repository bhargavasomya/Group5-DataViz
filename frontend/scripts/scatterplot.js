var scatterPlotWidth = 540;
var scatterPlotHeight = 540;
var scatterPlotMargin = {
    top: 50,
    left: 25,
    right: 25,
    bottom: 50
};

var symbol = d3.symbol();

var firstScatterPlotSvg = d3.select(".first-scatterplot-cosine")
    .append("svg")
    .attr("width", scatterPlotWidth)
    .attr("height", scatterPlotHeight);

var secondScatterPlotSvg = d3.select(".second-scatterplot-cosine")
    .append("svg")
    .attr("width", scatterPlotWidth)
    .attr("height", scatterPlotHeight);

var scatterPlotXScale = d3.scaleLinear()
    .domain([-20,20])
    .range([scatterPlotMargin.left, scatterPlotWidth-scatterPlotMargin.right]);

var scatterPlotScale = d3.scaleLinear()
    .domain([-20,20])
    .range([scatterPlotHeight-scatterPlotMargin.bottom, scatterPlotMargin.top]);

function setupScatterPlot(data, scatterPlotSvg, scatterPlotNumber) {
    scatterPlotSvg.append("g")
        .attr("transform", `translate(0,${scatterPlotHeight-scatterPlotMargin.bottom})`)
        .call(d3.axisBottom().scale(scatterPlotXScale).ticks(10));

    scatterPlotSvg.append("g")
        .attr("transform", `translate(${scatterPlotMargin.left},0)`)
        .call(d3.axisLeft().scale(scatterPlotScale));

    var selectedTextClass = "";
    
    if(scatterPlotNumber == 1) {
      selectedTextClass = ".selected-text1";
    } else {
      selectedTextClass = ".selected-text2";
    }
    var selectedText = d3.select(selectedTextClass).style("opacity", 0);
    var currentColor = "";

    scatterPlotSvg.selectAll("circle")//empty selection
        .data(data)
        .enter() //empty placeholder
        .append("circle")
        .attr("cx", function(d) { return scatterPlotXScale(d.x); })
        .attr("cy", function(d) { return scatterPlotScale(d.y); })
        .attr("r", 3)
        .style("opacity", 0.7)
        .attr("fill", "#9B59B6")
        .on('mouseover', function (d, i) {
            currentColor = d3.select(this).attr("fill");
            d3.select(this).attr("fill", 'orange');
            d3.select(this).transition().attr("r", 8);
            selectedText.transition()
                .duration(50)
                .style('opacity', 1)

            let q = d.question;
            selectedText.html(q);
        })
        .on('mouseout', function (d, i) {
            d3.select(this).attr("fill", currentColor);
            d3.select(this).transition().attr("r", 3);
            selectedText.transition()
                .duration(50)
                .style('opacity', 0);
        });
}

var storedData;
var firstHistogramDisplayed = new Set();
var secondHistogramDisplayed = new Set();

var thirdHistogramDisplayed = new Set();
var forthHistogramDisplayed = new Set();

dispatch.on("dataLoaded.scatterplot", function(data) {
    storedData = data;
    setupScatterPlot(data, firstScatterPlotSvg, 1);
    setupScatterPlot(data, secondScatterPlotSvg, 2);
});

function setOpacityAndColorForGroup(value, opacityValue, colorValue, scatterPlotSvg) {
    value.forEach(function(v) {
        scatterPlotSvg.selectAll("circle").filter(function (d) {
            return d === v;
        }).attr("fill-opacity", opacityValue).attr("fill", colorValue)

    });
}

dispatch.on("disablePoints.scatterplot", function (data, histogramNumber) {
    switch (histogramNumber) {
        case ".histogram-q1":
            firstHistogramDisplayed.add(data);
            firstScatterPlotSvg.selectAll("circle").attr("fill-opacity", 0.0);
            break;
        case ".histogram-q2":
            secondHistogramDisplayed.add(data);
            firstScatterPlotSvg.selectAll("circle").attr("fill-opacity", 0.0);
            break;
        case ".histogram-q3":
            thirdHistogramDisplayed.add(data);
            secondScatterPlotSvg.selectAll("circle").attr("fill-opacity", 0.0);
            break;
        case ".histogram-q4":
            forthHistogramDisplayed.add(data);
            secondScatterPlotSvg.selectAll("circle").attr("fill-opacity", 0.0);
            break;
    }

    // First scatterplot
    firstHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#B92B27", firstScatterPlotSvg)});
    secondHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#2b6dad", firstScatterPlotSvg)});
    
    // Second scatterplot
    thirdHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#B92B27", secondScatterPlotSvg)});
    forthHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#2b6dad", secondScatterPlotSvg)});
});

function updateFirstScatterplot() {
    if (firstHistogramDisplayed.size == 0 && secondHistogramDisplayed.size == 0) {
        firstScatterPlotSvg.selectAll("circle").attr("fill-opacity", .7)
            .attr("fill", "#9B59B6");
    } else {
        firstScatterPlotSvg.selectAll("circle").attr("fill-opacity", 0.0);
        firstHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#B92B27", firstScatterPlotSvg)});
        secondHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#2b6dad", firstScatterPlotSvg)});
    }
}

function updateSecondScatterplot() {
    if (thirdHistogramDisplayed.size == 0 && thirdHistogramDisplayed.size == 0) {
        secondScatterPlotSvg.selectAll("circle").attr("fill-opacity", .7)
            .attr("fill", "#9B59B6");
    } else {
        secondScatterPlotSvg.selectAll("circle").attr("fill-opacity", 0.0);
        thirdHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#B92B27", firstScatterPlotSvg)});
        forthHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, 1, "#2b6dad", firstScatterPlotSvg)});
    }
}

dispatch.on("enablePoints.scatterplot", function (data, histogramNumber) {
  switch (histogramNumber) {
    case ".histogram-q1":
      firstHistogramDisplayed.delete(data);
      break;
    case ".histogram-q2":
      secondHistogramDisplayed.delete(data);
      break;
    case ".histogram-q3":
      thirdHistogramDisplayed.delete(data);
      break;
    case ".histogram-q4":
      forthHistogramDisplayed.delete(data);
      break;
  }

  updateFirstScatterplot();
  updateSecondScatterplot();
});
