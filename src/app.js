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
        showSelect: true,
        paginated: true,
        multiColumnSortable: true,
        handleRowFunction: handleRow,
        columnToSortBy:"name",
        ajax: {
            enabled: false,
            url: "http://172.16.213.1:9430/data/test",
            method: "POST",
            delegate: true
        },
        columns: [
            {
              title: 'Id',
              name: 'id'
            },
            {
              title: 'Name',
              name: 'name' ,
              filterable: false,
              editable: true,
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
        values: [
            {
              "id": "111",
              "name": "Casper Cliff",
              "description": "Id est rem aliquam animi libero minima. Praesentium ad cum autem quo voluptatum autem ea. Non rerum aliquam atque minima et. Omnis maiores debitis odio consequatur officiis.",
              "created_by": 3,
              "street_address": "90947 Schaefer Ramp",
              "city": "Lake Jammiemouth",
              "state_province": "Alaska",
              "postal_code": "35070",
              "status": "open"
            },
            {
              "id": "0D7D9DB64C7946E0B3FBDDFC",
              "name": "Alfredo Shore",
              "description": "Beatae deserunt aut voluptas modi repudiandae sit animi. Minima sit quam eligendi non aliquid et excepturi. Fugit reiciendis illo illum eum quidem minus.",
              "created_by": 4,
              "street_address": "1943 Ericka Shoal Suite 196",
              "city": "Johnathanshire",
              "state_province": "Georgia",
              "postal_code": "87106",
              "status": "open"
            }
          ]
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
        refreshTable: function(){
            this.$refs.exampleTable.refresh();
        },
        setNewPageSize:function(){
            this.$refs.exampleTable.setPageSize(1);
        },
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
        toggleSelect: function () {
            this.showSelect = !this.showSelect;
        },
        togglePagination: function () {
            this.paginated = !this.paginated;
        }
    },
});
