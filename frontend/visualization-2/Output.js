var dispatch = d3.dispatch("display");
var width = 960,
    height = 500;

var svg = d3.select('#Output')
    .attr('width', width)
    .attr('height', height);

svg.append('text')
  .text('This is question 2')
  .attr('x', width/2)
  .attr('y', height/2)
  .attr('font-size', 20)
  .attr('fill', '#333')
  .style('text-anchor', 'middle')
  .on('mouseover', function(d,i) {
     d3.select(this).transition()
      .ease('sin')
      .duration('200')
      .attr('font-size', 32)
      .attr('fill', 'red');
  })
  .on('mouseout', function(d,i) {
    d3.select(this).transition()
      .ease('sin')
      .duration('200')
      .attr('font-size', 20)
      .attr('fill', '#333');
  });
  
 

  
	svg.append('text')
  .text('This is question 1')
  .attr('x', width/2)
  .attr('y', height/4)
  .attr('font-size', 20)
  .attr('fill', '#333')
  .style('text-anchor', 'middle')
  .on('mouseover', function(d,i) {
    d3.select(this).transition()
      .ease('sin')
      .duration('200')
      .attr('font-size', 32)
      .attr('fill', 'red');
  })
  .on('mouseout', function(d,i) {
    d3.select(this).transition()
      .ease('sin')
      .duration('200')
      .attr('font-size', 20)
      .attr('fill', '#333');
  });
  
dispatch.on("display.op", function(d) {
    svg.append('text')
  .text('This is question 123')
  .attr('x', width/6)
  .attr('y', height/8)
  .attr('font-size', 20)
  .attr('fill', '#333')
  .style('text-anchor', 'middle')
});