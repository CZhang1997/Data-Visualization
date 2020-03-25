var dataArray = [5,11,18];
var margin = {left:50, right: 50, top:40, bottom:0, center: "50%"};


var svg = d3.select("body").append("svg")
            .attr("height","100%")
            .attr("width", "100%");

var template = svg.append("g");//.attr("transform","translate("+margin.left+","+margin.top+")");

    template.append("circle")
        .attr("cx",margin.center)
        .attr("cy",margin.center)
        .attr("fill", "gray")
        .attr("r","300");

        template.append("circle")
            .attr("cx",margin.center)
            .attr("cy",margin.center)
            .attr("fill", "white")
            .attr("r","250");
