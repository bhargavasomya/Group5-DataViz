function setupHistogram(data, klass) {
    var margin = {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    };

    //anything inside bracket will be selected
    var q1 = d3.selectAll(klass);

    var width = 250;
    var height = 150;


    var svg = q1
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var xScale = d3.scaleLinear() //Discrete Scale
        .domain([-1,1])
        .range([margin.left, width-margin.right]) //Rounds values of
    svg.append("g")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    var yScale = d3.scaleLinear() //Continuous Scale
        .domain([0, d3.max(data, function(d) { return d.length; })])
        .range([height-margin.bottom, margin.top]);
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    var flags = Array(20).fill(0);

    var colors = klass === ".histogram-q1" ? "#B92B27" : "#2b6dad"

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
        .attr("height", function(d) { return height - yScale(d.length); })
        .style("fill", colors)
        .on('click', function (d, i) {
            if (flags[i] == 0)
            {
                d3.select(this).transition()
                    .duration('50')
                    .attr('style', 'fill: orange');

                dispatch.call("disablePoints", null, d, klass);
                flags[i] = 1;
            } else {

                d3.select(this).transition()
                    .duration('50')
                    .attr('style', 'fill: ' + colors);

                dispatch.call("enablePoints", null, d, klass);
                flags[i] = 0;
            }
        });
}

dispatch.on("histogramDataLoaded.histogram", function(data) {
    setupHistogram(data, ".histogram-q1");
    setupHistogram(data, ".histogram-q2");
});
