
/*
@reference: https://observablehq.com/@d3/hierarchical-edge-bundling
*/
const contents = d3.select("#contents");


var colorin = "#00f"
var colorout = "#f00"
var colornone = "#ccc"
// get screen height, most pc screen has greater width than height, pick smaller value

var height = window.screen.height - 100
var width = height //window.screen.height - 200

// add more number to reduce the size of the circle
var boxWidth = width + 200
                // minus value to change the length of the axis
var bar_width = height - 400 //600
var radius = width / 2

var margin = {left: -bar_width/2, right: 50, top: -bar_width/2, bottom:0};
var plotshift = bar_width / 2
var plotDataSet = [];
var dotSize = 2;

var ingredient_type = ["meat", "dairy", "fruit", "vegetable", "legumes", "grain", "sause", "other"];
                //  0           1       2               3           4
var nutritions = ["calories", "fat", "carbohydrates", "sodium", "portein"];
// change the index below to change to different comparsion 
var xLabel = 0;
var yLabel = 2;

line = d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius(d => d.y)
    .angle(d => d.x)
tree = d3.cluster()
    .size([2 * Math.PI, radius - 100])
  

// Read data from json file
d3.json("data/data.json").then(function(da) { // this cover all code below
//});

    data = hierarchy(da)
    // Setting up data for each node
    const root = tree(bilink(d3.hierarchy(data)
        .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));

    
    const svg = d3.select("#contents").append("svg")
      .attr("width", width + 100)
      .attr("height", height)
      .attr("viewBox", [-boxWidth / 2, -boxWidth / 2 , boxWidth, boxWidth]);

    
    
    // Set up domain&range for xy axis
    var x = d3.scaleLinear()
        .domain([0, d3.max(plotDataSet, function(d) { return d[xLabel]; })])
      //  .ticks(2)
        .range([0, bar_width]);
    var y = d3.scaleLinear()
        .domain([0, d3.max(plotDataSet, function(d) { return d[yLabel]; })])
        .range([bar_width, 0]);
    var tickNumber = 2;
    // Add X axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("stroke-width", "2")
        .attr("transform", "translate("+ margin.left +"," + (margin.top + plotshift) + ")")
        .call(d3.axisBottom(x).ticks(tickNumber));

    // Add X axis label
    svg.append("text")
        .attr("class", "x-label")
        .attr("font-family", "monospace")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .attr("x", -margin.left + (nutritions[xLabel].length) )
        .attr("y", 5 )
        .text(toUpper(nutritions[xLabel]));
    
    // Add Y axis
    svg.append("g")
        .attr("class", "y-axis")
        .attr("stroke-width", "2")
        .attr("transform", "translate("+ (margin.left + plotshift) +"," + margin.top + ")")
        .call(d3.axisLeft(y).ticks(tickNumber));
    
    // Add Y axis label
    svg.append("text")
        .attr("font-family", "monospace")
        .attr("text-anchor", "middle")
        .attr("class", "y-label")
        .attr("font-weight", "bold")
        .attr("x", 0)
        .attr("y", margin.top-5)
        .text(toUpper(nutritions[yLabel]));

    
    var y_selector = d3.select("#contents").append("select")
    y_selector.selectAll('myOptions')    
        .attr("id", "y_selector")
        .data(nutritions).enter()
        .append("option")
        .text(function(d) {return d;})
        .attr("value", function(d) {return d;})

    y_selector.on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value");
        console.log(selectedOption);
        })
    // var yaxis_dropdown = d3.select("#contents").insert("select", "svg")
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

    // Add dots for scatter plots
    svg.append('g')
    .selectAll("dot")
    .data(root.children) // Only displays dot for ingredients
    .enter()
    .append("circle")
    .attr("transform", "translate("+ margin.left +"," + margin.top + ")")
    .attr("cx", function (d) { return x(d.data[nutritions[xLabel]]);}) // x-axis value
    .attr("cy", function (d) { return y(caloriesFix(d.data[nutritions[yLabel]])); }) // y -axis value
    .attr("r", dotSize)
    .style("fill", colornone)
    .each(function(d){d.dot = this;})
  
    // Define pie, arc functions and data for pie chart whihc color the 4 quadrants
     const pie = d3.pie()
        .sort(null)
        .value(d => d.value);
    const arcPath = d3.arc()
        .outerRadius(boxWidth / 4)
        .innerRadius(0);
    const angles = [
        {name: 'first', value: 100, text: ''},
        {name: 'second', value: 100, text: ''},
        {name: 'third', value: 100, text: ''},
        {name: 'fourth', value: 100, text: ''}];

    // (Pie Chart) Add color for the 4 quadrants
    svg.append("g")
        .attr("stroke", "white")
        .style("stroke-width", "17px")
        .style("opacity", 0.15)
        .selectAll("pie-region")
        .data(pie(angles))
        .attr("class", 'arc')
        .join("path")
        .attr("fill", function(d){ return generateQuadrantColor(d.data.name); }) // Text Color
        .attr("d", arcPath)
        .append("title");
    // (Pie Chart) Add text for the 4 quadrants
    svg.append("g")
        .attr("font-family", "Brush Script MT")
        .attr("font-size", 20)
        .attr("text-anchor", "middle")
        .selectAll("text-region")
        .data(pie(angles))
        .join("text")
        .attr("transform", d => `translate(${arcPath.centroid(d)})`)
        .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("fill-opacity", 0.5)
        .text(d => d.data.text))

    // Node
    const node = svg.append("g")
        .attr("font-family", "monospace")
        .attr("font-size", 15)
        .attr("font-weight", "bold")
        .selectAll("g")
        .data(root.leaves())
        .join("g")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
        .append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.x < Math.PI ? 6 : -6)
        .attr("text-anchor", d => d.x < Math.PI ? "start" : "end") // Display position
        .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null) // Display location
        .text(d => d.data.name) // Text
        .attr("fill", function(d){ return generateTextColor(d.data.group); }) // Text Color
        .each(function(d) { d.text = this; })
        .on("mouseover", overed)
        //.on("mouseover", function(d){ return overed_dot(root.children[root.children.length - 1]) })
        //.on("mouseover", overed_dot(d => root.children[root.children.length - 1]))
        .on("mouseout", outed)
        .call(text => text.append("title") // Display a text box for nutrition facts
            .text(d => getInfo(d))
            ); /*
                ${id(d)}
                ${d.outgoing.length} outgoing
                ${d.incoming.length} incoming*/

    // Add dots for each ingredient
    svg.append('g')
        .selectAll("node_dot")
        .data(root.leaves())
        .enter()
        .append("circle")
        .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)        
        .attr("r", 5)
        .attr("fill", function(d){ return generateTextColor(d.data.group); }) // Text Color
        .each(function(d){d.node_dot = this;})

    // Link that connects nodes with each other
    const link = svg.append("g")
        .attr("stroke", colornone)
        .attr("fill", "none")
        .style("opacity", 0.7)
        .selectAll("path")
        .data(root.leaves().flatMap(leaf => leaf.outgoing))
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", ([i, o]) => line(i.path(o)))
        .each(function(d) { d.path = this; });
    
    // Legend
    /*
    Reference: https://www.d3-graph-gallery.com/graph/bubble_template.html
    var width3 = width2 - 100
    svg.append("g").selectAll("myrect")
        .data(ingredient_type)
        .enter()
        .append("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 10 + i*(20+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 10)
        .style("fill", "red") // function(d){ return myColor(d)})
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight);
        */

    // Mouse is on the node    
    function overed(d) {
        link.style("mix-blend-mode", null);
        d3.select(this).attr("font-weight", "bold");
        d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", colorin).raise();
        d3.selectAll(d.incoming.map(([d]) => d.text)).attr("font-weight", "bold").attr("font-size", 25);
        d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", colorout).raise();
        d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("font-weight", "bold").attr("font-size", 25);
        d3.select(d.dot).attr("r", dotSize * 4).style("fill", function(d){ return generateTextColor(d.data.group);});
        // we can turn this into button
        if(d.data["name"] == "Ramen")
        {
            yLabel = 3;
            xLabel = 2;
            updatePlot();
        }
        if(d.data["name"] == "Pizze-Cheese")
        {
            yLabel = 0;
            xLabel = 1;
            updatePlot();
        }
        // Lighten up each item's ingredients' dots
        d3.selectAll(d.outgoing.map(([, d]) => d.dot))
            .attr("r", dotSize * 4)
            .style("fill", function(d){ return generateTextColor(d.data.group);});
    }

    // Mouse is off the node
    function outed(d) {
        link.style("mix-blend-mode", "multiply");
        d3.select(this).attr("font-weight", null);
        d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
        d3.selectAll(d.incoming.map(([d]) => d.text)).attr("font-weight", null).attr("font-size", 15);
        d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
        d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("font-weight", null).attr("font-size", 15);
        d3.select(d.dot).attr("r", dotSize).style("fill", colornone);
       // d3.select(d.dot).attr("r", dotSize).style("fill", function(d){ return generateTextColor(d.data.group);});
     //   d3.selectAll(d.incoming.map(([d]) => d.dot)).attr("r", dotSize).style("fill", colornone);
     //   d3.selectAll(d.outgoing.map(([d]) => d.dot)).attr("r", dotSize).style("fill", colornone);
        d3.selectAll(d.outgoing.map(([, d]) => d.dot)).attr("r", dotSize).style("fill", colornone);
        
    }
        
    // Function that reads data and build hierarchy relationships
    function hierarchy(data, delimiter = ".") {
        let root;
        const map = new Map;
            
        data.forEach(function find(data) {
            const {name} = data;
              
            if (map.has(name)) return map.get(name);
              
            const i = name.lastIndexOf(delimiter);
            map.set(name, data);
            if("fat" in data)   // add data to plot data set
            {
                var cal = caloriesFix(data["calories"]);
                var fat = data["fat"];
                var carb = data["carbohydrates"];
                var sodium = data["sodium"];
                var protein = data["protein"];

                plotDataSet.push([cal, fat, carb, sodium, protein]);
            }
            if (i >= 0) {
                find({name: name.substring(0, i), children: []}).children.push(data);
                data.name = name.substring(i + 1);
            } 
            else {
                root = data;
            }
              
            return data;
            });
            
            return root;
    }
        
    function bilink(root) {
        const map = new Map(root.leaves().map(d => [id(d), d]));
            
        for (const d of root.leaves()) d.incoming = [], d.outgoing = d.data.imports.map(i => [d, map.get(i)]);
            
        for (const d of root.leaves()) for (const o of d.outgoing) o[1].incoming.push(o);
            
        return root;
    }
        
    function id(node) {
        return `${node.parent ? id(node.parent) + "." : ""}${node.data.name}`;
    }

    // Function to generate a color for each type of food
    function generateTextColor(type) {
        let typeColorMap = new Map();
        typeColorMap.set('meat', '#3352FF');
        typeColorMap.set('dairy', '#DD33FF');
        typeColorMap.set('fruit', '#ACFF33');
        typeColorMap.set('vegetable', '#106F1C');
        typeColorMap.set('legumes', '#00FF00');
        typeColorMap.set('grain', '#EAD11A');
        typeColorMap.set('sause', '#A52A2A');
        typeColorMap.set('other', '#935116');
        typeColorMap.set('ITEM', '#000000');
        typeColorMap.set('TYPE', '#616A6B');

        return typeColorMap.get(type);
    }

     // Function to generate a color for each quadrant
     function generateQuadrantColor(quadrant) {
        let typeColorMap = new Map();
        typeColorMap.set('first', '#FF00A6');
        typeColorMap.set('second', '#007EFF');
        typeColorMap.set('third', '#30FF00');
        typeColorMap.set('fourth', '#FF9A00');
        return typeColorMap.get(quadrant);
    }

    // display information when mouse hover the name
    function getInfo(d)
    {   // can change base on different value
        if(d.data["group"] == "ITEM" || d.data["group"] == "TYPE")
        {
            return "";
        }
        return `${d.data["group"]}
        calories: ${d.data["calories"]}
        fat(g): ${d.data["fat"]}
        carbohydrates(g): ${d.data["carbohydrates"]}
        sodium(mg): ${d.data["sodium"]}
        portein(g): ${d.data["portein"]}`;
    }
    function caloriesFix(cal)
    {
        if(parseFloat(cal) > 200)
        {
            cal = 200;
        }
        return cal;
    }
    function updatePlot()
    { 
        var x = d3.scaleLinear()
        .domain([0, d3.max(plotDataSet, function(d) { return d[xLabel]; })])
      //  .ticks(2)
        .range([0, bar_width]);
    var y = d3.scaleLinear()
        .domain([0, d3.max(plotDataSet, function(d) { return d[yLabel]; })])
        .range([bar_width, 0]);

    tickNumber = 2;
        svg.select(".x-axis")
        .call(d3.axisBottom(x).ticks(tickNumber));

    // Add X axis label
    svg.select(".x-label")
        .text(toUpper(nutritions[xLabel]));
    
    // Add Y axis
    svg.select(".y-axis")
        .call(d3.axisLeft(y).ticks(tickNumber));

    // Add Y axis label;
    svg.select(".y-label")
        .text(toUpper(nutritions[yLabel]));
   
    // Add dots for scatter plots
    svg.selectAll("dot")
        .data(root.children) // Only displays dot for ingredients
        .enter()
        .append("circle")
        .attr("transform", "translate("+ margin.left +"," + margin.top + ")")
        .attr("cx", function (d) { return x(d.data[nutritions[xLabel]]);}) // x-axis value
        .attr("cy", function (d) { return y(caloriesFix(d.data[nutritions[yLabel]])); }) // y -axis value
        .attr("r", dotSize)
        .style("fill", colornone)
        .each(function(d){d.dot = this;}) 
    }
    function toUpper(data)
    {
        var upper = data.toUpperCase();
        return upper;
    }
});

