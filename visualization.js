const contents = d3.select(".contents");
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

    // Get the data from Firebase "food" collection
    db.collection('food').get().then(res => {
        var data = [];
        res.docs.forEach(doc => {
          data.push(doc.data()); // All the info stores into the data variable
          console.log(doc.data()["name"]);
        });
        var dataSize = data.length;
        var degreePerData = 90 / dataSize;
        var i;
        var colors = ["black", "yellow", "blue", "green"]
        var space = 5;
        for(i = 0; i < dataSize; i++)
        {
          var degrees = i * degreePerData;

          var yLength = Math.abs(Math.sin(degrees) * radius);
          var xLength = Math.abs(Math.cos(degrees) * radius);
          console.log("degrees at " + degrees + " x at " + xLength + " y at " + yLength);
          template.append("circle")
                .attr("cx",space + mid_width + xLength)
                .attr("cy",mid_height  - yLength - space)
                .attr("fill", colors[i])
                .attr("r", 5);
          template.append("text")
                .attr("x", mid_width + xLength + space *2)
                .attr("y", mid_height  - yLength  - 2*space)
                .text(data[i]["name"])
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", "red");
        }
    });
