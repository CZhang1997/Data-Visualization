var dataArray = [5,11,18];
var margin = {left:0, right: 50, top:0, bottom:0, center: "50%"};

var width = window.screen.width;
var height = window.screen.width;
var mid_width = width / 2;
var mid_height = height /2.4;
var radius = 250;

// Create an svg container
var svg = d3.select("body").append("svg")
            .attr("height",width)
            .attr("width", height);
   

// Contained in one group
var template = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

    // The outter circle
    template.append("circle")
        .attr("cx", mid_width)
        .attr("cy", mid_height)
        .attr("fill", "#cdc1c5")
        .attr("r",radius + 50);

    // The inner circle
    template.append("circle")
          .attr("cx",mid_width)
          .attr("cy",mid_height)
          .attr("fill", "white")
          .attr("r", radius);

    // X-axis, representing healthy
    // horizontal line
    template.append("line")
      .attr("stroke-width", "1")
      .attr("stroke", "Green")
      .attr("x1", mid_width - radius)
      .attr("y1", mid_height)
      .attr("x2", mid_width + radius)
      .attr("y2", mid_height);

    // Y-axis, representing calorie
    // veritical line
    template.append("line")
        .attr("stroke-width", "1")
        .attr("stroke", "Red")
        .attr("x1", mid_width)
        .attr("y1", mid_height - radius)
        .attr("x2", mid_width)
        .attr("y2", mid_height + radius);


    d3.csv("data/disease.csv")
    .row(function(d){ return {disease: d.Disease, rank: d.rank}; })
    .get(function(error, data){
      console.log(data);
      console.log(data[1].disease);
    })
