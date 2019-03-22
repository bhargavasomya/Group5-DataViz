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
