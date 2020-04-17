
/*
@reference: https://observablehq.com/@d3/hierarchical-edge-bundling
*/
const contents = d3.select(".contents");
var margin = {left: -300, right: 50, top:20, bottom:0};
var colorin = "#00f"
var colorout = "#f00"
var colornone = "#ccc"
var height = 900
var width = 900
var mid_width = width / 2;
var mid_height = height /2.4;
var radius = width / 2
var bar_width = 600


line = d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius(d => d.y)
    .angle(d => d.x)
tree = d3.cluster()
    .size([2 * Math.PI, radius - 100])
  

// Read data from json file
d3.json("data/data.json").then(function(da) { // this cover all code below
  //return dat;
//});

    data = hierarchy(da)
    
    // Setting up data for each node
    const root = tree(bilink(d3.hierarchy(data)
        .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));


    const svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      //.attr("transform","translate("+margin.left+","+margin.top+")")
      .attr("viewBox", [-width / 2, -width / 2 , width, width]);

// Add X axis
  var x = d3.scaleLinear()
  .domain([-100, 100])
  .range([ 0, bar_width]);

   svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate("+ margin.left +"," + margin.top + ")")
  .call(d3.axisBottom(x));
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-100, 100])
    .range([bar_width, 0]);

  svg.append("g")
  .attr("class", "axis")
    .attr("transform", "translate("+ (margin.left + bar_width/ 2) +"," + (margin.top - bar_width/ 2) + ")")
    .call(d3.axisLeft(y));

    var dd = []
    d3.csv("data/temp.csv", function(data2)
    {  
      dd.push(data2);
    })
        console.log(dd)

        // Add dots  DO NOT WORK AT THE MOMENT
        svg.append('g')
      .attr("transform", "translate("+ margin.left +"," + margin.top + ")")
      .selectAll("dot")
      .data(dd)
      .enter()
      .append("circle")
        .attr("cx", function (d2) { console.log(d2.c); return x(d2.c);})
        .attr("cy", function (d2) { return y(d2.f); })
        .attr("r", 1.5)
        .style("fill", "#69b3a2")
       
    // Node
    const node = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
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
        .attr("fill", function(d){ return generateTextColor(d.data.group) }) // Text Color
        .each(function(d) { d.text = this; })
        .on("mouseover", overed)
        .on("mouseout", outed)
        .call(text => text.append("title")
            .text(d => `${id(d)}
                ${d.outgoing.length} outgoing
                ${d.incoming.length} incoming`
                ));

    // Link that connects nodes with each other
    const link = svg.append("g")
        .attr("stroke", colornone)
        .attr("fill", "none")
        .selectAll("path")
        .data(root.leaves().flatMap(leaf => leaf.outgoing))
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", ([i, o]) => line(i.path(o)))
        .each(function(d) { d.path = this; });

        
    function overed(d) {
        link.style("mix-blend-mode", null);
        d3.select(this).attr("font-weight", "bold");
        d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", colorin).raise();
        d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", colorin).attr("font-weight", "bold");
        d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", colorout).raise();
        d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", colorout).attr("font-weight", "bold");
    }
        
    function outed(d) {
        link.style("mix-blend-mode", "multiply");
        d3.select(this).attr("font-weight", null);
        d3.selectAll(d.incoming.map(d => d.path)).attr("stroke", null);
        d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", function(d){ return generateTextColor(d.data.group) }).attr("font-weight", null);
        d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
        d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", function(d){ return generateTextColor(d.data.group) }).attr("font-weight", null);
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
        typeColorMap.set('legumes', '#C1FF00');
        typeColorMap.set('grain', '#EAD11A');
        typeColorMap.set('sause', '#A52A2A');
        typeColorMap.set('ITEM', '#2A2E20');
        typeColorMap.set('TYPE', '#000000');

        return typeColorMap.get(type);
    }

    
});

