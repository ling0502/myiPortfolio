function makesvg(percentage, inner_text = "") {

  var abs_percentage = Math.abs(percentage).toString();
  var percentage_str = percentage.toString();
  var classes = ""

  if (percentage <= 30) {
    classes = "danger-stroke";
  } else if (percentage > 40 && percentage <= 70) {
    classes = "warning-stroke";
  } else {
    classes = "success-stroke";
  }

  var svg = '<svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg">'
    + '<circle class="circle-chart__background ' + classes + '"  cx="16.9" cy="16.9" r="15.9" />'
    + '<circle class="circle-chart__circle ' + classes + '"'
    + 'stroke-dasharray="' + abs_percentage + ',100"    cx="16.9" cy="16.9" r="15.9" />'
    + '<g class="circle-chart__info">';

  if (inner_text) {
    svg += '<text class="circle-chart__subline" x="17.9" y="15.5">' + inner_text + '</text>'
      + '<text class="circle-chart__percent" x="16.91549431" y="22">' + percentage_str + '%</text>'
  }

  svg += ' </g></svg>';

  return svg
}

$(function () {
  var circlecharts = $(".circlechart");

  circlecharts.each(function (i, circlechart) {
    var percentage = $(circlechart).data("percentage");
    var inner_text = $(circlechart).text();
    var svg = makesvg(percentage, inner_text);

    $(circlechart).html(svg);
  });
});

