
/*
@reference: https://observablehq.com/@d3/hierarchical-edge-bundling
*/
const contents = d3.select(".contents");
//var margin = {left:0, right: 50, top:0, bottom:0, center: "50%"};

colorin = "#00f"
colorout = "#f00"
colornone = "#ccc"
height = 954
width = 954
radius = width / 2
line = d3.lineRadial()
    .curve(d3.curveBundle.beta(0.85))
    .radius(d => d.y)
    .angle(d => d.x)
tree = d3.cluster()
    .size([2 * Math.PI, radius - 100])
    

d3.json("data/data.json").then(function(da) { // this cover all code below
  //return dat;
//});
console.log(da)


data = hierarchy(da)
const root = tree(bilink(d3.hierarchy(data)
.sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));

var margin = {left:200, right: 50, top:0, bottom:0};

const svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("transform","translate("+margin.left+","+margin.top+")")
      .attr("viewBox", [-width / 2 - 200, -width / 2 - 100, width + 200, width + 200]);

  const node = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 20)
    .selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
    .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .each(function(d) { d.text = this; })
      .on("mouseover", overed)
      .on("mouseout", outed)
      .call(text => text.append("title").text(d => `${id(d)}
    ${d.outgoing.length} outgoing
    ${d.incoming.length} incoming`));

  const link = svg.append("g")
      .attr("stroke", colornone)
      .attr("fill", "none")
    .selectAll("path")
    .data(root.leaves().flatMap(leaf => leaf.outgoing))
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("d", ([i, o]) => line(i.path(o)))
      .each(function(d) { d.path = this; });
/*
      var width = 1000;// window.screen.width;
var height = 1000; //window.screen.width;
var mid_width = width / 2;
var mid_height = height /2.4;
var radius = 250;
  const template = svg.append("g").attr("transform","translate("+margin.left+","+margin.top+")");
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

*/

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
    d3.selectAll(d.incoming.map(([d]) => d.text)).attr("fill", null).attr("font-weight", null);
    d3.selectAll(d.outgoing.map(d => d.path)).attr("stroke", null);
    d3.selectAll(d.outgoing.map(([, d]) => d.text)).attr("fill", null).attr("font-weight", null);
  }



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
      } else {
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


});
