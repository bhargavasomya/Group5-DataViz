var allData;
var firstLoad = true;

const dispatch = d3.dispatch("dataLoaded", "heatmapDataLoaded",
    "firstHistogramDataLoaded", "secondHistogramDataLoaded",
    "thirdHistogramDataLoaded", "forthHistogramDataLoaded",
    "fifthHistogramDataLoaded", "sixthHistogramDataLoaded",
    "seventhHistogramDataLoaded", "eighthHistogramDataLoaded",
    "setupSankeyHistogram-9", "setupSankeyHistogram-10",
    "setupSankeyHistogram-11", "setupSankeyHistogram-12",
    "enablePoints", "disablePoints",
    "createSankey", "resetZoom");


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
    dispatch.call('seventhHistogramDataLoaded', null, thirdBins);

    var forthHistogram = d3.histogram()
        .value(function(d) {
          return model === "model1" ? functions.model1_probs_2(d) : functions.model2_probs_2(d);
        })
        .domain([0,1])
        .thresholds(20);

    var forthBins = forthHistogram(data);
    dispatch.call('forthHistogramDataLoaded', null, forthBins);
    dispatch.call('setupSankeyHistogram-12', null, forthBins);
    dispatch.call('eighthHistogramDataLoaded', null, forthBins);
}

function processScatterPlot(data, q1, q2) {
    dispatch.call('dataLoaded', null, data, q1, q2);
}

function getData(q1, q2, k, scroll = false) {
  $.ajax({
    type: "POST",
    contentType: "application/json;charset=utf-8",
    url: "http://ds5500-backend-4.wd2ywwxp3m.us-east-1.elasticbeanstalk.com/getdata",
    traditional: "true",
    data: JSON.stringify({ q1: q1, q2: q2, k: k }),
    dataType: "json",
    success: function (json_data) {
      d3.selectAll("circle").remove();
      d3.selectAll("rect").remove();
      d3.select(".first-scatterplot-cosine").selectAll("g").remove();
      d3.select(".second-scatterplot-cosine").selectAll("g").remove();
      allData = json_data;
      processHistogram(json_data);
      processScatterPlot(json_data, q1, q2);
      if (firstLoad) {
          $('#exampleModalCenter').modal();
          firstLoad = false;
      }
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

function getPredictionFirstModel(q1, q2) {
  console.log("Here");
  $.ajax({
    type: "POST",
    contentType: "application/json;charset=utf-8",
    url: "http://ds5500-backend-4.wd2ywwxp3m.us-east-1.elasticbeanstalk.com/predict-duplicate-with-first-model",
    traditional: "true",
    data: JSON.stringify({ q1: q1, q2: q2 }),
    dataType: "json",
    success: function (json_data) {
      var result = json_data.result;
      console.log(result);
      if (result >= 0.5) {
        sentence = "Using the first model, the questions are <b>duplicate</b>. Meanwhile..."
      } else {
        sentence = "Using the first model, the questions are <b>not duplicate</b>. Meanwhile..."
      }
      document.getElementById("first-model-result").innerHTML = sentence;
    },
    error: function(error) {
      console.log(error);
    }
  });
}

function getPredictionSecondModel(q1, q2) {
  $.ajax({
    type: "POST",
    contentType: "application/json;charset=utf-8",
    url: "http://ds5500-backend-4.wd2ywwxp3m.us-east-1.elasticbeanstalk.com/predict-duplicate-with-second-model",
    traditional: "true",
    data: JSON.stringify({ q1: q1, q2: q2 }),
    dataType: "json",
    success: function (json_data) {
      var result = json_data.result;
      console.log(result);
      var sentence = "";
      if (result >= 0.5) {
        sentence = "Using the second model, the questions are <b>duplicate</b>."
      } else {
        sentence = "Using the second model, the questions are <b>not duplicate</b>."
      }
      document.getElementById("second-model-result").innerHTML = sentence;
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

    getPredictionFirstModel(q1, q2);
    getPredictionSecondModel(q1, q2);
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


$('.second-radio-model').click(function() {
  var firstHistogram = "";

  if (document.getElementById('second-model-option1').checked) {
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
