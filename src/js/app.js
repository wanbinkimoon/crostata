import * as d3 from 'd3'
import '../styles.css'
import dataset from './data.json'

console.log(dataset)
const { data } = dataset

var margin = {top: 20, right: 20, bottom: 30, left: 40},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand().range([0, width]).padding(.5);
var y = d3.scaleLinear().range([height, 0]);
      
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");

// Scale the range of the data in the domains
x.domain(data.map((d) => d.name));
y.domain([0, 5]);
// y.domain([0, d3.max(data, (d) => d.vote[0].value)]);

// append the rectangles for the bar chart
svg.selectAll(".bar")
  .data(dataset.data)
.enter().append("rect")
  .attr("class", "bar")
  .attr("x", (d) => x(d.name))
  .attr("width", x.bandwidth())
  .attr("y", (d) => y(d.vote[0].value))
  .attr("height", (d) => height - y(d.vote[0].value));

// add the x Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))

// add the y Axis
svg.append("g")
  .call(d3.axisLeft(y));