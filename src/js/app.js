import * as d3 from 'd3'
import '../styles.css'
import dataset from './data.json'
import colors from '../colors.json'
const { data } = dataset

const margin = {top: 20, right: 20, bottom: 30, left: 40}
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom
const x0 = d3.scaleBand().range([0, width]).padding(.25);
const x1 = d3.scaleBand().padding(0);
const y = d3.scaleLinear().range([height, 0]);

const legend = d3.select('main').append("svg")
.append("g")
.attr("text-anchor", "start")
.selectAll("g")
.data(data[0].vote.map(d => d.axis))
.enter().append("g")
.attr("transform", (d, i) => `translate(0, ${i * 20})`)
.on('mouseenter', d => data[0].vote.filter(
  t => t.axis !== d ? 
  d3.selectAll(`.${t.axis.toLowerCase()}`).attr('opacity', '.25') :
  d3.selectAll(`.${t.axis.toLowerCase()}`).attr('opacity', '1') 
))
.on('mouseleave', d =>data[0].vote.map(d => d3.selectAll(`.${d.axis.toLowerCase()}`).attr('opacity', '1')))


legend.append("rect")
.attr("x", 0)
.attr("width", 19)
.attr("height", 19)
.attr("class", d => d.toLowerCase());

legend.append("text")
.attr("x",  24)
.attr("y", 9.5)
.attr("dy", "0.32em")
.text(d => d);


const svg = d3.select("main").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
const g = svg.append("g").attr("transform", 
      "translate(" + margin.left + "," + margin.top + ")");

x0.domain(data.map(d => d.name));
x1.domain(data[0].vote.map(d => d.axis)).rangeRound([0, x0.bandwidth()]);
y.domain([0, 5]);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x0))

svg.append("g")
  .call(d3.axisLeft(y).ticks(5));

svg.append("g")
  .selectAll("g")
  .data(data)
  .enter().append("g")
    .attr("transform", (d) => `translate( ${x0(d.name)} ,0)`)
  .selectAll("rect")
  .data(d => d.vote.map(d => {return {key: d.axis, value: d.value }}))
  .enter().append('rect')
    .attr("width", x1.bandwidth())
    .attr("x", d => x1(d.key))
    .attr("y", height)
    .attr("height", 0)
    .attr("class", 'bar')
    .attr("class", d => d.key.toLowerCase())
    .transition()
    .ease(d3.easeSinOut)
    // .delay((d, i) => i * 200 )
    .duration(350)
    .attr("y", d => y(d.value))
    .attr("height", d => height - y(d.value))


