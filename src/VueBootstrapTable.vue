<template>
    <div id="maindiv" @click="closeDropdown" @keyup.esc="closeDropdown">
        <!--<pre>{{columns}}</pre>-->
        <!--<pre>{{$data}}</pre>-->
        <div class="col-sm-6">
            <div v-if="showFilter" style="padding-top: 10px;padding-bottom: 10px;">
                <div class="input-group">
                    <input type="text" class="form-control" placeholder="Filter" v-model="filterKey">
                    <div class="input-group-addon">
                        <i class="glyphicon glyphicon-search"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-sm-6">
            <div v-if="showColumnPicker" style="padding-top: 10px;padding-bottom: 10px;float:right;">
                <div class="btn-group" :class="{'open' : columnMenuOpen}">
                    <button @click.stop.prevent="columnMenuOpen = !columnMenuOpen" @keyup.esc="columnMenuOpen = false"
                            type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"
                            aria-haspopup="true">
                        Columns <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu">
                        <li v-for="column in displayCols">
                            <a href="#" @click.stop.prevent="toggleColumn(column)">
                                <i v-if="column.visible" class="glyphicon glyphicon-ok"></i> {{column.title}}
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="col-sm-12">
            <div id="loadingdiv" :class="{'vue-table-loading': this.loading , 'vue-table-loading-hidden': !this.loading}">
                <div class="spinner"></div>
            </div>
            <table class="table table-bordered table-hover table-condensed table-striped vue-table">
                <thead>
                    <tr>
                        <th v-for="column in displayColsVisible" @click="sortBy($event, column.name)"
                            track-by="column"
                            :class="getClasses(column)">
                            {{ column.title }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="entry in filteredValuesSorted " track-by="entry" @click="rowClickHandler($event, entry)">
                        <td v-for="column in displayColsVisible" track-by="column"
                            v-show="column.visible" :class="column.cellstyle">
                            <span v-if="column.renderfunction!==false" v-html="column.renderfunction( column.name, entry )"></span>
                            <span v-else-if="!column.editable"> {{ entry[column.name] }} </span>
                            <value-field-section v-else
                                :entry="entry"
                                :columnname="column.name"></value-field-section>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-if="paginated" class="col-sm-12">
            <div class="btn-toolbar" role="toolbar" aria-label="pagination bar">
              <div class="btn-group" role="group" aria-label="first page">
                <button type="button" class="btn btn-default" @click="page=1">&laquo;</button>
              </div>
              <div class="btn-group" role="group" aria-label="pages">
                <button v-for="index in validPageNumbers"
                    type="button" class="btn btn-default"
                    :class="{ active: page===index }"
                    @click="page=index">
                        {{index}}
                </button>
              </div>
              <div class="btn-group" v-if="showPaginationEtc">...</div>
              <div class="btn-group" role="group" aria-label="last page">
                <button type="button" class="btn btn-default" @click="page=maxPage">&raquo;</button>
              </div>
            </div>
        </div>
    </div>
</template>
<style>
    .vue-table {

    }

    /*#maindiv {
        content: " ";
        box-sizing: border-box;
        display:
        table; width: 100%;
    }
*/
    .spinner {
        border: 16px solid #f3f3f3; /* Light grey */
        border-top: 16px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -60px 0 0 -60px;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }


    .vue-table-loading{
        position: absolute;
        z-index: 99;
        background-color: #ddd;
        opacity: 0.5;
        width: 100%;
        height: 100%;
    }

    .vue-table-loading-hidden {
        display: none;
    }

    table.vue-table thead > tr > th {
        cursor: pointer;
        padding-right: 30px !important;
    }

    /*.vue-table th.active {
        color: red;
    }*/

    .vue-table .arrow {
        opacity: 1;
        position: relative;
    }

    .vue-table .arrow:after {
        position: absolute;
        bottom: 8px;
        right: 8px;
        display: block;
        font-family: 'Glyphicons Halflings';
        content: "\e150";
        /*
        display: inline-block;
        vertical-align: middle;
        width: 0;
        height: 0;
        margin-left: 5px;
        opacity: 0.66;*/
    }

    .vue-table .arrow.asc:after {
        content: "\e155";
        /*
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid #000;
        */
    }

    .vue-table .arrow.dsc:after {
        content: "\e156";
    }


    .vue-table .editableField {
        cursor:pointer;
    }

    /*.vue-table .selected-cell {
        background-color: #F7C072;
    }

    .vue-table .selected-row {
        background-color: #FAE1BE !important;
    }*/
</style>
<script>

    import axios from 'axios';
    import qs from 'qs';
    import lodashorderby from 'lodash.orderby';
    import lodashincludes from 'lodash.includes';
    import lodashfindindex from 'lodash.findindex';


    /* Field Section used for displaying and editing value of cell */
    var valueFieldSection = {
      template: '<span v-if="!enabled" @dblclick="toggleInput" class="editableField">{{this.entry[this.columnname]}}</span>'+
          '<div v-else-if="enabled" class="input-group">'+
          '  <input type="text" class="form-control" v-model="datavalue" @keyup.enter="saveThis" @keyup.esc="cancelThis">'+
          '  <span class="input-group-btn">'+
          '    <button class="btn btn-danger" type="button" @click="cancelThis" ><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>'+
          '    <button class="btn btn-primary" type="button" @click="saveThis" ><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>'+
          '  </span>'+
          '</div>',
      props: ['entry','columnname'],
      data: function () {
          return {
            enabled: false,
            datavalue: "",
          }
      },
      methods: {
        saveThis: function () {
            var originalValue = this.entry[this.columnname];
            this.entry[this.columnname] = this.datavalue;
            this.$parent.$emit('cellDataModifiedEvent', originalValue, this.datavalue, this.columnname,  this.entry);
            this.enabled = !this.enabled;
        },
        cancelThis: function () {
            this.datavalue = this.entry[this.columnname];
            this.enabled = !this.enabled;
        },
        toggleInput: function () {
            this.datavalue= this.entry[this.columnname];
            this.enabled=!this.enabled;
        },
      }
    };

    export default {
        name: "VueBootstrapTable",
        components: {
            'value-field-section': valueFieldSection,
        },
        props: {
            /**
             * The column titles, required
             */
            columns: {
                type: Array,
                required: true,
            },
            /**
             * The rows, an Array of objects
             */
            values: {
                type: Array,
                required: false,
            },
            /**
             * Enable/disable table sorting, optional, default true
             */
            sortable: {
                type: Boolean,
                required: false,
                default: true,
            },
            /**
             * Enable/disable table multicolumn sorting, optional, default false.
             * Also sortable must be enabled for this function to work.
             */
            multiColumnSortable: {
                type: Boolean,
                required: false,
                default: false,
            },
            /**
             * Enable/disable input filter, optional, default false
             */
            showFilter: {
                type: Boolean,
                required: false,
                default: false,
            },
            /**
             * Define if Filter search field is to work in a case Sensitive way. Default: true
             */
            filterCaseSensitive: {
                type: Boolean,
                required: false,
                default: true,
            },
            /**
             * Enable/disable column picker to show/hide table columns, optional, default false
             */
            showColumnPicker: {
                type: Boolean,
                required: false,
                default: false,
            },
            /**
             * Enable/disable pagination for the table, optional, default false
             */
            paginated: {
                type: Boolean,
                required: false,
                default: false,
            },
            /**
             * If pagination is enabled defining the page size, optional, default 10
             */
            pageSize: {
                type: Number,
                required: false,
                default: 10,
            },
            /**
             * If loading of table is to be done through ajax, then this object must be set
             */
            ajax: {
                type: Object,
                required: false,
                default: function () {
                    return {
                        enabled: false,
                        url: "",
                        method: "GET",
                        delegate: false,
                        axiosConfig: {}
                    }
                }
            },
            /**
             * Function to handle row clicks
             */
            rowClickHandler: {
                type: Function,
                required: false,
                default: function () {}
            },
        },
        data: function () {
            return {
                filteredSize: 0,
                filterKey: "",
                sortKey: [],
                sortOrders: {},
                sortChanged: 1,
                columnMenuOpen: false,
                displayCols: [],
                filteredValues: [],
                page: 1,
                echo: 0,
                loading: false,
            };
        },
        mounted: function () {
          this.$nextTick(function () {
              this.loading= true;
              this.setSortOrders();
              var self = this;
              this.columns.forEach(function (column) {
                  var obj = self.buildColumnObject(column);
                  self.displayCols.push(obj);
              });
              if (this.ajax.enabled) {
                  if (!this.ajax.delegate) {
                      this.loading= true;
                      this.fetchData(function (data) {
                          self.values = data.data;
                          self.processFilter();
                      });
                  }else
                      this.processFilter();
              }else
                  this.processFilter();
          })
        },
        created: function () {
            var self = this ;
            this.$on('cellDataModifiedEvent', self.fireCellDataModifiedEvent);
        },
        beforeDestroy: function(){
            var self = this ;
            this.$off('cellDataModifiedEvent', self.fireCellDataModifiedEvent);
        },
        watch: {
            values: function () {
                this.processFilter();
            },
            columns: function () {
                this.displayCols = [];
                var self = this;
                this.columns.forEach(function (column) {
                    var obj = self.buildColumnObject(column);
                    self.displayCols.push(obj);
                });
                this.setSortOrders();
            },
            showFilter: function () {
                this.filterKey = "";
            },
            showColumnPicker: function () {
                this.columnMenuOpen = false;

                this.displayCols.forEach(function (column) {
                    column.visible = true;
                });
            },
            filterKey: function () {
                // filter was updated, so resetting to page 1
                this.page = 1;
                this.processFilter();
            },
            sortKey: function () {
                this.processFilter();
            },
            sortChanged: function () {
                this.processFilter();
            },
            page: function () {
                this.processFilter();
            },
            paginated: function () {
                this.processFilter();
            },
            loading: function () {
                /*document.getElementById("loadingdiv").style.width = document.getElementById("maindiv").getBoundingClientRect().width + "px";
                document.getElementById("loadingdiv").style.height = document.getElementById("maindiv").getBoundingClientRect().height+"px";*/
            }
        },
        computed: {
            displayColsVisible: function () {
                var displayColsVisible = [];
                for (var a in this.displayCols) {
                    if (this.displayCols[a].visible)
                        displayColsVisible.push(this.displayCols[a]);
                }
                return displayColsVisible;
            },
            filteredValuesSorted: function () {
                var tColsDir = [];
                for(var i=0, len=this.sortKey.length; i < len; i++){
                    tColsDir.push(this.sortOrders[this.sortKey[i]].toLowerCase());
                }
                return lodashorderby(this.filteredValues, this.sortKey , tColsDir);
            },
            validPageNumbers: function () {
                // 5 page max
                var result = [];
                var start = 1;
                if (this.page > 3)
                    start = this.page-2;
                for ( var i = 0 ; start <= this.maxPage && i<5; start++ ) {
                    result.push(start);
                    i++;
                }
                return result;
            },
            maxPage: function () {
                return Math.ceil(this.filteredSize / this.pageSize);
            },
            showPaginationEtc: function () {
                var temp = 1;
                if (this.page > 3)
                    temp = this.page-2;
                return ( (temp+4) < this.maxPage  );
            },
        },
        methods: {
            fireCellDataModifiedEvent:function ( originalValue, newValue, columnTitle, entry) {
                this.$parent.$emit('cellDataModifiedEvent',originalValue, newValue, columnTitle, entry);
            },
            processFilter: function () {
                var self = this;
                this.loading = true;
                if ( this.ajax.enabled && this.ajax.delegate ) {
                   this.fetchData(function (data) {
                       self.filteredSize = data.filtered;
                       self.filteredValues = data.data;
                       self.loading = false;
                   });
                } else {
                    var result = this.values.filter(item => {
                                var good = false;
                                for (var col in self.displayColsVisible) {
                                    if (self.filterCaseSensitive) {
                                        if (lodashincludes(item[self.displayColsVisible[col].name] + "", self.filterKey + "")) {
                                            good = true;
                                        }
                                    } else {
                                        if (lodashincludes((item[self.displayColsVisible[col].name] + "").toLowerCase(), (self.filterKey + "").toLowerCase())) {
                                            good = true;
                                        }
                                    }

                                }
                                return good;
                    });

                    var tColsDir = [];
                    for(var i=0, len=this.sortKey.length; i < len; i++){
                        tColsDir.push(this.sortOrders[this.sortKey[i]].toLowerCase());
                    }

                    result = lodashorderby(result, this.sortKey, tColsDir);

                    this.filteredSize = result.length;
                    if (this.paginated) {
                        var startIndex = (this.page - 1) * this.pageSize;
                        var tIndex = 0;
                        var tempResult = [];
                        while (tIndex < this.pageSize) {
                            if (typeof result[startIndex + tIndex] !== "undefined")
                                tempResult.push(result[startIndex + tIndex]);
                            tIndex++;
                        }
                        self.filteredValues = tempResult;
                    } else
                        self.filteredValues = result;
                    self.loading = false;
                }
            },
            fetchData: function ( dataCallBackFunction ) {
                var self = this;
                var ajaxParameters = {
                    params: {}
                };
                this.echo++;
                if (this.ajax.enabled && this.ajax.delegate) {
                    var tColsDir = [];
                    for(var i=0, len=this.sortKey.length; i < len; i++){
                        tColsDir.push(this.sortOrders[this.sortKey[i]].toLowerCase());
                    }
                    if ( this.ajax.method=== "GET" ) {
                        //COPY
                        ajaxParameters = JSON.parse(JSON.stringify(this.ajax.axiosConfig));
                        ajaxParameters.params = {};
                        ajaxParameters.params.sortcol = this.sortKey;
                        ajaxParameters.params.sortdir = tColsDir;
                        ajaxParameters.params.filter = this.filterKey;
                        if (self.paginated ) {
                            ajaxParameters.params.page = this.page;
                            ajaxParameters.params.pagesize = this.pageSize;
                        } else {
                            ajaxParameters.params.page = 1;
                            ajaxParameters.params.pagesize = null;
                        }
                        ajaxParameters.params.echo = this.echo;
                    }
                    if ( this.ajax.method=== "POST" ) {
                        ajaxParameters.sortcol = this.sortKey;
                        ajaxParameters.sortdir = tColsDir;
                        ajaxParameters.filter = this.filterKey;
                        if (self.paginated ) {
                            ajaxParameters.page = this.page;
                            ajaxParameters.pagesize = this.pageSize;
                        } else {
                            ajaxParameters.page = 1;
                            ajaxParameters.pagesize = null;
                        }
                        ajaxParameters.echo = this.echo;
                    }
                    //console.log(JSON.stringify(ajaxParameters));
                }
                if( this.ajax.enabled && !this.ajax.delegate ) {
                    if ( this.ajax.method=== "GET" ) {
                        //COPY
                        ajaxParameters = JSON.parse(JSON.stringify(this.ajax.axiosConfig));
                        ajaxParameters.params = {};
                    }
                    if ( this.ajax.method=== "POST" ) {
                        // Do nothing at this point !
                    }
                }
                if (this.ajax.enabled && this.ajax.method === "GET") {
                    axios.get(self.ajax.url, ajaxParameters )
                        .then(response => {
                            if (this.ajax.delegate) {
                                if (response.data.echo !== self.echo) {
                                    return;
                                }
                            }
                            dataCallBackFunction(response.data);
                            this.$parent.$emit('ajaxLoadedEvent', response.data);
                        })
                        .catch(e => {
                            this.$parent.$emit('ajaxLoadingError', e);
                        });
                }
                if (this.ajax.enabled && this.ajax.method === "POST") {
                    axios.post(self.ajax.url, qs.stringify(ajaxParameters) , this.ajax.axiosConfig )
                        .then(response => {
                            if (this.ajax.delegate) {
                                if (response.data.echo !== self.echo) {
                                    return;
                                }
                            }

                            dataCallBackFunction(response.data);
                            this.$parent.$emit('ajaxLoadedEvent', response.data);

                        })
                        .catch(e => {
                            this.$parent.$emit('ajaxLoadingError', e);
                        });
                }
            },
            buildColumnObject: function (column) {
                var obj = {};
                obj.title = column.title;
                if ( typeof column.name !== "undefined")
                    obj.name = column.name;
                else
                    obj.name = column.title;
                if ( typeof column.visible !== "undefined")
                    obj.visible = column.visible;
                else
                    obj.visible = true;
                if ( typeof column.editable !== "undefined")
                    obj.editable = column.editable;
                else
                    obj.editable = false;
                if ( typeof column.renderfunction !== "undefined")
                    obj.renderfunction = column.renderfunction;
                else
                    obj.renderfunction = false;
                if ( typeof column.columnstyle !== "undefined")
                    obj.columnstyle = column.columnstyle;
                else
                    obj.columnstyle = "";
                if ( typeof column.cellstyle !== "undefined")
                    obj.cellstyle = column.cellstyle;
                else
                    obj.cellstyle = "";

                return obj;
            },
            setSortOrders: function () {
                this.sortKey = [];
                var sortOrders = {};
                this.columns.forEach(function (column) {
                    sortOrders[column.name] = "";
                });
                this.sortOrders = sortOrders;

            },
            sortBy: function (event, key) {
                if (this.sortable) {
                    var self = this;

                    if (!this.multiColumnSortable || ( this.multiColumnSortable && !event.shiftKey)) {
                        this.sortKey = [key];
                        this.columns.forEach(function (column) {
                            if (column.name !== key) {
                                self.sortOrders[column.name] = "";
                            }
                        });
                    } else {
                        if (lodashfindindex(this.sortKey, function(o) { return o === key; }) === -1) {
                            this.sortKey.push(key);
                        }
                    }
                    if (this.sortOrders[key] === "") {
                        this.sortOrders[key] = "ASC";
                    } else if (this.sortOrders[key] === "ASC") {
                        this.sortOrders[key] = "DESC";
                    } else {
                        this.sortOrders[key] = "ASC";
                    }

                    this.sortChanged = this.sortChanged * -1;
                }
            },
            getClasses: function (column) {
                var classes = [column.columnstyle];
                var key = column.name;
                if (this.sortable) {
                    classes.push("arrow");
                    /*if (this.sortKey === key) {
                        classes.push("active");
                    }*/
                    if (lodashfindindex(this.sortKey, function(o) { return o === key; }) !== -1) {
                        classes.push("active");
                    }

                    if (this.sortOrders[key] === "ASC") {
                        classes.push("asc");
                    } else if (this.sortOrders[key] === "DESC") {
                        classes.push("dsc");
                    }
                }
                return classes;
            },
            toggleColumn: function (column) {
                column.visible = !column.visible;
            },
            closeDropdown: function () {
                this.columnMenuOpen = false;
            },
        },
        events: {
        }
    }
</script>