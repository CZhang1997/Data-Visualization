const contents = d3.select("#contents");

var nutritions = ["calories", "fat", "carbohydrates", "sodium", "portein"];

    // var y_selector = d3.select("#contents").append("select")
    // .attr("width", 100)
    // .attr("height", 100)
    // .attr("x", 100)
    // .attr("y", 100);

    // y_selector.selectAll('myOptions')
    //     .data(nutritions).enter()
    //     .append("option")
    //     .text(function(d) {return d;})
    //     .attr("value", function(d) {return d;})

    // y_selector.on("change", function(d) {
    //     // recover the option that has been chosen
    //     var selectedOption = d3.select(this).property("value");
    //     console.log(selectedOption);
    //     });

    // Handler for dropdown value change
    var dropdownChange = function() {
      var newCereal = d3.select(this).property('value');
       console.log(newCereal);
  };

  var svg = d3.select("#contents").append("svg").attr("width", "100%").attr("height", "100%");
  svg.append("circle")
    .attr("cx", 100)
    .attr("cy", 100)
    .attr("r", 50)
    .attr("fill", "red");

  var dropdown = d3.select("#contents")
      .insert("select", "svg")
      .on("change", dropdownChange);

  dropdown.selectAll("option")
      .data(nutritions)
    .enter().append("option")
      .attr("value", function (d) { return d; })
      .text(function (d) {
          return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
      });


    //     var yaxis_dropdown = d3.select("#contents").insert("select", "svg")
    //     .attr("width","50")
    //     .attr("height","50")
    //     .attr("x", "100")
    //     .attr("y", "100")
    //     .attr("id", "yaxis_select")
    //     .on("change", yaxis_dropdown_change);
    // var yaxis_dropdown_change = function()
    // {
    //     console.log(d3.select(this).property('value'));
    // }
    // yaxis_dropdown.selectAll("option")
    //     .data(nutritions)
    //     .enter().append("option")
    //     .attr("value", function (d) { return d; })
    //     .text(function (d) {
    //     return d[0].toUpperCase() + d.slice(1,d.length); // capitalize 1st letter
    //     });



