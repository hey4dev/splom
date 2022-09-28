
import { categoryField, data, ID } from "./params.js";
import d3Extention, { d3 } from "./d3-extention";

export default class circle extends d3Extention {
    constructor(tmp, keyX, keyY, scaleX, scaleY) {
        super()
        const self = this;
        // Add circle
        tmp
            .selectAll("myCircles")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", function (d) { return `circle-${d['id']}` })
            .attr("cx", function (d) { return scaleX(+d[keyX]) })
            .attr("cy", function (d) { return scaleY(+d[keyY]) })
            .attr("x", function (d) { return +d[keyX] })
            .attr("y", function (d) { return +d[keyY] })
            .attr("r", 4)
            .attr("fill", function (d) { return self.color(d[categoryField]) })
            .on('click', function (d) {
                d3.select(ID).selectAll('circle').attr('fill', 'silver');
                const circleClass = d3.select(this).attr('class');
                d3.select(ID).selectAll(`.${circleClass}`)
                    .attr("fill", function (d) { return self.color(d[categoryField]) })
                    .moveToFront();
            })
            .tooltipAttr(['x', 'y'])
    }
}