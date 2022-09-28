import * as d3 from "d3";
import { category, categoryColor, fileds, ID, size, sizeWhole } from "./params";

export { d3 }

export default class d3Extention {
    constructor() {
        const self = this;
        this.tooltip = d3.select(ID)
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background", "#000")
            .style("border-radius", "5px")
            .style("padding", "2px 5px")
            .style("color", "white")
            .style("line-height", .5)
            .text("a simple tooltip");


        // add function to d3 for move object to front view
        d3.selection.prototype.moveToFront = function () {
            return this.each(function () {
                this.parentNode.appendChild(this);
            });
        };

        d3.selection.prototype.tooltipAttr = function (attrName = []) {
            return this
                .on("mouseover", function (d) {
                    return self.showTooltipAttr(this, attrName)
                })
                .on("mousemove", function (event) {
                    return self.tooltip.style("top", (event.pageY - 10) + "px")
                        .style("left", (event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                    return self.tooltip.style("visibility", "hidden");
                });
        };

        d3.selection.prototype.tooltipValue = function (names = [], fun = []) {
            return this
                .on("mouseover", function (event) {
                    return self.showTooltipValue(event, names, fun)
                })
                .on("mousemove", function (event) {
                    self.showTooltipValue(event, names, fun)
                    return self.tooltip.style("top", (event.pageY - 10) + "px")
                        .style("left", (event.pageX + 10) + "px");
                })
                .on("mouseout", function () {
                    return self.tooltip.style("visibility", "hidden");
                });
        };
    }

    showTooltipAttr(object, attrName = []) {
        if (attrName.length == 0) return;
        var d3Object = d3.select(object);
        var data = '';

        attrName.map(name => {
            var attrValue = +d3Object.attr(name)
            data += `<p>${name}: ${attrValue.toFixed(2)}</p>`
        })
        this.tooltip.html(data)
        return this.tooltip.style("visibility", "visible");
    }

    showTooltipValue(event, names, fun) {
        if (names.length == 0 || fun.length == 0) return;
        var coordinates = d3.pointer(event);
        const [
            positionX,
            positionY
        ] = coordinates;

        var data = '';

        fun.map((f, i) => {
            // console.log(names[i], event.pageX, event.pageY);
            var value = +f.invert(names[i] == 'x' ? positionX : positionY)
            data += `<p>${names[i]}: ${Math.round(value)}</p>`
        })
        this.tooltip.html(data)
        return this.tooltip.style("visibility", "visible");
    }

    // Create a scale: gives the position of each pair each variable
    position = d3.scalePoint()
        .domain(fileds)
        .range([0, sizeWhole - size])

    // Color scale: give me a specie name, I return a color
    color = d3.scaleOrdinal()
        .domain(category)
        .range(categoryColor)
}