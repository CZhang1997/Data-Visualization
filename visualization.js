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


// Map: different color corresponding to food type
let typeColorMap = new Map();
typeColorMap.set('meat', '#3352FF');
typeColorMap.set('dairy', '#DD33FF');
typeColorMap.set('fruit', '#ACFF33');
typeColorMap.set('vegetable', '#106F1C');
typeColorMap.set('grain', '#EAD11A');

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
          //console.log(doc.data()["name"]);
        });
        // get the data length
        var dataSize = data.length;
        // find the degree per each data point, -1 such that last data point stuck at 90 degree
        var degreePerData = 90.0 / (dataSize - 1);
        var i; // loop counter
        var space = 2;  // space add to the point, so not overlap with inner circle

        for(i = 0; i < dataSize; i++) // loop through each data point
        {
          var degrees = i * degreePerData;  // find the degree that represent this data point
          var yLength = Math.abs(Math.sin(degrees * Math.PI / 180) * radius); // use sin to find the y change sin(radian)
          var xLength = Math.abs(Math.cos(degrees * Math.PI / 180) * radius); // use cos to find the x change
          //console.log("degrees at " + degrees + " x at " + xLength + " y at " + yLength);
          
          // add a small dot that represent this data
          template.append("circle")
                .attr("class", "food_name")
                .attr("cx",mid_width + xLength + space)
                .attr("cy",mid_height  - yLength - space)
                .attr("fill", typeColorMap.get(data[i]["type"])) // dot color
                .attr("r", 2); // dot size
          
          // add the name of this data point to the graph
          template.append("text")
                .attr("class", "food_name")
                .attr("x", mid_width + xLength + space *2)
                .attr("y", mid_height  - yLength  - 2*space)
                .style("text-anchor", "start")
              //  .attr("transform", "translate(10,50) rotate("+ (90 - degrees)+")")
                .text(data[i]["name"]) // text
                .attr("font-family", "Courier New") // text font styple
                .attr("font-size", "10px") // text font size
                .attr("fill", typeColorMap.get(data[i]["type"])) // text Color
        }
    });




