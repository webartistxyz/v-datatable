import "./style.css";
import VDataTable from "./components/VDataTable.vue";

export default {
    install:(app, options) => {
        app.component("VDataTable", VDataTable);
    },
};

export {VDataTable};

