d3.json("../dummies/histogram.json").then(function(data) {
    histogramQ1(data);
});

d3.json("../dummies/histogram.json").then(function(data) {
    histogramQ2(data);
});

function histogramQ1(data) {
    processData(data, ".histogram-q1");
}

function histogramQ2(data) {
    processData(data, ".histogram-q2");
}

function processData(data, klass) {
    var margin = {
        top: 5,
        left: 5,
        right: 5,
        bottom: 5
    };

    //anything inside bracket will be selected
    var q1 = d3.select(klass);

    var width = 350;
    var height = 150;

    console.log(width);
    console.log(height);


    var svg = q1
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var xScale = d3.scaleBand() //Discrete Scale
        .domain(data.flatMap(function(o) {return [o.x];}))
        .rangeRound([margin.left, width-margin.right]) //Rounds values of
        .padding(0.5);

    var yScale = d3.scaleLinear() //Continuous Scale
        .domain(data.flatMap(function(o) {return [o.y];}))
        .range([height-margin.bottom, margin.top]);

    var xAxis = svg.append("g")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    var yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var bar = svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d){
            return xScale(d.x);})
        .attr("y", function(d){return yScale(d.y);})
        .attr("width", xScale.bandwidth())
        .attr("height", function(d){ return height - margin.bottom - yScale(d.y);})
        .attr("fill", "orange")
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '.85');
            div.transition()
                .duration(50)
                .style("opacity", 1);
            let num = d.y;
            div.html(num)
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
        })

        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('50')
                .attr('opacity', '1');
            div.transition()
                .duration('50')
                .style("opacity", 0);
        });

}

