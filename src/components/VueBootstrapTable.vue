<template>
  <div>
    <!--<pre>{{columns}}</pre>-->
    <!--<pre>{{$data}}</pre>-->
    <div class="row">
      <div class="col-6">
        <div v-if="showFilter" style="padding-top: 10px; padding-bottom: 10px">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Filter"
              v-model="filterKey"
            />
            <!--<div class="input-group-append">
                            <span class="input-group-text fa fa-search"></span>
                        </div>-->
          </div>
        </div>
      </div>
      <div class="col-6">
        <div
          v-if="showColumnPicker"
          style="padding-top: 10px; padding-bottom: 10px; float: right"
        >
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-outline-primary dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
            >
              Columns <span class="caret"></span>
            </button>
            <div class="dropdown-menu dropdown-menu-right">
              <button
                v-for="column in displayCols"
                :key="column.name"
                class="dropdown-item"
                @click.stop.prevent="toggleColumn(column)"
              >
                <i v-if="column.visible" class="fa fa-check"></i>
                {{ column.title }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12">
        <div
          :class="{
            'vue-table-loading': this.loading,
            'vue-table-loading-hidden': !this.loading,
          }"
        >
          <div class="spinner"></div>
        </div>
      <div v-if="showpageSize" class="pagesize-container">
        <div class="pagesize form-group" style="">
          <label for="pagesize">Page size</label>
          <select id="pagesize" class="form-control filters" @change="setp($event)">
            <option v-for="i in [10, 25, 50, 100]" :key="i" :value="i">
              {{ i }}
            </option>
          </select>
          
        </div>
         <div class="showing-footer">
          Showing {{ filteredValuesSorted.length }} of {{ values.length }}
        </div>
      </div>
        <table class="mytable table-border">
          <thead>
            <tr>
              <th
                v-for="column in subcolumns"
                :key="column.name"
                :colspan="column.colspan"
                :class="column.className"
              >
                {{ column.title }}
              </th>
            </tr>
          </thead>

          <thead>
            <tr>
              <th v-if="selectable" style="width: 40px">
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    :id="'checkAll' + instanceId"
                    aria-label="Select All"
                    v-model="allSelected"
                  />
                  <label
                    class="custom-control-label"
                    :for="'checkAll' + instanceId"
                  ></label>
                </div>
                <!--<div class="form-check">
                                <input class="form-check-input position-static" type="checkbox" aria-label="Select All" v-model="allSelected">
                            </div>-->
              </th>
              <th
                v-for="column in displayColsVisible"
                :key="column.name"
                @click="sortBy($event, column.name, column.sortable)"
                track-by="column"
                class="icon"
                :colspan="column.colspan"
                :rowspan="column.rowspan"
                :class="getClasses(column)"
              >
                {{ column.title }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, index) in filteredValuesSorted"
              :key="index"
              track-by="entry"
              @click="rowClickHandler($event, entry)"
            >
              <td v-if="selectable">
                <div class="custom-control custom-checkbox">
                  <input
                    type="checkbox"
                    class="custom-control-input"
                    :id="'check' + instanceId + index"
                    v-model="entry.selected"
                  />
                  <label
                    class="custom-control-label"
                    :for="'check' + instanceId + index"
                  ></label>
                </div>
                <!--<div class="form-check">
                                <input class="form-check-input position-static" type="checkbox" aria-label="Select All" v-model="entry.selected">
                            </div>-->
              </td>
              <td
                v-for="column in displayColsVisible"
                :key="column.name"
                track-by="column"
                v-show="column.visible"
                :class="column.cellstyle"
                :data-label="column.title"
              >
                <slot :name="column.name" :column="column" :value="entry">
                  <span
                    v-if="column.renderfunction !== false"
                    v-html="column.renderfunction(column.name, entry)"
                  ></span>
                  <span v-else-if="!column.editable">{{
                    entry[column.name] === null ? "N/A" : entry[column.name]
                  }}</span>
                  <value-field-section
                    v-else
                    :entry="entry"
                    :columnname="column.name"
                  ></value-field-section>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
       
      </div>
      <div v-if="paginated" class="col-sm-12">
        <div class="btn-toolbar" role="toolbar" aria-label="pagination bar">
          <div class="btn-group mr-2" role="group" aria-label="first page">
            <button
              type="button"
              class="btn btn-outline-primary btn-sm"
              @click="page = 1"
            >
              &laquo;
            </button>
          </div>
          <div class="btn-group mr-2" role="group" aria-label="pages">
            <button
              v-for="index in validPageNumbers"
              :key="index"
              type="button"
              class="btn btn-sm btn-outline-primary"
              :class="{ active: page === index }"
              @click="page = index"
            >
              {{ index }}
            </button>
          </div>
          <div class="btn-group mr-2" v-if="showPaginationEtc">...</div>
          <div class="btn-group" role="group" aria-label="last page">
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              @click="page = maxPage"
            >
              &raquo;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* used for fixing IE problems*/
import { polyfill } from "es6-promise";
polyfill();
import axios from "axios";
import qs from "qs";
import lodashorderby from "lodash.orderby";
import lodashincludes from "lodash.includes";
import lodashfindindex from "lodash.findindex";
import ValueFieldSection from "./ValueFieldSection.vue";

export default {
  name: "VueBootstrapTable",
  components: {
    "value-field-section": ValueFieldSection,
  },
  props: {
    /**
     * The column titles, required
     */
    columns: {
      type: Array,
      required: true,
    },

    /** The sub header*/

    subcolumns: { type: Array, default: null },
    /**
     * The rows, an Array of objects
     */
    values: {
      type: Array,
      required: false,
    },
    /**
     * Enable/disable table row selection, optional, default false.
     * When true, it will add a checkbox column on the left side and use the value.selected field
     */
    selectable: {
      type: Boolean,
      required: false,
      default: true,
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

    showpageSize: {
      type: Boolean,
      required: false,
      default: true,
    },
    /**
     * Setting default order column. Expected name of the column
     */
    defaultOrderColumn: {
      type: String,
      required: false,
      default: null,
    },
    /**
     * Setting default order direction. Boolean: true = ASC , false = DESC
     */
    defaultOrderDirection: {
      type: Boolean,
      required: false,
      default: true,
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
          axiosConfig: {},
        };
      },
    },
    /**
     * Function to handle row clicks
     */
    rowClickHandler: {
      type: Function,
      required: false,
      default: function () {},
    },
  },
  data: function () {
    return {
      instanceId: Math.floor(Math.random() * 100000000 + 1),
      filteredSize: 0,
      filterKey: "",
      sortKey: [],
      sortOrders: {},
      sortChanged: 1,
      // columnMenuOpen: false,
      displayCols: [],
      filteredValues: [],
      rawValues: [],
      page: 1,
      definedPageSize: 10,
      echo: 0,
      loading: true,

      allSelected: false,
    };
  },
  /**
   * Once mounted and ready to start
   */
  mounted: function () {
    this.$nextTick(function () {
      this.loading = true;
      this.setSortOrders();
      this.definedPageSize = this.pageSize;
      var self = this;
      //
      if (this.defaultOrderColumn !== null) {
        console.log("setting order default");
        self.sortKey[0] = this.defaultOrderColumn;
        if (this.defaultOrderDirection)
          self.sortOrders[this.defaultOrderColumn] = "ASC";
        else self.sortOrders[this.defaultOrderColumn] = "DESC";
      }
      // Build columns
      this.columns.forEach(function (column) {
        var obj = self.buildColumnObject(column);
        self.displayCols.push(obj);
      });
      // Work the data
      if (this.ajax.enabled) {
        if (!this.ajax.delegate) {
          // If ajax but NOT delegate
          // Perform the fetch of data now and set the raw values
          this.loading = true;
          this.fetchData(function (data) {
            self.rawValues = data.data;
          });
        } else {
          // If ajax and also delegate
          // Simply call processFilter, which will take care of the fetching
          //this.processFilter();
        }
      } else {
        // Not ajax, therefore working with given elements
        // Pass the Prop values to rawValues data object.
        self.rawValues = self.values;
      }
    });
  },
  /**
   * On created register on CellDataModified event
   */
  created: function () {
    var self = this;
    this.$on("cellDataModifiedEvent", self.fireCellDataModifiedEvent);
  },
  /**
   * On destroy unregister the event
   */
  beforeDestroy: function () {
    var self = this;
    this.$off("cellDataModifiedEvent", self.fireCellDataModifiedEvent);
  },
  watch: {
    values() {
      this.rawValues = this.values;
    },
    rawValues: function () {
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
      // this.columnMenuOpen = false;

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
    },
    allSelected() {
      const val = this.allSelected;
      this.values.forEach((value) => {
        value.selected = false;
      });
      this.filteredValuesSorted.forEach((value) => {
        value.selected = val;
      });
    },
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
      for (var i = 0, len = this.sortKey.length; i < len; i++) {
        tColsDir.push(this.sortOrders[this.sortKey[i]].toLowerCase());
      }
      if (
        typeof this.ajax !== "undefined" &&
        this.ajax.enabled &&
        this.ajax.delegate
      ) {
        return this.filteredValues;
      } else {
        return lodashorderby(this.filteredValues, this.sortKey, tColsDir);
      }
    },
    validPageNumbers: function () {
      // 5 page max
      var result = [];
      var start = 1;
      if (this.page > 3) start = this.page - 2;
      for (var i = 0; start <= this.maxPage && i < 5; start++) {
        result.push(start);
        i++;
      }
      return result;
    },
    maxPage: function () {
      return Math.ceil(this.filteredSize / this.definedPageSize);
    },
    showPaginationEtc: function () {
      var temp = 1;
      if (this.page > 3) temp = this.page - 2;
      return temp + 4 < this.maxPage;
    },
  },
  methods: {
    setp(e) {
      console.log(e.target.value);
      this.setPageSize(e.target.value);
    },
    refresh: function () {
      this.processFilter();
    },
    setPageSize: function (newPageSize) {
      this.definedPageSize = newPageSize;
      this.processFilter();
    },
    /**
     * Used to fire off events when something happens to a cell
     */
    fireCellDataModifiedEvent: function (
      originalValue,
      newValue,
      columnTitle,
      entry
    ) {
      this.$parent.$emit(
        "cellDataModifiedEvent",
        originalValue,
        newValue,
        columnTitle,
        entry
      );
    },
    processFilter: function () {
      var self = this;
      this.loading = true;
      if (this.ajax.enabled && this.ajax.delegate) {
        this.fetchData(function (data) {
          self.filteredSize = data.filtered;
          self.filteredValues = data.data;
          self.loading = false;
        });
      } else {
        var result = this.rawValues.filter((item) => {
          for (var col in self.displayColsVisible) {
            if (self.displayColsVisible[col].filterable) {
              if (self.filterCaseSensitive) {
                if (
                  lodashincludes(
                    item[self.displayColsVisible[col].name] + "",
                    self.filterKey + ""
                  )
                ) {
                  return true;
                }
              } else {
                if (
                  lodashincludes(
                    (
                      item[self.displayColsVisible[col].name] + ""
                    ).toLowerCase(),
                    (self.filterKey + "").toLowerCase()
                  )
                ) {
                  return true;
                }
              }
            }
          }
          return false;
        });

        var tColsDir = [];
        for (var i = 0, len = this.sortKey.length; i < len; i++) {
          tColsDir.push(this.sortOrders[this.sortKey[i]].toLowerCase());
        }

        if (
          typeof this.ajax !== "undefined" &&
          this.ajax.enabled &&
          this.ajax.delegate
        ) {
        } else {
          result = lodashorderby(result, this.sortKey, tColsDir);
        }

        this.filteredSize = result.length;
        if (this.paginated) {
          var startIndex = (this.page - 1) * this.definedPageSize;
          var tIndex = 0;
          var tempResult = [];
          while (tIndex < this.definedPageSize) {
            if (typeof result[startIndex + tIndex] !== "undefined")
              tempResult.push(result[startIndex + tIndex]);
            tIndex++;
          }
          self.filteredValues = tempResult;
        } else self.filteredValues = result;
        self.loading = false;
      }
    },
    fetchData: function (dataCallBackFunction) {
      var self = this;
      var ajaxParameters = {
        params: {},
      };
      this.echo++;
      if (this.ajax.enabled && this.ajax.delegate) {
        var tColsDir = [];
        for (var i = 0, len = this.sortKey.length; i < len; i++) {
          tColsDir.push(this.sortOrders[this.sortKey[i]].toLowerCase());
        }
        if (this.ajax.method === "GET") {
          //COPY
          if (
            this.ajax !== null &&
            this.ajax.axiosConfig !== null &&
            this.ajax.axiosConfig !== undefined
          ) {
            ajaxParameters = JSON.parse(JSON.stringify(this.ajax.axiosConfig));
          }
          ajaxParameters.params = {};
          ajaxParameters.params.sortcol = this.sortKey;
          ajaxParameters.params.sortdir = tColsDir;
          ajaxParameters.params.filter = this.filterKey;
          if (self.paginated) {
            ajaxParameters.params.page = this.page;
            ajaxParameters.params.pagesize = this.definedPageSize;
          } else {
            ajaxParameters.params.page = 1;
            ajaxParameters.params.pagesize = null;
          }
          ajaxParameters.params.echo = this.echo;
        }
        if (this.ajax.method === "POST") {
          ajaxParameters.sortcol = this.sortKey;
          ajaxParameters.sortdir = tColsDir;
          ajaxParameters.filter = this.filterKey;
          if (self.paginated) {
            ajaxParameters.page = this.page;
            ajaxParameters.pagesize = this.definedPageSize;
          } else {
            ajaxParameters.page = 1;
            ajaxParameters.pagesize = null;
          }
          ajaxParameters.echo = this.echo;
        }
        //console.log(JSON.stringify(ajaxParameters));
      }
      if (this.ajax.enabled && !this.ajax.delegate) {
        if (this.ajax.method === "GET") {
          //COPY
          if (
            this.ajax !== null &&
            this.ajax.axiosConfig !== null &&
            this.ajax.axiosConfig !== undefined
          ) {
            ajaxParameters = JSON.parse(JSON.stringify(this.ajax.axiosConfig));
          }
          ajaxParameters.params = {};
        }
        if (this.ajax.method === "POST") {
          // Do nothing at this point !
        }
      }
      if (this.ajax.enabled && this.ajax.method === "GET") {
        axios
          .get(self.ajax.url, ajaxParameters)
          .then((response) => {
            if (this.ajax.delegate) {
              if (response.data.echo !== self.echo) {
                return;
              }
            }
            dataCallBackFunction(response.data);
            this.$parent.$emit("ajaxLoadedEvent", response.data);
          })
          .catch((e) => {
            this.$parent.$emit("ajaxLoadingError", e);
          });
      }
      if (this.ajax.enabled && this.ajax.method === "POST") {
        var tempAxiosConf = {};
        if (
          this.ajax !== null &&
          this.ajax.axiosConfig !== null &&
          this.ajax.axiosConfig !== undefined
        ) {
          tempAxiosConf = this.ajax.axiosConfig;
        }
        axios
          .post(self.ajax.url, qs.stringify(ajaxParameters), tempAxiosConf)
          .then((response) => {
            if (this.ajax.delegate) {
              if (response.data.echo !== self.echo) {
                return;
              }
            }

            dataCallBackFunction(response.data);
            this.$parent.$emit("ajaxLoadedEvent", response.data);
          })
          .catch((e) => {
            this.$parent.$emit("ajaxLoadingError", e);
          });
      }
    },
    buildColumnObject: function (column) {
      var obj = {};
      obj.title = column.title;
      if (typeof column.name !== "undefined") obj.name = column.name;
      else obj.name = column.title;
      if (typeof column.visible !== "undefined") obj.visible = column.visible;
      else obj.visible = true;
      if (typeof column.editable !== "undefined")
        obj.editable = column.editable;
      else obj.editable = false;
      if (typeof column.renderfunction !== "undefined")
        obj.renderfunction = column.renderfunction;
      else obj.renderfunction = false;
      if (typeof column.columnstyle !== "undefined")
        obj.columnstyle = column.columnstyle;
      else obj.columnstyle = "";
      if (typeof column.cellstyle !== "undefined")
        obj.cellstyle = column.cellstyle;
      else obj.cellstyle = "";
      if (typeof column.sortable !== "undefined")
        obj.sortable = column.sortable;
      else obj.sortable = true;
      if (typeof column.filterable !== "undefined")
        obj.filterable = column.filterable;
      else obj.filterable = true;

      if (typeof column.colspan !== "undefined") obj.colspan = column.colspan;
      else obj.colspan = 1;

      if (typeof column.colspan !== "undefined") obj.rowspan = column.rowspan;
      else obj.rowspan = 1;
      if (typeof column.width !== "undefined") obj.width = column.width;
      else obj.width = "100%";
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
    sortBy: function (event, key, enabled) {
      if (!enabled) return;
      if (this.sortable) {
        var self = this;

        if (
          !this.multiColumnSortable ||
          (this.multiColumnSortable && !event.shiftKey)
        ) {
          this.sortKey = [key];
          this.columns.forEach(function (column) {
            if (column.name !== key) {
              self.sortOrders[column.name] = "";
            }
          });
        } else {
          if (
            lodashfindindex(this.sortKey, function (o) {
              return o === key;
            }) === -1
          ) {
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
      if (this.sortable && column.sortable) {
        classes.push("arrow");
        /*if (this.sortKey === key) {
                        classes.push("active");
                    }*/
        if (
          lodashfindindex(this.sortKey, function (o) {
            return o === key;
          }) !== -1
        ) {
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
    // closeDropdown: function () {
    //     this.columnMenuOpen = false;
    // },
  },
  events: {},
};
</script>

<style>
.btn-sm,
.btn-group-sm > .btn {
  font-size: 0.875rem !important;
  padding: 5px 15px !important;
}
.mytable {
  width: 100%;
  margin: 0;
  padding: 0;
  border-collapse: collapse;
  border-spacing: 0;
}

.mytable tr {
  padding: 5px;
  color: #000;
}

.mytable th,
.mytable td {
  padding: 10px;
  border: 1px solid rgba(248, 248, 248, 0.075);
}

.mytable th {
  text-transform: uppercase;
  color: #ccc;
  background-color: #161927;
  font-size: 14px;
  letter-spacing: 1px;
}
@media screen and (max-width: 600px) {
  .mytable {
    border: 0;
  }

  .mytable thead {
    display: none;
  }

  .mytable tr {
    margin-bottom: 10px;
    display: block;
    border-bottom: 2px solid #ddd;
  }

  .mytable td {
    display: block;
    text-align: right;
    width: 100% !important;
    min-height: 40px;
    height: auto;
    font-size: 13px;
    border-bottom: 1px dotted #ccc;
  }

  .mytable td:last-child {
    border-bottom: 0;
  }

  .mytable td:before {
    content: attr(data-label);
    float: left;
    text-transform: uppercase;
    margin-right: 5px;
    font-weight: bold;
  }
}

@media screen and (max-width: 1320px) {
  .mytable {
    border: 0;
  }

  .mytable thead {
    display: none;
  }

  .mytable tr {
    margin-bottom: 10px;
    display: block;
    border-bottom: 2px solid #ddd;
  }

  .mytable td {
    display: inline-block;
    text-align: right;
    min-height: 40px;
    width: 25%;
    height: auto;
    font-size: 13px;
    border-bottom: 1px dotted #ccc;
  }

  .mytable td:before {
    content: attr(data-label);
    float: left;
    text-transform: uppercase;
    margin-right: 5px;
    font-weight: bold;
  }
}
.showing-footer {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}
.pagesize{
  width:100px;
  margin-bottom:10px;
  margin-left: 5px;
}
.pagesize>select>option{
  color: #ddd;
  background-color: #161927;
  margin-bottom:0px;
  margin-left:0px;
}
.pagesize-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
}
</style>