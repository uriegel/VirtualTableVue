<template>
    <div class="root">
        <h1>Table View Test</h1>
        <div class="container">
            <table-view :eventBus="tableEventBus" :columns='columns' :itemsSource='itemsSource' 
                @selection-changed="onSelectionChanged">
                <template v-slot=row >
                    <tr :class="{ 'isCurrent': row.item.index == selectedIndex }">
                        <td>{{row.item.name}}</td>
                        <td>{{row.item.extension}}</td>
                        <td>{{row.item.date}}</td>
                        <td>{{row.item.description}}</td>
                    </tr>
                </template>
            </table-view>
        </div>
        <div class="input">
            <button @click=onStart>Start</button>
            <button @click=onStartRandom>Start random</button>
            <button @click=onUpdate>Update 3 50 60 61 </button>
        </div>    
    </div>
</template>

<script>
import Vue from 'vue'
import TableView from '../TableView.vue'

var keys
var items

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
            itemsSource: { count: 0, getItems: async () => await []}
        }
    },
    computed: {
        totalCount() {
            return this.itemsSource.count
        }
    },
    methods: {
        onSelectionChanged(index) { this.selectedIndex = index },
        onStart() {
            this.onStartFilling()
        },  
        onStartRandom() {
            this.onStartFilling(true)
        },
        onStartRandomSorted() {
            this.onStartFilling(true, true)
        },
        onStartFilling(random) {        
            const max = 500
            keys = (random ? Array.from({length: max}, () => Math.floor(Math.random() * max)) : Array.from(Array(max).keys()))
                            .map((n, i) => { return { item: n, i}})
            items = Array.from(Array(max).keys()).map(n => {
                return {
                    name: `name ${n}`,
                    date: n,
                    description: `description ${n}`,
                }
            })
            
            async function getItems(startRange, endRange) {
                this.selectedIndex
                console.log("getItems", startRange, endRange)

                return keys
                    .filter((n, i) => i >= startRange && i <= Math.min(this.count - 1, endRange))
                    .map(n => {
                        var item = {
                            name: items[n.item].name,
                            extension: n.i,
                            date: items[n.item].date,
                            description: items[n.item].description,
                            index: n.i
                        }
                        return item
                    })
            }

            let count = 0
            const interval = setInterval(() => {
                count = count +1
                if (count > max) {
                    clearInterval(interval)
                    return
                }
                console.log("count", count)
                this.itemsSource = { count, getItems }
            }, 1000)
            //this.tableEventBus.$emit("focus")
        },
        onUpdate() {
            const update = (index) => {
                const i = keys[index]
                items[i.item].name = "Geändert " + index
            }
            update(3)
            update(50)
            update(60)
            update(61)
        }
    },
    mounted() {
        setTimeout(() => this.tableEventBus.$emit("focus"))
    }
})
</script>

<style>
:root {
    --tablevue-main-color: black;
    --tablevue-main-background-color: white;
    
    --tablevue-scrollbar-border-color: gray;
    --tablevue-scrollbar-border-active-color: #444;
    --tablevue-scrollbar-button-active-color: #aaa;
    --tablevue-scrollbar-image-color: #666;
    --tablevue-scrollbar-grip-color: rgb(209, 209, 209);
    --tablevue-scrollbar-grip-hover-color: #bbb;
    --tablevue-scrollbar-grip-active-color: #999;

    --tablevue-selected-color:  white;
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
    padding: 20px;
    display: flex;
}
.input {
    margin: 20px;
}
</style>
