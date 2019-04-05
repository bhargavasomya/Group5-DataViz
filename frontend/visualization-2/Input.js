var dispatch = d3.dispatch("stationHovered");

var width = 960,
    height = 500;

var input = d3.select('#Input')
    .attr('width', width)
    .attr('height', height);
    
input.append('text')
  .text('This is question 3')
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
 
 
  input.append('text')
  .text('This is question 4')
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