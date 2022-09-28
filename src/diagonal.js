import d3Extention, { d3 } from "./d3-extention";
import { nest } from 'd3-collection';
import { category, categoryField, data, ID, mar, size } from "./params";


export default class diagonal extends d3Extention {
    constructor(tmp, filedName, scaleX) {
        super()
        const self = this;
        // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(function (d) { return +d[filedName]; })   // I need to give the vector of value
            .domain(scaleX.domain())  // then the domain of the graphic
            .thresholds(scaleX.ticks(15)); // then the numbers of bins

        // group data by cat
        var groupDataBycat = nest()
            .key(function (d) { return d[categoryField]; })
            .entries(data);

        // calculate max data for y
        const max = groupDataBycat.reduce((max, current) => {
            const nowHistogram = histogram(current.values);
            const nowMax = d3.max(nowHistogram, function (d) { return d.length; })
            return (max > nowMax) ? max : nowMax
        }, 0)

        // Add y axis
        var scaleY = d3.scaleLinear()
            .range([size - 2 * mar + 3, 0])
            .domain([0, max]);

        category.map(cat => {
            const catData = data.filter(d => d[categoryField] == cat)
            const bins = histogram(catData);

            // Add the line
            tmp.append("path")
                .datum(bins)
                .attr("fill", function (d) {
                    return self.color(cat);
                })
                .attr("stroke", function (d) {
                    return "black"
                })
                .attr("stroke-width", 1)
                .attr("class", `area-${cat}`)
                .attr("d", d3.area()
                    .curve(d3.curveBasis)
                    .x(function (d, i) { return scaleX(d.x0); })
                    .y0(function (d) { return scaleY(0); })
                    .y1(function (d) { return scaleY(d.length); })
                )
                .tooltipValue(['x', 'y'], [scaleX, scaleY])
                .on("click", function (event, d) {
                    // all circle gray
                    d3.select(ID).selectAll(`circle`).attr('fill', 'silver');
                    d3.select(ID).selectAll(`path`).attr('opacity', .5);
                    const areaClass = d3.select(this).attr('class');
                    d3.select(ID).selectAll(`.${areaClass}`).attr('opacity', 1).moveToFront();

                    d.filter(circles => circles.length > 0)
                        .map(circles => {
                            circles.map(circle => {
                                d3
                                    .select(ID)
                                    .selectAll(`.circle-${circle.id}`)
                                    .attr("fill", function (d) { return self.color(d[categoryField]) })

                            })
                        })
                    event.stopPropagation();
                })
        })
    }
}