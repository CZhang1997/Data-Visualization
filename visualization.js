var dataArray = [5,11,18];
var margin = {left:400, right: 50, top:40, bottom:0, center: 350};


var svg = d3.select("body").append("svg")
            .attr("height","100%")
            .attr("width", "100%");

var template = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");

    template.append("circle")
        .attr("cx",margin.center)
        .attr("cy",margin.center)
        .attr("fill", "#cdc1c5")
        .attr("r","300");

    template.append("circle")
            .attr("cx",margin.center)
            .attr("cy",margin.center)
            .attr("fill", "white")
            .attr("r","250");

    template.append("line")
      .attr("stroke-width", "2")
      .attr("stroke", "red")
      .attr("x1", margin.center * 0.3)
      .attr("y1", margin.center)
      .attr("x2", margin.center * 1.70)
      .attr("y2", margin.center);
    template.append("line")
        .attr("stroke-width", "2")
        .attr("stroke", "red")
        .attr("y1", margin.center * 0.3)
        .attr("x1", margin.center)
        .attr("y2", margin.center * 1.70)
        .attr("x2", margin.center);
