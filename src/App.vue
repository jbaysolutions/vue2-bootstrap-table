<template>
  <div id="app" class="container-fluid">
      <div class="row">
          <div class="col-sm-12">
              <button @click="addItem" class="btn btn-primary"><i class="glyphicon glyphicon-plus-sign"></i> Add an item</button>
              <button @click="toggleFilter" class="btn btn-outline-primary">Toggle Filter</button>
              <button @click="togglePicker" class="btn btn-outline-primary">Toggle Column Picker</button>
              <button @click="toggleSelect" class="btn btn-outline-primary">Toggle Select column</button>
              <button @click="togglePagination" class="btn btn-outline-primary">Toggle Pagination</button>
              <button @click="refreshTable" class="btn btn-outline-primary">Refresh</button>
              <button @click="setNewPageSize" class="btn btn-outline-primary">Page Size = 1 </button>
          </div>
          <br/><br/>
          <vue-bootstrap-table
                  ref="exampleTable"
                  :columns="columns"
                  :values="values"
                  :show-filter="showFilter"
                  :show-column-picker="showPicker"
                  :paginated="paginated"
                  :multi-column-sortable="multiColumnSortable"
                  :ajax="ajax"
                  :row-click-handler=handleRowFunction
                  :filter-case-sensitive=false
                  :selectable="showSelect"
          >
              <!--<template v-slot:name="slotProps">
                  <b>NAME:</b> {{slotProps.value.name}}
              </template>
              <template v-slot:description="slotProps">
                  <b>DESC:</b> {{slotProps.value.description}}
              </template>-->
          </vue-bootstrap-table>
          <vue-bootstrap-table
                  :columns="columns2"
                  :values="values2"
                  :show-filter="showFilter"
                  :show-column-picker="showPicker"
                  :paginated="paginated"
                  :filter-case-sensitive=false
                  :selectable="showSelect"
                  :row-click-handler=handleRowFunction2
          >
              <!--<template v-slot:name="slotProps">
                  <b>NAME:</b> {{slotProps.value.name}}
              </template>
              <template v-slot:description="slotProps">
                  <b>DESC:</b> {{slotProps.value.description}}
              </template>-->
          </vue-bootstrap-table>
      </div>
      <h2>Events Received</h2>
      <div>
          {{ logging }}
      </div>
  </div>
</template>

<script>

import VueBootstrapTable from "./components/VueBootstrapTable";

export default {
  name: 'app',
  components: {
    VueBootstrapTable
  },
    data: function () {
        return {
            logging: [],
            showFilter: true,
            showPicker: true,
            showSelect: true,
            paginated: true,
            multiColumnSortable: true,
            handleRowFunction: function (event, entry) {
                // eslint-disable-next-line no-console
                console.log("CLICK ROW: " + JSON.stringify(entry));
            },
            handleRowFunction2: function (event, entry) {
                // eslint-disable-next-line no-console
                console.log("CLICK ROW 2: " + JSON.stringify(entry));
            },
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
            ],
            columns2: [
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
            values2: [
                {
                    "id": "222",
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
                    "id": "333",
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
        }
    },
    created: function () {
        const self = this;
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
            const item = {
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
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  /*color: #2c3e50;*/
  margin-top: 60px;
}
</style>
