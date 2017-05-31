Vue.config.debug = true;
Vue.config.devtools = true;

new Vue({
    el: '#app',
    components: {
        VueBootstrapTable: VueBootstrapTable
    },
    data: {
        logging: [],
        showFilter: true,
        showPicker: true,
        paginated: true,
        columns: [
            {
                title:"id",
                visible: true,
                editable: false,
            },
            {
                title:"name",
                visible: true,
                editable: true,
            },
            {
                title:"age",
                visible: true,
                editable: true,
            },
            {
                title:"country",
                visible: true,
                editable: true,
            }
        ],
        values: [
            {
                "id": 1,
                "name": "John",
                "country": "UK",
                "age": 25,
            },
            {
                "id": 2,
                "name": "Mary",
                "country": "France",
                "age": 30,
            },
            {
                "id": 3,
                "name": "Ana",
                "country": "Portugal",
                "age": 20,
            }
        ]
    },
    ready: function () {
    },
    methods: {
        addItem: function() {
            var self = this;
            var item = {
                "id" : this.values.length + 1,
                "name": "name " + (this.values.length+1),
                "country": "Portugal",
                "age": 26,
            };
            this.values.push(item);
        },
        toggleFilter: function() {
            this.showFilter = !this.showFilter;
        },
        togglePicker: function() {
            this.showPicker = !this.showPicker;
        },
        togglePagination: function () {
            this.paginated = !this.paginated;
        }
    },
    events: {
        cellDataModifiedEvent: function( originalValue, newValue, columnTitle, entry) {
            this.logging.push("Original Value : " + originalValue +
                         " | New Value : " + newValue +
                         " | Column : " + columnTitle +
                         " | Complete Entry : " +  entry );
        },
    },
});