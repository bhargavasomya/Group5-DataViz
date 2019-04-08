// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 500 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgCosine1 = d3.select("#sankey-cosine-1").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svgCosine2 = d3.select("#sankey-cosine-2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var svgProbability1 = d3.select("#sankey-probability1").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svgProbability2 = d3.select("#sankey-probability2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Color scale used
var color = d3.scaleOrdinal(["#3366cc", "#dc3912"]);

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(20)
    .size([width, height]);

function wrap(text, width) {
  text.each(function () {
    var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        x = text.attr("x"),
        y = text.attr("y"),
        dy = 0, //parseFloat(text.attr("dy")),
        tspan = text.text(null)
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", dy + "em");
    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
      }
    }
  });
}

// load the data
function createSankey(graph, svg) {
  // Constructs a new Sankey generator with the default settings.
  sankey
      .nodes(graph.nodes)
      .links(graph.links)
      .layout(1);

  // add in the links
  var link = svg.append("g")
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("path")
      .attr("class", "link")
      .attr("d", sankey.link() )
      .style("stroke-width", function(d) { return Math.max(0.1, d.dy); })
      .sort(function(a, b) { return b.dy - a.dy; });

  // add in the nodes
  var node = svg.append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .call(d3.drag()
        .subject(function(d) { return d; })
        .on("start", function() { this.parentNode.appendChild(this); })
        .on("drag", dragmove));

  // add the rectangles for the nodes
  node
    .append("rect")
      .attr("height", function(d) { return d.dy; })
      .attr("width", sankey.nodeWidth())
      .style("fill", function(d) { return d.color = color(d.group); })
      .style("stroke", function(d) { return d3.rgb(d.color).darker(2); })
    // Add hover text
    .append("title")
      .text(function(d) { return d.name; }).call(wrap, 300);

  // add in the title for the nodes
    node
      .append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".20em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; }).call(wrap, 300)
        .attr("font-size", "10px")
        .attr("fill", function(d) { return d.color = color(d.group); })
      .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    link.append('title')
      .text(function(d) { return 'Weight= '+d.value; });
	
	node
	.select('text')
	.on('mouseover', function(d,i) {
    d3.select(this).transition()
      .ease(d3.easeSin)
      .duration('200')
      .attr('font-size', "15px")
      .attr('fill', 'black');
  })
  .on('mouseout', function(d,i) {
    d3.select(this).transition()
      .ease(d3.easeSin)
      .duration('200')
      .attr('font-size', "10px")
      .attr('fill', '#333');
  });
	

  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this)
      .attr("transform",
        "translate("
        + d.x + ","
        + (d.y = Math.max(
          0, Math.min(height - d.dy, d3.event.y))
        ) + ")");
    sankey.relayout();
    link.attr("d", sankey.link() );
  }

};

var cosineSankeyData1 = {
"nodes":[
  {"node":0,"name":"This is question 1", "group":0},
  {"node":1,"name":"This is question 2", "group":0},
  {"node":2,"name":"This is question 3", "group":0},
  {"node":3,"name":"This is question 4", "group":0},
  {"node":4,"name":"This is question 5", "group":0},
  {"node":5,"name":"This is question 6", "group":0},
  {"node":6,"name":"This is question 6", "group":0},
  {"node":7,"name":"This is question 6", "group":0},
  {"node":8,"name":"This is question 6", "group":0},
  {"node":9,"name":"This is question 6", "group":0},
  {"node":10,"name":"This is question 6", "group":0},
],
"links":[
  {"source":0,"target":1,"value":0},
  {"source":0,"target":2,"value":0},
  {"source":0,"target":3,"value":0},
  {"source":0,"target":4,"value":0},
  {"source":0,"target":5,"value":0},
  {"source":0,"target":6,"value":0},
  {"source":0,"target":7,"value":0},
  {"source":0,"target":8,"value":0},
  {"source":0,"target":9,"value":0},
  {"source":0,"target":10,"value":0},
]};

var cosineSankeyData2 = {
  "nodes":[
    {"node":0,"name":"This is question 1", "group":0},
    {"node":1,"name":"This is question 2", "group":0},
    {"node":2,"name":"This is question 3", "group":0},
    {"node":3,"name":"This is question 4", "group":0},
    {"node":4,"name":"This is question 5", "group":0},
    {"node":5,"name":"This is question 6", "group":0},
    {"node":6,"name":"This is question 6", "group":0},
    {"node":7,"name":"This is question 6", "group":0},
    {"node":8,"name":"This is question 6", "group":0},
    {"node":9,"name":"This is question 6", "group":0},
    {"node":10,"name":"This is question 6", "group":0},
  ],
  "links":[
    {"source":0,"target":1,"value":0},
    {"source":0,"target":2,"value":0},
    {"source":0,"target":3,"value":0},
    {"source":0,"target":4,"value":0},
    {"source":0,"target":5,"value":0},
    {"source":0,"target":6,"value":0},
    {"source":0,"target":7,"value":0},
    {"source":0,"target":8,"value":0},
    {"source":0,"target":9,"value":0},
    {"source":0,"target":10,"value":0},
  ]};

var probabilitySankeyData1 = {
"nodes":[
  {"node":0,"name":"This is question 1", "group":0},
  {"node":1,"name":"This is question 2", "group":0},
  {"node":2,"name":"This is question 3", "group":0},
  {"node":3,"name":"This is question 4", "group":0},
  {"node":4,"name":"This is question 5", "group":0},
  {"node":5,"name":"This is question 6", "group":0},
  {"node":6,"name":"This is question 6", "group":0},
  {"node":7,"name":"This is question 6", "group":0},
  {"node":8,"name":"This is question 6", "group":0},
  {"node":9,"name":"This is question 6", "group":0},
  {"node":10,"name":"This is question 6", "group":0}
],
"links":[
  {"source":0,"target":1,"value":0},
  {"source":0,"target":2,"value":0},
  {"source":0,"target":3,"value":0},
  {"source":0,"target":4,"value":0},
  {"source":0,"target":5,"value":0},
  {"source":0,"target":6,"value":0},
  {"source":0,"target":7,"value":0},
  {"source":0,"target":8,"value":0},
  {"source":0,"target":9,"value":0},
  {"source":0,"target":10,"value":0}
]};

var probabilitySankeyData2 = {
  "nodes":[
    {"node":0,"name":"This is question 1", "group":0},
    {"node":1,"name":"This is question 2", "group":0},
    {"node":2,"name":"This is question 3", "group":0},
    {"node":3,"name":"This is question 4", "group":0},
    {"node":4,"name":"This is question 5", "group":0},
    {"node":5,"name":"This is question 6", "group":0},
    {"node":6,"name":"This is question 6", "group":0},
    {"node":7,"name":"This is question 6", "group":0},
    {"node":8,"name":"This is question 6", "group":0},
    {"node":9,"name":"This is question 6", "group":0},
    {"node":10,"name":"This is question 6", "group":0}
  ],
  "links":[
    {"source":0,"target":1,"value":0},
    {"source":0,"target":2,"value":0},
    {"source":0,"target":3,"value":0},
    {"source":0,"target":4,"value":0},
    {"source":0,"target":5,"value":0},
    {"source":0,"target":6,"value":0},
    {"source":0,"target":7,"value":0},
    {"source":0,"target":8,"value":0},
    {"source":0,"target":9,"value":0},
    {"source":0,"target":10,"value":0}
  ]};

function restoreDefault() {
  return {
    "nodes":[
      {"node":0,"name":"This is question 1", "group":0},
      {"node":1,"name":"This is question 2", "group":0},
      {"node":2,"name":"This is question 3", "group":0},
      {"node":3,"name":"This is question 4", "group":0},
      {"node":4,"name":"This is question 5", "group":0},
      {"node":5,"name":"This is question 6", "group":0},
      {"node":6,"name":"This is question 6", "group":0},
      {"node":7,"name":"This is question 6", "group":0},
      {"node":8,"name":"This is question 6", "group":0},
      {"node":9,"name":"This is question 6", "group":0},
      {"node":10,"name":"This is question 6", "group":0}
    ],
    "links":[
      {"source":0,"target":1,"value":0},
      {"source":0,"target":2,"value":0},
      {"source":0,"target":3,"value":0},
      {"source":0,"target":4,"value":0},
      {"source":0,"target":5,"value":0},
      {"source":0,"target":6,"value":0},
      {"source":0,"target":7,"value":0},
      {"source":0,"target":8,"value":0},
      {"source":0,"target":9,"value":0},
      {"source":0,"target":10,"value":0}
    ]};
}

dispatch.on("createSankey.sankey", function (data, klass) {
  const cosineHistograms = [".histogram-q9", ".histogram-q10"];
  var sortedData;
  var model = "model1";
  
  if (cosineHistograms.includes(klass)) {
    // If cosine, first question
    if (klass === ".histogram-q9") {
      sortedData = data.sort(function(a,b) {return b.distance1 - a.distance1});
    } else {
      sortedData = data.sort(function(a,b) {return b.distance2 - a.distance2});
    }
  } else {
    // For probability
    if (model === "model1") {
      if (klass === ".histogram-q11") {
        sortedData = data.sort(function(a,b) {return b.model1_probs_1 - a.model1_probs_1});
      } else {
        sortedData = data.sort(function(a,b) {return b.model1_probs_2 - a.model1_probs_2});
      }
    } else {
      if (klass === ".histogram-q11") {
        sortedData = data.sort(function(a,b) {return b.model2_probs_1 - a.model2_probs_1});
      } else {
        sortedData = data.sort(function(a,b) {return b.model2_probs_2 - a.model2_probs_2});
      }
    }
  }
  
  // Cut data if more than 10
  if (sortedData.length >= 10) {
    sortedData = sortedData.slice(0, 10);
  }

  if (cosineHistograms.includes(klass)) {
    var nodes;
    var links;
    if (klass === ".histogram-q9") {
      cosineSankeyData1 = restoreDefault();
      nodes = cosineSankeyData1.nodes;
      links = cosineSankeyData1.links;

      nodes[0].name = $('#q1FormInput').val();

      sortedData.forEach(function(g, i) {
        nodes[i + 1].name = g.question;
        links[i].value = g.distance1;
      });
      cosineSankeyData1.nodes = nodes;
      cosineSankeyData1.links = links;

      createSankey(cosineSankeyData1, svgCosine1);
    } else {
      cosineSankeyData2 = restoreDefault();
      nodes = cosineSankeyData2.nodes;
      links = cosineSankeyData2.links;

      nodes[0].name = $('#q2FormInput').val();

      sortedData.forEach(function(g, i) {
        nodes[i + 1].name = g.question;
        links[i].value = g.distance2;
      });
      cosineSankeyData2.nodes = nodes;
      cosineSankeyData2.links = links;

      createSankey(cosineSankeyData2, svgCosine2);

    }

  } else {
    var nodes;
    var links;

    if (klass === ".histogram-q11") {
      probabilitySankeyData1 = restoreDefault();
      nodes = probabilitySankeyData1.nodes;
      links = probabilitySankeyData1.links;

      nodes[0].name = $('#q1FormInput').val();

      sortedData.forEach(function(g, i) {
        nodes[i + 1].name = g.question;
        links[i].value = model === "model1" ? g.model1_probs_1 : g.model2_probs_1;
      });

      probabilitySankeyData1.nodes = nodes;
      probabilitySankeyData1.links = links;

      createSankey(probabilitySankeyData1, svgProbability1);
    } else {
      probabilitySankeyData2 = restoreDefault();
      nodes = probabilitySankeyData2.nodes;
      links = probabilitySankeyData2.links;

      nodes[0].name = $('#q2FormInput').val();

      sortedData.forEach(function(g, i) {
        nodes[i + 1].name = g.question;
        links[i].value = model === "model1" ? g.model1_probs_2 : g.model2_probs_2;
      });

      probabilitySankeyData2.nodes = nodes;
      probabilitySankeyData2.links = links;

      createSankey(probabilitySankeyData2, svgProbability2);
    }
  }
});
