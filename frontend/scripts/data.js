const dispatch = d3.dispatch("dataLoaded",
    "firstHistogramDataLoaded", "secondHistogramDataLoaded", "enablePoints", "disablePoints");


function processHistogram(data) {
    var histogram = d3.histogram()
        .value(function(d) { return d.distance1 })
        .domain([-1,1])
        .thresholds(20);

    var bins = histogram(data);
    dispatch.call('firstHistogramDataLoaded', null, bins);

    histogram = d3.histogram()
        .value(function(d) { return d.distance2 })
        .domain([-1,1])
        .thresholds(20);

    bins = histogram(data);
    dispatch.call('secondHistogramDataLoaded', null, bins);
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
        success: function (json_data) {
          console.log(json_data)
            processHistogram(json_data);
            processScatterPlot(json_data);
            //window.location = "http://127.0.0.1:5000/";
        },
        error: function(error) {
            console.log(error);
        }
    });
    document.getElementById("scatter-viz").scrollIntoView();

});
