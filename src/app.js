import VueBootstrapTable from './VueBootstrapTable.vue';

var renderfu = function (colname, entry) {
    return '<div class="btn-group" role="group" >'+
        '  <button type="button" class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>'+
        '  <button type="button" class="btn btn-sm btn-danger"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>'+
        '</div><span>'+JSON.stringify(entry)+'</span>';
};

var handleRow = function (event, entry) {
    console.log("CLICK ROW: " + JSON.stringify(entry));
};

new Vue({
    el: '#app',
    components: {
        VueBootstrapTable,
    },
    data: {
        logging: [],
        showFilter: true,
        showPicker: true,
        paginated: true,
        multiColumnSortable: true,
        handleRowFunction: handleRow,
        ajax: {
            enabled: true,
            url: "http://172.16.213.1:9430/data/test",
            method: "POST",
            delegate: true,
            axiosConfig:{
                headers: {
                    'Authorization': 'Bearer TESTTESTTESTTESTTEST'
                }
            }
        },
        columns: [
            {
              title: 'Id',
              name: 'id'
            },
            {
              title: 'Name',
              name: 'name'
            },
            {
              title: 'Description',
              name: 'description'
            },
            {
              title: 'Street Address',
              name: 'street_address'
            },
            {
              title: 'City',
              name: 'city'
            },
            {
              title: 'State',
              name: 'state_province'
            },
            {
              title: 'Postal Code',
              name: 'postal_code'
            }
          ],
        values: []
    },
    created: function () {
        var self = this;
        this.$on('cellDataModifiedEvent',
            function( originalValue, newValue, columnTitle, entry) {
                self.logging.push("cellDataModifiedEvent - Original Value : " + originalValue +
                                         " | New Value : " + newValue +
                                         " | Column : " + columnTitle +
                                         " | Complete Entry : " +  entry );
            }
        );
        this.$on('ajaxLoadedEvent',
            function( data ) {
                this.logging.push("ajaxLoadedEvent - data : " + data );
            }
        );
        this.$on('ajaxLoadingError',
            function( error ) {
                this.logging.push("ajaxLoadingError - error : " + error );
            }
        );
    },
    methods: {
        addItem: function () {
            var self = this;
            var item = {
                "id": this.values.length + 1,
                "name": "name " + (this.values.length + 1)
            };
            this.values.push(item);
        },
        toggleFilter: function () {
            this.showFilter = !this.showFilter;
        },
        togglePicker: function () {
            this.showPicker = !this.showPicker;
        },
        togglePagination: function () {
            this.paginated = !this.paginated;
        }
    },
});