const contents = d3.select(".contents");
var margin = {left:0, right: 50, top:0, bottom:0, center: "50%"};

var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
		  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
		  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
		  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
		  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
		  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
		  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
		  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
		  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
		  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

var width = 1000;// window.screen.width;
var height = 1000; //window.screen.width;
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
        var degreePerData = 90.0 / dataSize;
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
                .attr("fill", colorArray[i])
                .attr("r", 5);
          template.append("text")
                .attr("x", mid_width + xLength + space *2)
                .attr("y", mid_height  - yLength  - 2*space)
                .text(data[i]["name"])
                .attr("font-family", "sans-serif")
                .attr("font-size", "20px")
                .attr("fill", colorArray[i]);
        }
    });
