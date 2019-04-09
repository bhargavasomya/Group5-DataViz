const forScatterplots = ['.histogram-q1', '.histogram-q2', '.histogram-q3', '.histogram-q4'];

function setupHistogram(data, klass) {

    var svg = d3.select(klass);
    svg.selectAll("*").remove();

    var margin = {
        top: 5,
        left: 5,
        right: 5,
        bottom: 1
    };

    //anything inside bracket will be selected
    var q1 = d3.selectAll(klass);

    var width = 250 - margin.left - margin.right;
    var height = 150;


    var svg = q1
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var range = function(klass) {
        switch(klass) {
            case ".histogram-q1":
                return [-1,1];
            case ".histogram-q2":
                return [-1,1];
            case ".histogram-q3":
                return [0,1];
            case ".histogram-q4":
                return [0,1];
            case ".histogram-q5":
                return [-1,1];
            case ".histogram-q6":
                return [-1,1];
        }
    }(klass);

    var xScale = d3.scaleLinear() //Discrete Scale
        .domain(range)
        .range([margin.left + 4, width]) //Rounds values of
    svg.append("g")
        .attr("transform", `translate(0,${height-margin.bottom-20})`)
        .call(d3.axisBottom().ticks(3).scale(xScale));

    var yScale = d3.scaleLinear() //Continuous Scale
        .domain([0, d3.max(data, function(d) { return d.length; })])
        .range([height-margin.bottom-20, margin.top]);
    svg.append("g")
        .attr("transform", `translate(${margin.left + 4},0)`)
        .call(d3.axisLeft().scale(yScale));

    var flags = Array(20).fill(0);

    var colors = function(klass) {
        switch(klass) {
            case ".histogram-q1":
                return "#B92B27";
            case ".histogram-q2":
                return "#2b6dad";
            case ".histogram-q3":
                return "#7a7fad";
            case ".histogram-q4":
                return "#1b622d";
            case ".histogram-q5":
                return "#B92B27";
            case ".histogram-q6":
                return "#2b6dad";
        }
    }(klass);

    var div = d3.select(klass).append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var scatter = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d) {return xScale(d.x0);})
        .attr("y", function (d) {return height - 20;})
        .attr("height", function(d) { return 0; })
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
        .style("fill", colors)
        .attr("class", "pointer")
        .on('mouseover', function (d, i) {
            // Hover color
            d3.select(this).style("fill", 'orange');
        })
        .on('mouseout', function (d, i) {
            if (flags[i] == 0) {
                d3.select(this).style("fill", colors);
            }
        })
        .on('click', function (d, i) {
            if (flags[i] == 0) {
                // Histogram logic for scatterplot
                if (forScatterplots.includes(klass)) {
                  dispatch.call("disablePoints", null, d, klass);
                } else {
                  // If it is for heapmap, color everything first
                  svg.selectAll("rect").style("fill", colors);
                  dispatch.call("heatmapDataLoaded", null, d, klass);
                };

                // Finally change the color to orange
                d3.select(this).transition()
                    .duration('50')
                    .attr('style', 'fill: orange');

                if (klass in forScatterplots) {
                  dispatch.call("disablePoints", null, d, klass);
                } else {
                  dispatch.call("heatmapDataLoaded", null, d, klass);
                }
                flags[i] = 1;
            } else {
                d3.select(this).transition()
                    .duration('50')
                    .attr('style', 'fill: ' + colors);

                if (forScatterplots.includes(klass)) {
                  dispatch.call("enablePoints", null, d, klass);
                } else {
                  dispatch.call("heatmapDataLoaded", null, null, klass);
                }
                flags[i] = 0;
            }
        });

    scatter.transition()
        .delay(function(_, i) {return i * 100;})
        .attr("height", function(d) { return height - yScale(d.length) - 20; })
        .attr("y", function (d) {return yScale(d.length);});

}


dispatch.on("firstHistogramDataLoaded.histogram", function(data) {
    setupHistogram(data, ".histogram-q1");
});

dispatch.on("secondHistogramDataLoaded.histogram", function(data) {
    setupHistogram(data, ".histogram-q2");
});

dispatch.on("thirdHistogramDataLoaded.histogram", function(data) {
    setupHistogram(data, ".histogram-q3");
});

dispatch.on("forthHistogramDataLoaded.histogram", function(data) {
    setupHistogram(data, ".histogram-q4");
});

dispatch.on("fifthHistogramDataLoaded.histogram", function(data) {
    setupHistogram(data, ".histogram-q5");
});

dispatch.on("sixthHistogramDataLoaded.histogram", function(data) {
    setupHistogram(data, ".histogram-q6");
});
