import * as d3 from 'd3'
import '../styles.css'
import dataset from './data.json'
import colors from '../colors.json'
const { data } = dataset

const margin = {top: 20, right: 20, bottom: 30, left: 40}
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom

// set the ranges
const x0 = d3.scaleBand().range([0, width]).padding(.25);
const x1 = d3.scaleBand().padding(0);
const y = d3.scaleLinear().range([height, 0]);
      
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
const svg = d3.select("main").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");

// Scale the range of the data in the domains

x0.domain(data.map(d => d.name));
x1.domain(data[0].vote.map(d => d.axis)).rangeRound([0, x0.bandwidth()]);
y.domain([0, 5]);
// y.domain([0, d3.max(data, (d) => d.vote[0].value)]);

// append the rectangles for the bar chart
svg.append("g")
  .selectAll("g")
  .data(data)
  .enter().append("g")
    .attr("transform", (d) => `translate( ${x0(d.name)} ,0)`)
  .selectAll("rect")
  .data(d => d.vote.map(d => {return {key: d.axis, value: d.value }}))
  .enter().append('rect')
    .attr("x", d => x1(d.key))
    .attr("y", d => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => height - y(d.value))
    .attr("class", d => d.key.toLowerCase())


// add the x Axis
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x0))

// add the y Axis
svg.append("g")
  .call(d3.axisLeft(y));