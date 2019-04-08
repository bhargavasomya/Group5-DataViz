function setupSankeyHistogram(data, klass) {

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

    var width = 250;
    var height = 150;


    var svg = q1
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var range = function(klass) {
        switch(klass) {
            case ".histogram-q9":
                return [-1,1];
            case ".histogram-q10":
                return [-1,1];
            case ".histogram-q11":
                return [0,1];
            case ".histogram-q12":
                return [0,1];
        }
    }(klass);

    var xScale = d3.scaleLinear() //Discrete Scale
        .domain(range)
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

    var colors = function(klass) {
        switch(klass) {
            case ".histogram-q9":
                return "#B92B27";
            case ".histogram-q10":
                return "#2b6dad";
            case ".histogram-q11":
                return "#7a7fad";
            case ".histogram-q12":
                return "#1b622d";
        }
    }(klass);

    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
        .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0) -1 ; })
        .attr("height", function(d) { return height - yScale(d.length); })
        .style("fill", colors)
        .on('mouseover', function (d, i) {
            // Hover color
            d3.select(this).style("fill", 'orange');
        })
        .on('mouseout', function (d, i) {
            if (d3.select(this).attr("class") !== "selected") {
                d3.select(this).style("fill", colors);
            }
        })
        .on('click', function (d, i) {
            svg.selectAll("rect").style("fill", colors);
            svg.selectAll("rect").attr("class", "");

            d3.select(this).style("fill", "orange");
            d3.select(this).attr("class", "selected");

            switch(klass) {
                case ".histogram-q9":
                    d3.select("#sankey-cosine-1").selectAll("text").remove();
                    d3.select("#sankey-cosine-1").selectAll(".link").remove();
                    d3.select("#sankey-cosine-1").selectAll("rect").remove();

                    break;
                case ".histogram-q10":
                    d3.select("#sankey-cosine-2").selectAll("text").remove();
                    d3.select("#sankey-cosine-2").selectAll(".link").remove();
                    d3.select("#sankey-cosine-2").selectAll("rect").remove();
                    break;
                case ".histogram-q11":
                    d3.select("#sankey-probability1").selectAll("text").remove();
                    d3.select("#sankey-probability1").selectAll(".link").remove();
                    d3.select("#sankey-probability1").selectAll("rect").remove();
                    break;
                case ".histogram-q12":
                    d3.select("#sankey-probability2").selectAll("text").remove();
                    d3.select("#sankey-probability2").selectAll(".link").remove();
                    d3.select("#sankey-probability2").selectAll("rect").remove();
                    break;
            }
            console.log(klass);
            dispatch.call("createSankey", null, d, klass);
        });
}



dispatch.on("setupSankeyHistogram-9.histogram-sankey", function(data, defaultSelection = null) {
    setupSankeyHistogram(data, ".histogram-q9");
});

dispatch.on("setupSankeyHistogram-10.histogram-sankey", function(data, defaultSelection = null) {
    setupSankeyHistogram(data, ".histogram-q10");
});

dispatch.on("setupSankeyHistogram-11.histogram-sankey", function(data, defaultSelection = null) {
    setupSankeyHistogram(data, ".histogram-q11");
});

dispatch.on("setupSankeyHistogram-12.histogram-sankey", function(data, defaultSelection = null) {
    setupSankeyHistogram(data, ".histogram-q12");
});
