var allData;

const dispatch = d3.dispatch("dataLoaded", "heatmapDataLoaded",
    "firstHistogramDataLoaded", "secondHistogramDataLoaded",
    "thirdHistogramDataLoaded", "forthHistogramDataLoaded",
    "fifthHistogramDataLoaded", "sixthHistogramDataLoaded",
    "setupSankeyHistogram-9", "setupSankeyHistogram-10",
    "setupSankeyHistogram-11", "setupSankeyHistogram-12",
    "enablePoints", "disablePoints",
    "createSankey");


function processHistogram(data, model = "model1") {
    var firstHistogram = d3.histogram()
        .value(function(d) { return d.distance1 })
        .domain([-1,1])
        .thresholds(20);

    var firstBins = firstHistogram(data);
    dispatch.call('firstHistogramDataLoaded', null, firstBins);
    dispatch.call('fifthHistogramDataLoaded', null, firstBins);
    dispatch.call('setupSankeyHistogram-9', null, firstBins);

    var secondHistogram = d3.histogram()
        .value(function(d) { return d.distance2 })
        .domain([-1,1])
        .thresholds(20);

    var secondBins = secondHistogram(data);
    dispatch.call('secondHistogramDataLoaded', null, secondBins);
    dispatch.call('sixthHistogramDataLoaded', null, secondBins);
    dispatch.call('setupSankeyHistogram-10', null, secondBins);


    var functions = {
      model1_probs_1: function(d) { return d.model1_probs_1 },
      model1_probs_2: function(d) { return d.model1_probs_2 },
      model2_probs_1: function(d) { return d.model2_probs_1 },
      model2_probs_2: function(d) { return d.model2_probs_2 }
    };

  var thirdHistogram = d3.histogram()
    .value(function(d) {
      return model === "model1" ? functions.model1_probs_1(d) : functions.model2_probs_1(d);
    })
    .domain([0,1])
    .thresholds(10);

    var thirdBins = thirdHistogram(data);
    dispatch.call('thirdHistogramDataLoaded', null, thirdBins);
    dispatch.call('setupSankeyHistogram-11', null, thirdBins);


    var forthHistogram = d3.histogram()
        .value(function(d) {
          return model === "model1" ? functions.model1_probs_2(d) : functions.model2_probs_2(d);
        })
        .domain([0,1])
        .thresholds(20);

    var forthBins = forthHistogram(data);
    dispatch.call('forthHistogramDataLoaded', null, forthBins);
    dispatch.call('setupSankeyHistogram-12', null, forthBins);
}

function processScatterPlot(data) {
    dispatch.call('dataLoaded', null, data);
}

function getData(q1, q2, k, scroll = false) {
  $.ajax({
    type: "POST",
    contentType: "application/json;charset=utf-8",
    url: "http://127.0.0.1:5000/getdata",
    traditional: "true",
    data: JSON.stringify({ q1: q1, q2: q2, k: k }),
    dataType: "json",
    success: function (json_data) {
      d3.selectAll("circle").remove();
      d3.selectAll("rect").remove();
      allData = json_data;
      processHistogram(json_data);
      processScatterPlot(json_data);
      $("#scatter-viz").show();
      if (scroll) {
        document.getElementById("scatter-viz").scrollIntoView({behavior: "smooth"});
      }
      document.getElementById("Submit").value = "Start";
      $("#spinner1").hide();
      $("#spinner2").hide();
    },
    error: function(error) {
      console.log(error);
    }
  });
}


$('.dropdown1').click(function() {
  // Change sentence
  $("#spinner1").show();
  $('#points-dropdown1').text($(this).text());
  var q1 = $('#q1FormInput').val();
  var q2 = $('#q2FormInput').val();
  var k = $(this).text();
  getData(q1, q2, k);
});

$('.dropdown2').click(function() {
  // Change sentence
  $("#spinner2").show();
  $('#points-dropdown2').text($(this).text());
  var q1 = $('#q1FormInput').val();
  var q2 = $('#q2FormInput').val();
  var k = $(this).text();
  getData(q1, q2, k);
});

$('#Submit').click(function() {
    document.getElementById("Submit").value = "Loading ...";
    $("#scatter-viz").hide()
    var q1 = $('#q1FormInput').val();
    var q2 = $('#q2FormInput').val();

    getData(q1, q2, 1000, true);

});

$('.first-radio-model').click(function() {
  var firstHistogram = "";

  if (document.getElementById('first-model-option1').checked) {
    firstHistogram = "model1";
  } else {
    firstHistogram = "model2";
  }

  processHistogram(allData, firstHistogram);
});

$('.fifth-radio-model').click(function() {
    d3.select("#sankey-probability1").selectAll("text").remove();
    d3.select("#sankey-probability1").selectAll(".link").remove();
    d3.select("#sankey-probability1").selectAll("rect").remove();
    d3.select("#sankey-probability2").selectAll("text").remove();
    d3.select("#sankey-probability2").selectAll(".link").remove();
    d3.select("#sankey-probability2").selectAll("rect").remove();

    var firstHistogram = "";

    if (document.getElementById('first-model-option5').checked) {
        firstHistogram = "model1";
    } else {
        firstHistogram = "model2";
    }

    processHistogram(allData, firstHistogram);
});

$("#scatter-viz").hide();
$("#spinner1").hide();
