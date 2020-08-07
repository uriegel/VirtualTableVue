<template>
    <div class="root">
        <div class="container">
            <table-view :eventBus="tableEventBus" :columns='columns' :itemsSource='itemsSource' 
                @selection-changed="onSelectionChanged" @column-click='onColumn'>
                <template v-slot=row >
                    <tr :class="{ 'isCurrent': row.item.index == selectedIndex }">
                        <td>{{row.item.name}}</td>
                        <td>{{row.item.extension}}</td>
                        <td>{{row.item.date}}</td>
                        <td class="rightAligned">{{row.item.description}}</td>
                    </tr>
                </template>
            </table-view>
        </div>
        <div class="input">
            <button @click="onFill">Fill</button>
            <button @click="onRestrict">Restrict</button>
        </div>    
    </div>
</template>

<script>
import Vue from 'vue'
import TableView from '../TableView.vue'

var first = true

export default Vue.extend({
    components: {
        TableView
    },
    data() {
        return {
            tableEventBus: new Vue(),
            selectedIndex: 0,
            columns: [
                {
                    name: "Name",
                    subItem: "Ext",
                    isSortable: true,
                    width: "25%"
                }, {
                    name: "Größe",
                    isSortable: true,
                    width: "35.4305%"
                }, {
                    name: "Datum",
                    isSortable: true,
                    width: "21.2687%"
                }, {
                    name: "Beschreibung",
                    width: "18.3009%"
                }
            ],
            itemsSource: { count: 0, getItems: async () => await [], indexToSelect: 0}
        }
    },
    computed: {
        totalCount() {
            return this.itemsSource.count
        }
    },
    methods: {
        onSelectionChanged(index) { this.selectedIndex = index },
        onFill() {
            const letters = ['a', 'b', 'c', 'd', 'e']
            const items = letters.map(n => Array.from(Array(20).keys()).map(m => n + m)).flat() 
            
            function getItems(startRange, endRange) {
                return items.slice(startRange, endRange).map((n, i) => {
                    return {
                        name: n,
                        extension: "extension",
                        date: "datum",
                        description: "description",
                        index: i + startRange                        
                    }
                })
            }

            this.items = []
            this.tableEventBus.$emit("focus")
            this.itemsSource = { count: items.length, getItems, indexToSelect: 80 }
        },
        fillItems(count) {
            this.items = []

            async function getItems(startRange, endRange) {
                console.log("getitems", startRange, endRange)
                return await Array.from(Array(endRange - startRange).keys()).map((n, i) => {
                    return {
                        name: `name ${i + startRange}`,
                        extension: `extension ${i + startRange}`,
                        date: `datum ${i + startRange}`,
                        description: `description ${i + startRange}`,
                        index: i + startRange
                    }
                })
            }
            this.tableEventBus.$emit("focus")
            this.itemsSource = { count, getItems, indexToSelect: 9 }
        },
        onRestrict() {},
        onThemeChanged() {
            if (first) {
                document.body.style.setProperty("font-size", "150%")
                first = false
            } else {
                document.body.style.setProperty("font-size", "50%")
                first = true
            }
            
            this.tableEventBus.$emit("themeChanged")            
        },
        newTheme() {
            const head = document.getElementsByTagName('head')[0]
            let link = document.createElement('link')
            link.rel = 'stylesheet'
            link.id = 'theme'
            link.type = 'text/css'
            link.href = `http://localhost:9865/assets/themes/yaru.css`
            link.media = 'all'
            head.appendChild(link)
            this.tableEventBus.$emit("themeChanged")
        },
        onColumn(col, desc, subItem) {
            console.log("Column", col, desc, subItem)
        }
    },
    mounted() {
        //this.fillItems(20)
        setTimeout(() => this.tableEventBus.$emit("focus"))
    }
})
</script>

<style>
:root {
    --tablevue-main-color: black;
    --tablevue-main-background-color: white;
    --tablevue-right-margin-scrollbar: 16px;
    
    --tablevue-scrollbar-width: 16px;
    --tablevue-scrollbar-border-width: 1px;
    --tablevue-scrollbar-background-color: azure;    
    --tablevue-scrollbar-border-color: gray;
    --tablevue-scrollbar-grip-width: 100%;    
    --tablevue-scrollbar-grip-color: rgb(209, 209, 209);
    --tablevue-scrollbar-grip-hover-color: #bbb;
    --tablevue-scrollbar-grip-active-color: #999;
    --tablevue-scrollbar-button-color: #666;
    --tablevue-scrollbar-button-hover-color: #555;
    --tablevue-scrollbar-button-active-color: #444;
    --tablevue-scrollbar-button-background-color: white;
    --tablevue-scrollbar-button-hover-background-color: rgb(209, 209, 209);
    --tablevue-scrollbar-button-active-background-color: #aaa;
    
    --tablevue-selected-color: white;
    --tablevue-selected-background-color: blue;
    --tablevue-columns-separator-color:  white;
    --tablevue-selected-background-hover-color: #0063ff;
    --tablevue-tr-selected-color: red;
}
body {
    height: 100vh;
    margin: 0px;
    padding: 0px;
    display: flex;
    color: #bbb;
}
</style>  

<style scoped>
.root {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    background-color: #444;
}
.container {
    flex-grow: 1;
    display: flex;
}
.input {
    margin: 20px;
}
.rightAligned {
    text-align: right;
}
</style>
