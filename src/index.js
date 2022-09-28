import params from "./params";
import structure from "./build";
import './style.css';

class buildSplom {
    constructor(id, config) {
        const data = this.appendIdToData(config.data)
        const idSelect = document.getElementById(id);
        new params(idSelect, data, config.options);
        new structure();
    }

    // Add an ID to each piece of data
    appendIdToData(data) {
        return data.map((d, i) => {
            d.id = i + 1;
            return d
        })
    }
}

export { buildSplom }