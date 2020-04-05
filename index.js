const contents = d3.select(".contents");

var dataArray = [5,11,18];
var margin = {left:0, right: 50, top:0, bottom:0, center: "50%"};

var width = screen.width;
var height = screen.height;
var mid_width = width / 2;
var mid_height = height /2.4;
var radius = 250;

// Create an svg container
const svg = contents.append("svg")
            .attr("height",width)
            .attr("width", height);

// Get the data from Firebase "food" collection
db.collection('food').get().then(res => {
    var data = [];
    res.docs.forEach(doc => {
      data.push(doc.data());
    });

    console.log(data);
});
            

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
    template.append("line")
      .attr("stroke-width", "1")
      .attr("stroke", "Green")
      .attr("x1", mid_width - radius)
      .attr("y1", mid_height)
      .attr("x2", mid_width + radius)
      .attr("y2", mid_height);

    // Y-axis, representing calorie
    template.append("line")
        .attr("stroke-width", "1")
        .attr("stroke", "Red")
        .attr("x1", mid_width)
        .attr("y1", mid_height - radius)
        .attr("x2", mid_width)
        .attr("y2", mid_height + radius);

