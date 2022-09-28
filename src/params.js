import { nest } from "d3-collection";

export var ID;
export var data = []
export var marginWhole = {}
export var sizeDiv;
export var sizeWhole;
export var fileds = [];
export var labels = [];
export var numFileds;
export var category = []
export var categoryField;
export var categoryColor = []
export var mar;
export var size;
export var width;
export var height;

export default class params {
    constructor(id, dataImport = [], options) {
        ID = id;
        data = dataImport;
        marginWhole.top = options.margin_top ?? 50;
        marginWhole.right = options.margin_right ?? 50;
        marginWhole.left = options.margin_left ?? 50;
        marginWhole.bottom = options.margin_bottom ?? 50;
        sizeDiv = options.sizeDiv ?? 1000;
        fileds = options.fileds ?? [];
        labels = options.labels ?? [];
        categoryColor = options.categoryColor ?? [];
        mar = options.mar ?? 20;
        categoryField = options.categoryField ?? undefined;
        category = categoryField ? nest()
            .key(function (d) { return d[categoryField]; })
            .entries(data)
            .map(d => d.key) : [];
        numFileds = fileds.length
        sizeWhole = sizeDiv - marginWhole.left - marginWhole.right
        size = sizeWhole / numFileds
        width = (size - 2 * mar)
        height = width
    }
}