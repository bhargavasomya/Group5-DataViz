var question1 = "";
var question2 = "";

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
    var gX = scatterPlotSvg.append("g")
        .attr("transform", `translate(0,${scatterPlotHeight-scatterPlotMargin.bottom})`)
        .call(d3.axisBottom().scale(scatterPlotXScale).ticks(10));

    var gY = scatterPlotSvg.append("g")
        .attr("transform", `translate(${scatterPlotMargin.left},0)`)
        .call(d3.axisLeft().scale(scatterPlotScale));

    var zoom = d3.zoom()
    .scaleExtent([.5, 20])
    .extent([[0, 0], [scatterPlotWidth, scatterPlotHeight]])
    .on("zoom", zoomed);

    scatterPlotSvg.append("rect")
    .attr("width", scatterPlotWidth)
    .attr("height", scatterPlotHeight)
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('transform', `translate(${scatterPlotMargin.left},${scatterPlotMargin.top})`)
    .call(zoom);

    var selectedTextClass = "";
    
    if(scatterPlotNumber == 1) {
      selectedTextClass = ".selected-text1";
    } else {
      selectedTextClass = ".selected-text2";
    }
    var selectedText = d3.select(selectedTextClass);
    var currentColor = "";

    var points = scatterPlotSvg.selectAll("circle")//empty selection
        .data(data)
        .enter() //empty placeholder
        .append("circle")
        .attr("cx", function(d) { return scatterPlotXScale(d.x); })
        .attr("cy", function(d) { return scatterPlotScale(d.y); })
        .attr("r", function(d) { return (d.question === question1 || d.question === question2) ? 7 : 3})
        .style("opacity", 0.7)
        .attr("fill", function(d) {return (d.question === question1 || d.question === question2) ? "orange" : "#9B59B6"})
        .on('mouseover', function (d, i) {
            currentColor = d3.select(this).attr("fill");
            d3.select(this).attr("fill", 'orange');
            d3.select(this).transition().attr("r", 8);
            let q = d.question;
            selectedText.html("Hovered point: " + q);
        })
        .on('mouseout', function (d, i) {
            d3.select(this).attr("fill", currentColor);
            d3.select(this).transition().attr("r", 3);
            selectedText.html("Hovered point: <br><br><br>");
        });

    function zoomed() {
    // create new scale ojects based on event
    var new_xScale = d3.event.transform.rescaleX(scatterPlotXScale);
    var new_yScale = d3.event.transform.rescaleY(scatterPlotScale);
    // update axes
    gX.call(d3.axisBottom().scale(scatterPlotXScale).scale(new_xScale));
    gY.call(d3.axisLeft().scale(scatterPlotScale).scale(new_yScale));
    points.data(data)
     .attr('cx', function(d) {return new_xScale(d.x)})
     .attr('cy', function(d) {return new_yScale(d.y)});
    }

}

var storedData;
var firstHistogramDisplayed = new Set();
var secondHistogramDisplayed = new Set();

var thirdHistogramDisplayed = new Set();
var forthHistogramDisplayed = new Set();


dispatch.on("dataLoaded.scatterplot", function(data, _question1, _question2) {
    storedData = data;
    question1 = _question1;
    question2 = _question2;
    setupScatterPlot(data, firstScatterPlotSvg, 1);
    setupScatterPlot(data, secondScatterPlotSvg, 2);
});

function setOpacityAndColorForGroup(value, opacityValue, colorValue, scatterPlotSvg) {
    value.forEach(function(v) {
        scatterPlotSvg.selectAll("circle").filter(function (d) {
            return d === v;
        }).transition().delay(100).attr("fill-opacity", opacityValue)
        .attr("fill", function(d) {return (d.question === question1 || d.question === question2) ? "orange" : colorValue})
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
        firstScatterPlotSvg.selectAll("circle").transition().attr("fill-opacity", .7)
            .attr("fill", function(d) { return (d.question === question1 || d.question === question2) ? "orange" : "#9B59B6"});
    } else {
        firstScatterPlotSvg.selectAll("circle").transition().attr("fill-opacity", 0.0);
        firstHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, .7, "#B92B27", firstScatterPlotSvg)});
        secondHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, .7, "#2b6dad", firstScatterPlotSvg)});
    }
}

function updateSecondScatterplot() {
    if (thirdHistogramDisplayed.size == 0 && thirdHistogramDisplayed.size == 0) {
        secondScatterPlotSvg.selectAll("circle").transition().attr("fill-opacity", .7)
            .attr("fill", function(d) { return (d.question === question1 || d.question === question2) ? "orange" : "#9B59B6"});
    } else {
        secondScatterPlotSvg.selectAll("circle").attr("fill-opacity", 0.0);
        thirdHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, .7, "#B92B27", firstScatterPlotSvg)});
        forthHistogramDisplayed.forEach(function(g) {setOpacityAndColorForGroup(g, .7, "#2b6dad", firstScatterPlotSvg)});
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
