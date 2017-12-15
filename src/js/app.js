import * as d3 from 'd3'
import '../styles.css'
import dataset from './data.json'
// import colors from '../colors.json'
import chroma from 'chroma-js'
const { data } = dataset

console.log(data)

const coreTeam = data.filter(d => d.core === true)
const colors = chroma.scale([chroma.random(), chroma.random()]).colors(data.length)
const colorsCore = chroma.scale([chroma.random(), chroma.random()]).colors(coreTeam.length)
const colorsContrib = chroma.scale([chroma.random(), chroma.random()]).colors(data.length)

const margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
}
const width = 960 - margin.left - margin.right
const height = 500 - margin.top - margin.bottom
const x0 = d3.scaleBand().range([0, width]).padding(.25);
const x1 = d3.scaleBand().padding(0);
const y = d3.scaleLinear().range([height, 0]);

const legend = d3.select('main').append("svg")
  .attr("height",'640')
  .append("g")
  .attr("text-anchor", "start")
  .selectAll("g")
  .data(data.map(d => d.name))
  .enter().append("g")
  .attr("transform", (d, i) => `translate(0, ${i * 20})`)
  .on('mouseenter', d => data[0].vote.filter(
    t => t.axis !== d ?
    d3.selectAll(`.${t.axis.toLowerCase()}`).attr('opacity', '.25') :
    d3.selectAll(`.${t.axis.toLowerCase()}`).attr('opacity', '1')
  ))
  .on('mouseleave', d => data[0].vote.map(d => d3.selectAll(`.${d.axis.toLowerCase()}`).attr('opacity', '1')))


legend.append("rect")
  .attr("x", 0)
  .attr("width", 19)
  .attr("height", 19)
  .attr("fill", (d, i) => colorsCore[i]);

legend.append("text")
  .attr("x", 24)
  .attr("y", 9.5)
  .attr("dy", "0.32em")
  .text(d => d);

var RadarChart = {
  draw: function (id, d, options) {
    var cfg = {
      radius: 5,
      w: 600,
      h: 600,
      factor: 1,
      factorLegend: .85,
      levels: 1,
      maxValue: 0,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 5,
      TranslateX: 80,
      TranslateY: 30,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color: 'pink'
    };

    if ('undefined' !== typeof options) {
      for (var i in options) {
        if ('undefined' !== typeof options[i]) {
          cfg[i] = options[i];
        }
      }
    }
    cfg.maxValue = Math.max(cfg.maxValue, 5);
    const allAxis = data[0].vote.map(d => d.axis);
    const total = allAxis.length;
    const radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
    const Format = d3.format('%');
    const svg = d3.select('main').append("svg");

    const g = svg.attr("width", cfg.w + cfg.ExtraWidthX)
      .attr("height", cfg.h + cfg.ExtraWidthY)
      .append("g")
      .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");;

    let tooltip;

    //Circular segments
    for (var j = 0; j < cfg.levels - 1; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data(allAxis)
        .enter()
        .append("svg:line")
        .attr("x1", (d, i) => levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total)))
        .attr("y1", (d, i) => levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total)))
        .attr("x2", (d, i) => levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total)))
        .attr("y2", (d, i) => levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total)))
        .attr("class", "line")
        .style("stroke", "tomato")
        .style("stroke-opacity", "0.75")
        .style("stroke-width", "0.3px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor) + ", " + (cfg.h / 2 - levelFactor) + ")");
    }

    cfg.levels.map((d,i) => {
      const levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels.length);

      g.selectAll(".levels")
        .data([i])
        .enter()
        .append("svg:text")
        .attr("x", () => levelFactor * (1 - cfg.factor * Math.sin(0)))
        .attr("y", () => levelFactor * (1 - cfg.factor * Math.cos(0)))
        .attr("class", "legend")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
        .attr("fill", "grey")
        .text((d, i) => i);
    })

    let series = 0;

    var axis = g.selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w / 2)
      .attr("y1", cfg.h / 2)
      .attr("x2", (d, i) => cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total)))
      .attr("y2", (d, i) => cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total)))
      .attr("class", "line")
      .style("stroke", "gray")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(d => d)
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", "translate(0, -10)")
      .attr("x", (d, i) => cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total))
      .attr("y", (d, i) => cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total));


    data.forEach((y, x) => {
      let dataValues = [];
      g.selectAll(".nodes")
        .data(y.vote, (d, i) => {
          return dataValues.push({
            name: y.name,
            positions: [
              cfg.w / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
              cfg.h / 2 * (1 - (parseFloat(Math.max(d.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
          ]}); 
        });
      
      dataValues.push(dataValues[0]);

      
      const fillColor = chroma(colors[series]).alpha(.1).css()
      const strokeColor = chroma(colors[series]).alpha(1).css()

      g.selectAll(".area")
        .data([dataValues])
        .enter()
        .append("path")
        .attr("class", "radar-chart-serie" + series)
        .style("stroke-width", "1px")
        .style("stroke", `${strokeColor}`)
        .attr("d", (d, i) => ` M ${d.map(t => `${t.positions[0]} ${t.positions[1]} C ` )}`)
        .style("fill", `${fillColor}`)
        .on('mouseover', (d) => {
          let z = "polygon." + d3.select(this).attr("class");
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", 0.1);
          g.selectAll(z)
            .transition(200)
            .style("fill-opacity", .7);
        })
        .on('mouseout', () => {
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", cfg.opacityArea);
        });
      series++;
    });
    series = 0;


    d.forEach(function (y, x) {
      g.selectAll(".nodes")
        .data(y).enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie" + series)
        .attr('r', cfg.radius)
        .attr("alt", function (j) {
          return Math.max(j.value, 0)
        })
        .attr("cx", function (j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total))
          ]);
          return cfg.w / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.sin(i * cfg.radians / total));
        })
        .attr("cy", function (j, i) {
          return cfg.h / 2 * (1 - (Math.max(j.value, 0) / cfg.maxValue) * cfg.factor * Math.cos(i * cfg.radians / total));
        })
        .attr("data-id", function (j) {
          return j.axis
        })
        .style("fill", 'crimson')
        .style("fill-opacity", .9)
        .on('mouseover', function (d) {
          newX = parseFloat(d3.select(this).attr('cx')) - 10;
          newY = parseFloat(d3.select(this).attr('cy')) - 5;

          tooltip
            .attr('x', newX)
            .attr('y', newY)
            .text(Format(d.value))
            .transition(200)
            .style('opacity', 1);

          z = "polygon." + d3.select(this).attr("class");
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", 0.1);
          g.selectAll(z)
            .transition(200)
            .style("fill-opacity", .7);
        })
        .on('mouseout', function () {
          tooltip
            .transition(200)
            .style('opacity', 0);
          g.selectAll("polygon")
            .transition(200)
            .style("fill-opacity", cfg.opacityArea);
        })
        .append("svg:title")
        .text(function (j) {
          return Math.max(j.value, 0)
        });

      series++;
    });
    //Tooltip
    tooltip = g.append('text')
      .style('opacity', 0)
      .style('font-family', 'sans-serif')
      .style('font-size', '13px');
  }
};

//Options for the Radar chart, other than default
const mycfg = {
  w: 600,
  h: 600,
  maxValue: 0.6,
  levels: [0,1,2,3,4,5],
  ExtraWidthX: 300
}

//Call function to draw the Radar chart
//Will expect that data is in %'s
RadarChart.draw("#chart", data, mycfg);