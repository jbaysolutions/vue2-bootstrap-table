# vue-bootstrap-table

vue-bootstrap-table is a sortable and searchable table, with Bootstrap styling, for Vue.js.

## VUE 1

Use current release : 1.1.0

## VUE 2

Not yet available. Being Developed

### [Demo](https://jbaysolutions.github.io/vue-bootstrap-table/examples/01-basic.html)

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
* Searchable
* Select display columns
* Pagination
* On Table Editing
* Remote data loading
* Remote data processing


## Requirements

* Vue 1.* (tested with 1.0.26)
* Bootstrap 3 css


## Installation

Install the vue-bootstrap-table [package](https://www.npmjs.org/package/vue-bootstrap-table2) package using [npm](https://www.npmjs.com/):

	npm install vue-bootstrap-table2


Or add the js script to your html (download from [releases](https://github.com/jbaysolutions/vue-bootstrap-table/releases)):
 
    <script src="vue-bootstrap-table.js"></script>


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
    >
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
         * Enable/disable table sorting, optional, default true
         */
        sortable: {
            type: Boolean,
            required: false,
            default: true,
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
                }
            }
        },
    },

```

### Column Array Definition

The `columns` array takes object of type:

```javascript
{
    title:"country",  // Mandatory: Title to be presented on the Table
    visible: true,    // Optional: column visible? (Default: true)
    editable: false,  // Optional: column cells editable? (Default: false)
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

### AJAX Configuration

Ajax Object properties:

* enabled : to enable loading through ajax call, enable this
* url: the URL where to request the data
* methods: GET and POST are the valid methods allowed
* delegate: False = just get all the data and do processing on browser;  True = Ask for data as needed, and all processing is done on the server side.


#### Example AJAX config for Remote Loading

This configuration will only make one request to the server, to get all the data and load it straight into the browser.

```javascript
ajax: {
    enabled: true,
    url: "http://localhost:9430/data/test",
    method: "GET",
    delegate: false,
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
},
```

### Ajax Request and Expected Response

#### Ajax Request Parameters Sent

When Ajax is enabled, the following parameters are sent with each request for the URL specified:

 - `sortcol` : The name of the column to sort by (only sent when `delegate` is true, otherwise will be null)
 - `sortdir` : The sorting direction "ASC" or "DESC" (only sent when `delegate` is true, otherwise will be null)
 - `filter` : The filter to be used  (only sent when `delegate` is true, otherwise will be null)
 - `page` : The number of the page being requested ( when delegate is false, it will always be 1 )
 - `pagesize` : The number of records being requested.
 - `echo` : A unique number for the request.

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

### Handling `cellDataModifiedEvent`

```javascript

    events: {
        cellDataModifiedEvent: function( originalValue, newValue, columnTitle, entry) {

            this.logging.push("Original Value : " + originalValue +
                         " | New Value : " + newValue +
                         " | Column : " + columnTitle +
                         " | Complete Entry : " +  entry );

        },
    },
```

## Contribute

If you have a feature request, please add it as an issue or make a pull request.


## TODO List

- [x] Basic table
- [x] Sorting
- [x] Filter
- [x] Column picker
- [x] Pagination
- [x] Editing
- [x] Ajax
- [ ] Responsive
- [ ] Dates sorting
- [ ] Keyboard navigation


## Changelog

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
