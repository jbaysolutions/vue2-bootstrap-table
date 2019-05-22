# vue2-bootstrap-table

vue-bootstrap-table is a sortable and searchable table, with Bootstrap styling, for Vue.js.

### Vue 2.6.0 : 1.2.1 (column slots support, Bootstrap v4.3.1) 

### Vue < 2.6.0: 1.1.13 (Bootstrap v3) 

### Vue 1 : [jbaysolutions/vue-bootstrap-table](https://github.com/jbaysolutions/vue-bootstrap-table)

### [Demo](https://jbaysolutions.github.io/vue2-bootstrap-table/examples/01-basic.html)

<!--
## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contribute](#contribute)
- [TODO List](#todo-list)

## Demos


TODO UPDATE DOCS
TODO UPDATE CHANGELOG

-->

#### Projects using vue-bootstrap-table

- [Draxed](https://www.draxed.com/?utm_source=github&utm_medium=web&utm_campaign=vue-bootstrap-table)

*Know of others? Create a PR to let me know!*

## Features

* Sortable
* Multicolumn Sorting
* Searchable
* Select display columns
* Pagination
* On Table Editing
* Remote data loading
* Remote data processing


## Requirements

* Vue 2.6.0+ (tested with 2.6.10)
* Bootstrap 4 css (for Bootstrap 3 css use 1.1.x)
* Fontawesome 5


## Installation

#### [npm](https://www.npmjs.org/package/vue2-bootstrap-table2)

    # install with npm    
	npm install vue2-bootstrap-table2 --save
    
    # install with yarn    
    yarn add vue2-bootstrap-table2


Import the library

```javascript
    import VueBootstrapTable from "vue2-bootstrap-table2";
```

Add to other Vue components 

 ```javascript
    export default {
        components: {
            VueBootstrapTable: VueBootstrapTable,
        },
    // ... data, methods, mounted (), etc.
    }
    
``` 

#### browser

Include the browser-ready bundle (download from [releases](https://github.com/jbaysolutions/vue2-bootstrap-table/releases)) in your page. The components will be automatically available.

```html
    <script src="vue2-bootstrap-table2.umd.min.js"></script>
```


## Usage

```javascript

    new Vue({
        el: '#app',
        components: {
            VueBootstrapTable: VueBootstrapTable
        },
        data: {
            columns: [
                {
                    title:"id",
                },
                {
                    title:"name",
                    visible: true,
                    editable: true,
                    filterable: false
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
                    sortable: false
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
    });
```` 


````html

    <vue-bootstrap-table
            :columns="columns"
            :values="values"
            :show-filter="true"
            :show-column-picker="true"
            :sortable="true"
            :paginated="true"
            :multi-column-sortable=true
            :filter-case-sensitive=false

    >
        <template v-slot:name="slotProps">
            {{slotProps.value.name}}
        </template>
        <template v-slot:description="slotProps">
            {{slotProps.value.description}}
        </template>
    </vue-bootstrap-table>
```` 

## Configuration Props

```javascript

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
            required: true,
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

```

### Column Array Definition

The `columns` array takes object of type:

```javascript
{
    title: String,              // Mandatory: Title to be presented on the Table
    name: String,               // Optional: The name of the "data" property. If nothing, title is used.
    visible: Boolean,              // Optional: column visible? (Default: true)
    editable: Boolean,            // Optional: column cells editable? (Default: false)
    columnstyle: String         // Optional: styles to be applied to the Column Header
    cellstyle: String           // Optional: styles to be applied to the Cells of this column
    renderfunction: Function    // Optional: Function that receives as input the column name and entry, and returns an HTML String for drawing cell
    sortable: Boolean           // Optional, by default it is true!  Used to set particular columns as not sortable, in case the table is sortable itself. - From 1.1.12
    filterable: Boolean         // Optional, by default it is true!  Used to exclude columns from the filtering process. - From 1.1.13
}
```

#### Column Definition Examples

Column with Title "Id" , which is visible but not editable:

```javascript
{
    title:"Id",
}
```
Column with Title "Name" , which is visible and editable:

```javascript
{
    title:"Name",
    visible: true,
    editable: true,
}
```

#### Column slots example

````html

    <vue-bootstrap-table
            :columns="columns"
            :values="values"
            :show-filter="true"
            :show-column-picker="true"
            :sortable="true"
            :paginated="true"
            :multi-column-sortable=true
            :filter-case-sensitive=false

    >
        <template v-slot:name="slotProps">
            {{slotProps.value.name}}
        </template>
        <template v-slot:description="slotProps">
            {{slotProps.value.description}}
        </template>
    </vue-bootstrap-table>
```` 

A slot will be created for each column, named with column.name. It has two props available:
 * "column" - the column object
 * "value" - the value object for the corresponding row



#### Render Function Example

For a Column definition like so:

```javascript
columns: [
    {
        title: "Test",
        visible: true,
        renderfunction: renderTestColumn
    }
],
```

There must be a javascript function called `renderTestColumn`  :

```javascript
<script>
    var renderTestColumn = function (colname, entry) {
        return '<div class="btn-group" role="group" >'+
            '  <button type="button" class="btn btn-sm btn-primary"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span></button>'+
            '  <button type="button" class="btn btn-sm btn-danger"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>'+
            '</div><span>'+JSON.stringify(entry)+'</span>';
    };
</script>
```

### ROW Click Handler

To add a Row click handler function:

````html

    <vue-bootstrap-table
            [...]
            :row-click-handler=handleRowFunction
    >
    </vue-bootstrap-table>
````

On your Vue instance :

````javascript
data: {
        handleRowFunction: handleRow,
}
````

And have the javascript function declared like so:

````javascript
var handleRow = function (event, entry) {
    console.log("CLICK ROW: " + JSON.stringify(entry));
};
````

Where event in the `MouseEvent` and `entry` e the complete entry corresponding to the row.


### DEFAULT Ordering

To setup your default ordering for the table:

````html

    <vue-bootstrap-table
            [...]
            :default-order-column="columnToSortBy"
            :default-order-direction=true
    >
    </vue-bootstrap-table>
````

On your Vue instance :

````javascript
data: {
        columnToSortBy: "name",
}
````

This will make the default column order be :  
 * column: name  
 * order: ascending

### AJAX Configuration

Ajax Object properties:

* enabled : to enable loading through ajax call, enable this
* url: the URL where to request the data
* methods: GET and POST are the valid methods allowed
* delegate: False = just get all the data and do processing on browser;  True = Ask for data as needed, and all processing is done on the server side.
* axiosConfig: check [Axios Page](https://github.com/mzabriskie/axios) for information regarding Method Config.

#### Example AJAX config for Remote Loading

This configuration will only make one request to the server, to get all the data and load it straight into the browser.

```javascript
ajax: {
    enabled: true,
    url: "http://localhost:9430/data/test",
    method: "GET",
    delegate: false,
    axiosConfig: {}
},
```

#### Example AJAX config for Remote Processing

This configuration will only make many requests to the server, each time data ir needed, or any processing is required: for filtering, ordering, pagniation, changes of page size, etc.

```javascript
ajax: {
    enabled: true,
    url: "http://localhost:9430/data/test",
    method: "GET",
    delegate: true,
    axiosConfig: {
        headers: {
            'Authorization': 'Bearer TESTTESTTESTTESTTEST'
        }
    }
},
```

### Ajax Request and Expected Response

#### Ajax Request Parameters Sent

When Ajax is enabled, the following parameters are sent with each request for the URL specified:

 - `sortcol` : Array of String columns to sort (only sent when `delegate` is true, otherwise will be null)
 - `sortdir` : Array of sorting directions for each column on sortcol, "ASC" or "DESC" (only sent when `delegate` is true, otherwise will be null)
 - `filter` : The filter to be used  (only sent when `delegate` is true, otherwise will be null)
 - `page` : The number of the page being requested ( when delegate is false, it will always be 1 )
 - `pagesize` : The number of records being requested.
 - `echo` : A unique number for the request.

##### When using GET

 - `sortcol` : is sent in the following format  `sortcol[]=COLNAME&sortcol[]=COLNAME`
 - `sortdir` : is sent in the following format  `sortdir[]=ASC&sortdir[]=DESC`

This is performed automatically by AXIOS

##### When using POST

 - `sortcol` : is sent in the following format  `sortcol[0]=COLNAME ; sortcol[1]=COLNAME; `
 - `sortdir` : is sent in the following format  `sortdir[0]=ASC ; sortdir[1]=DESC`

This is performed automatically by AXIOS

#### Ajax Expected Response

For all requests, vue-bootstrap-table expects an object of the following type:

```javascript
{
    echo: INTEGER,
    filtered: INTEGER,
    data: [OBJECT],
},
```

Where:

- `echo` : is the same integer the request provided.
- `filtered` : is the total amount of entries for the request, and is used for pagination
- `data` : is an Array of Object with the entries.

Example:

```javascript
{
    echo: 1,
    filtered: 2000,
    data: [
        {
            id: 1,
            name: "Rui"
        },
        {
            id: 2,
            name: "Gustavo"
        },
    ],
},
```

## Events

* `cellDataModifiedEvent` - When a cell is edited, an `cellDataModifiedEvent` event is dispatched.
* `ajaxLoadedEvent` - When ajax call is executed successfully an `ajaxLoadedEvent` event is dispatched.
* `ajaxLoadingError` -When ajax call is executed unsuccessfully an  `ajaxLoadingError` event is dispatched.

### Handling Events

```javascript
    created: function () {
        this.$on('cellDataModifiedEvent',
            function( originalValue, newValue, columnTitle, entry) {
                console.log("cellDataModifiedEvent - Original Value : " + originalValue +
                                         " | New Value : " + newValue +
                                         " | Column : " + columnTitle +
                                         " | Complete Entry : " +  entry );
            }
        );
        this.$on('ajaxLoadedEvent',
            function( data ) {
                console.log("ajaxLoadedEvent - data : " + data );
            }
        );
        this.$on('ajaxLoadingError',
            function( error ) {
                console.log("ajaxLoadingError - error : " + error );
            }
        );
    },
```

## Contribute

If you have a feature request, please add it as an issue or make a pull request.


## TODO List

- [x] Basic table
- [x] Sorting
- [x] Multicolumn Sorting
- [x] Filter
- [x] Column picker
- [x] Pagination
- [x] Editing
- [x] Ajax
- [ ] Responsive
- [ ] Dates sorting
- [ ] Keyboard navigation


## Changelog

### 1.1.13

* #19 - Disable filter for specific columns

### 1.1.12

* Enhancement - exposed methods.

### 1.1.11

* Enhancement - #11 - Dynamic Page Size
* Enhancement - Started creating public methods to simplify stuff.

### 1.1.10.1

* Bug fix - axios problem with passing axios config object

### 1.1.10

* Bug fix - Delegate true and false behaviours leading to not loading data
* Bug fix - Ajax redundant fetch when not needed
* Enhancement - #14 - Adding support for default ordering
* Enhancement - Documentation of code

### 1.1.9

* Bug fix - Support for IE11 (maybe fixed for IE10 aswell)

### 1.1.8

* Bug fix - Issue 5 - Axios config not being loaded with GET method and Delegate false.

### 1.1.7

* Allowing Axios configuration to be passed for the requests

### 1.1.6

* Search case sensitivity configurable

### 1.1.5

* Row Click Handler added

### 1.1.4

* Fix- delegate now doesn't use echo

### 1.1.3

* Define a Render Function support by column
* Define Column Styles by column
* Define Cell Styles by column

### 1.1.2

* Fix to Sorting
* Added Multicolumn Sorting
* Fix dynamic adding rows with update to interface
* Ajax with multicolumn sorting

### 1.1.1

* Added more Events

### 1.1.0

* Remote data loading (through ajax call)
* Remote data processing (through ajax calls)
* Loading overlay

### 1.0.2

* Pagination working
* Editing cells on the table
* Configuration Improvements

### 1.0.1

* Bug fix

### 1.0.0

* First version
