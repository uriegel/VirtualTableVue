<template>
    <div class="container">
        <table>
            <columns :columns='columns' :columnsWidths='columnsWidths' 
                @on-columns-widths-changed='onColumnsWidthChanged'
                @on-column-click='onColumnClick'
                @on-header-click='onColumnHeaderClick'>
                <template v-slot:col0>
                    <img class="img" src="../trace.svg">
                    Hallo
                </template>
                <template v-slot:col1 class="is-sortable">
                    <div class="is-sortable">Du</div>
                </template>
                <template v-slot:col2>
                    Da
                </template>
            </columns>
            <tbody>
                <tr>
                    <td>Test</td>
                    <td>txt</td>
                    <td>25.02.1999 14:23</td>
                </tr>
                <tr>
                    <td>Bild</td>
                    <td>jpg</td>
                    <td>15.12.2009 12:39</td>
                </tr>
            </tbody>
        </table>    
        <p>
            <button @click='onChange'>Change</button>
        </p>
        <p>
            <button @click='onChange2'>Change with ColumnWidths</button>
        </p>
    </div></template>

<script>
import Vue from 'vue'
import Columns from '../Columns.vue'

export default Vue.extend({
    components: {
        Columns        
    },
    data() {
        return {
            columns: [],
            columnsWidths: []
        }
    },
    methods: {
        onChange: function () {
            this.columns = [{
                    name: "Name",
                    subItem: "Erw.",
                    isSortable: true
                }, {
                    name: "Größe",
                    isSortable: true
                }, {
                    name: "Datum",
                    isSortable: true
                }, {
                    name: "Beschreibung"
                }
            ]
        },
        onChange2: function () {
            this.columns = [{
                    name: "Name",
                    width: "25%"
                }, {
                    name: "Größe",
                    width: "35.4305%"
                }, {
                    name: "Datum",
                    width: "21.2687%"
                }, {
                    name: "Version",
                    width: "18.3009%"
                }
            ]
        },
        onColumnsWidthChanged: function(widths) {
            console.log("new columnsWidths", widths)
        },
        onColumnClick: function(index, descending, subItem) {
            console.log("Click", index, descending, subItem)
        },
        onColumnHeaderClick: function(index) {
            console.log("Header Click", index)
        }
    },
    mounted: function() {
        this.columns = [{
                isClickable: true
            }, {
            }, {
            }
        ]
    }
})
</script>

<style>
:root {
    --tablevue-main-background-color: white;
    
    --tablevue-selected-color:  white;
    --tablevue-selected-background-color: blue;
    --tablevue-columns-separator-color:  white;
    --tablevue-selected-background-hover-color: #0063ff;
}
body {
    height: 100vh;
    margin: 0px;
    padding: 0px;
    display: flex;
}

.is-sortable {
    background-color: yellow;
    transition: background-color 0.3s; 
}
.is-sortable:hover {
    background-color: var(--tablevue-selected-background-hover-color);
}

</style>  

<style scoped>
    .container {
        margin: 0px 55px;
    }
    table {
        width: 100%;
        box-sizing: border-box;
        outline-width: 0px;
        table-layout: fixed;
        border-spacing: 0px;
    }

    td {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        user-select: none;
    }

    .img {
        width:16px;
    }
</style>

