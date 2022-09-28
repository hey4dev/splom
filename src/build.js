import { formatCount } from "./calculate.js";
import circle from "./circles.js";
import correlation from "./correlation.js";
import d3Extention, { d3 } from "./d3-extention.js";
import diagonal from "./diagonal.js";
import { categoryField, data, fileds, height, ID, labels, mar, marginWhole, size, sizeWhole, width } from "./params.js";

export default class build extends d3Extention {
    constructor() {
        super()
        this.svg = d3.select(ID)
            .append("svg")
            .attr("width", sizeWhole + marginWhole.left + marginWhole.right)
            .attr("height", sizeWhole + marginWhole.top + marginWhole.bottom)
            .style("margin", "auto")
            .style("display", "block")
            .append("g")
            .attr("transform", "translate(" + marginWhole.left + "," + marginWhole.top + ")");

        this.addTemplate();
    }

    addTemplate() {
        fileds.map((dataX, keyX) => {
            fileds.map((dataY, keyY) => {
                // Add X Scale of each graph
                const xextent = d3.extent(data, function (d) { return +d[dataX] })
                this.scaleX = d3.scaleLinear()
                    .domain(xextent).nice()
                    .range([0, size - 2 * mar]);

                // Add Y Scale of each graph
                const yextent = d3.extent(data, function (d) { return +d[dataY] })
                this.scaleY = d3.scaleLinear()
                    .domain(yextent).nice()
                    .range([size - 2 * mar, 0]);

                // Add a 'g' at the right position
                const tmp = this.svg
                    .append('g')
                    .attr("class", "bg")
                    .attr("transform", "translate(" + (this.position(dataX) + mar) + "," + (this.position(dataY) + mar) + ")");

                this.addBackgroundGrid(tmp, width, height)

                // Add X and Y axis in tmp formatCount(+d[dataY], true)
                tmp.append("g")
                    .attr("class", "xAxis")
                    .attr("transform", "translate(" + 0 + "," + (size - mar * 2) + ")")
                    .call(d3.axisBottom(this.scaleX).ticks(3).tickFormat(d => (formatCount(d, true))))
                    .call(g => g.select(".domain").remove());

                if (keyY != 5) {
                    tmp.selectAll("g.xAxis .tick")
                        .call(g => {
                            g.select("text").remove()
                            g.select("line").remove()
                        })
                } else {
                    tmp.append('text')
                        .text(labels[keyX] ?? dataX)
                        .attr("transform", "translate(" + 5 + "," + (size) + ")")
                }

                tmp.append("g")
                    .attr("class", "yAxis")
                    .call(d3.axisLeft(this.scaleY).ticks(3).tickFormat(d => (formatCount(d, true))))
                    .call(g => g.select(".domain").remove());

                if (keyX != 0) {
                    tmp.selectAll("g.yAxis .tick")
                        .call(g => {
                            g.select("text").remove()
                            g.select("line").remove()
                        });
                } else {
                    tmp.append('text')
                        .text(dataY)                        
                        .text(labels[keyY] ?? dataY)
                        .attr("transform", `translate(-50, ${size - 60}) rotate(-90)`)
                }

                this.addGrid(tmp, width, height)

                // add data to the bottom of triangle
                if (dataY != dataX && keyY > keyX) 
                    new circle(tmp, dataX, dataY, this.scaleX, this.scaleY)

                // add diagonal data
                if (keyX == keyY)
                    new diagonal(tmp, dataX, this.scaleX)

                // add data to the top of triangle
                if (dataY != dataX && keyY < keyX) 
                    new correlation(tmp, dataX, dataY)

            })
        })
    }


    addBackgroundGrid(tmp, width, height) {
        const self = this;
        tmp.append('rect')
            .attr('fill', '#e5e5e5')
            .attr("x", -2)
            .attr("y", -5)
            .attr("width", width + 7)
            .attr("height", height + 10)
            .on('click', function () {
                d3.select(ID).selectAll('path').attr('opacity', 1);
                data.map(d => {
                    d3.select(ID).selectAll(`.circle-${d.id}`).attr('fill', self.color(+d[categoryField]));
                })
            })
    }

    addGrid(tmp, width, height) {
        tmp.selectAll("g.yAxis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0);

        tmp.selectAll("g.xAxis g.tick")
            .append("line")
            .attr("class", "gridline")
            .attr("x1", 0)
            .attr("y1", -height)
            .attr("x2", 0)
            .attr("y2", 0);
    }
}