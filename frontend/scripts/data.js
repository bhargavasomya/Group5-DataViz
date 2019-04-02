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


$('#Submit').click(function() {
    var q1 = $('#q1FormInput').val();
    var q2 = $('#q2FormInput').val();

    $.ajax({
      type: "POST",
      contentType: "application/json;charset=utf-8",
      url: "http://127.0.0.1:5000/getdata",
      traditional: "true",
      data: JSON.stringify({ q1: q1, q2: q2 }),
      dataType: "json",
        success: function (e) {
                console.log(e);
                //window.location = "http://127.0.0.1:5000/";
            },
            error: function(error) {
                console.log(error);
        }
      });
    document.getElementById("scatter-viz").scrollIntoView();

});
