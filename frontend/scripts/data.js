const dispatch = d3.dispatch("dataLoaded",
    "firstHistogramDataLoaded", "secondHistogramDataLoaded",
    "thirdHistogramDataLoaded", "forthHistogramDataLoaded",
    "enablePoints", "disablePoints");


function processHistogram(data) {
    var firstHistogram = d3.histogram()
        .value(function(d) { return d.distance1 })
        .domain([-1,1])
        .thresholds(20);

    var firstBins = firstHistogram(data);
    dispatch.call('firstHistogramDataLoaded', null, firstBins);

    var secondHistogram = d3.histogram()
        .value(function(d) { return d.distance2 })
        .domain([-1,1])
        .thresholds(20);

    var secondBins = secondHistogram(data);
    dispatch.call('secondHistogramDataLoaded', null, secondBins);


    var thirdHistogram = d3.histogram()
        .value(function(d) { return d.distance1 })
        .domain([-1,1])
        .thresholds(20);

    var thirdBins = thirdHistogram(data);
    dispatch.call('thirdHistogramDataLoaded', null, thirdBins);

    var forthHistogram = d3.histogram()
        .value(function(d) { return d.distance1 })
        .domain([-1,1])
        .thresholds(20);

    var forthBins = forthHistogram(data);
    dispatch.call('forthHistogramDataLoaded', null, forthBins);
}

function processScatterPlot(data) {
    dispatch.call('dataLoaded', null, data);
}

function getData(q1, q2, k) {
  $.ajax({
    type: "POST",
    contentType: "application/json;charset=utf-8",
    url: "http://127.0.0.1:5000/getdata",
    traditional: "true",
    data: JSON.stringify({ q1: q1, q2: q2, k: k }),
    dataType: "json",
    success: function (json_data) {
      console.log(json_data)
      processHistogram(json_data);
      processScatterPlot(json_data);
    },
    error: function(error) {
      console.log(error);
    }
  });
}

$('.dropdown-item').click(function() {
  // Change sentence
  $('#pointsDropdown').text($(this).text());
  var q1 = $('#q1FormInput').val();
  var q2 = $('#q2FormInput').val();
  var k = $(this).text();
  d3.selectAll("circle").remove();


  getData(q1, q2, k);
});


$('#Submit').click(function() {
    var q1 = $('#q1FormInput').val();
    var q2 = $('#q2FormInput').val();


    getData(q1, q2, 1000);

});

// $('#scatter-viz').append('<div style="" id="loadingDiv"><div class="loader">Loading...</div></div>');
//$('#Submit').on('click', function() {
 // setTimeout(removeLoader, 2000); //wait for page load PLUS two seconds.
//});
$("#scatter-viz").hide()

$('#Submit').click(function(){
     $("#scatter-viz").show();
     document.getElementById("scatter-viz").scrollIntoView({behavior: "smooth"});

});

