const contents = d3.select(".contents");

var dataArray = [5,11,18];

// Create margins and dimensionss
const margin = {left:100, right: 20, top:20, bottom:100, center: "50%"};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

var width = 600; //screen.height
var height = 600;
var mid_width = width / 2;
var mid_height = height /2.4;
var radius = 250;
const gap = 50; // difference of outer and inner circles' radius

// Create an svg container
const svg = contents.append("svg")
            .attr("height",width)
            .attr("width", height);



// Get the data from Firebase "food" collection
db.collection('food').get().then(res => {
    var data = [];
    res.docs.forEach(doc => {
      data.push(doc.data()); // All the info stores into the data variable
      console.log(doc.data()["name"]);
    });
});


// Contained in one group
const template = svg.append("g")
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr("transform","translate("+0+","+gap+")");

    // The outter circle
    template.append("circle")
        .attr("cx", mid_width)
        .attr("cy", mid_height)
        .attr("fill", "#cdc1c5")
        .attr("r",radius + gap);

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
