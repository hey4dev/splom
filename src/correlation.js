import { correlation as corr } from "./calculate.js";
import d3Extention from "./d3-extention";
import { category, categoryField, data } from "./params.js";

export default class correlation extends d3Extention {
    constructor(tmp, keyX, keyY) {
        super()
        const self = this;
        const xData = data.map(d => d[keyX])
        const yData = data.map(d => d[keyY])
        var totalCorr = corr.pearson(xData, yData);
        tmp
            .selectAll("myCircles")
            .data([totalCorr])
            .enter()
            .append("text")
            .style("font-weight", "bold")
            .attr('y', 20)
            .text(d => `Corr: ${d.toFixed(3)}`)

        category.map((cat, iCat) => {
            const dataCat = data.filter(d => d[categoryField] == cat)
            const xData = dataCat.map(d => d[keyX])
            const yData = dataCat.map(d => d[keyY])
            var catCorr = corr.pearson(xData, yData);
            tmp
                .selectAll("myCircles")
                .data([catCorr])
                .enter()
                .append("text")
                .style("font-weight", "bold")
                .attr('y', (iCat * 20) + 40)
                .text(d => `${cat}: ${d.toFixed(3)}`)
                .style('fill', self.color(cat))
        })
    }
}