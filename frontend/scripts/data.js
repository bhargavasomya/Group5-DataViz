const dispatch = d3.dispatch("dataLoaded",
    "histogramDataLoaded", "enablePoints", "disablePoints");

d3.json("./dummies/points.json").then(function(data) {
    processHistogram(data);
    processScatterPlot(data);
});

function processHistogram(data) {
    var histogram = d3.histogram()
        .value(function(d) { return d.distance })
        .domain([-1,1])
        .thresholds(20);

    var bins = histogram(data);
    dispatch.call('histogramDataLoaded', null, bins);
}

function processScatterPlot(data) {
    dispatch.call('dataLoaded', null, data);
}



var q1 = $('#q1FormInput').val();
var q2 = $('#21FormInput').val();
$.ajax({
  type: 'POST',
  url: "http://127.0.0.1:5000/parse_data/",
  data: JSON.stringify(q1+"\t\t"+q2),
  contentType: 'application/json',
  success: function(data){
    // received data
  }
});
