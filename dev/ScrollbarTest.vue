<template>
    <div class="main">
        <h1>Scrollbar Test</h1>
        <div>
            <input type="number" @change="onChange" placeholder="Items count" />
            <div>Message is: {{ totalCount }}</div>
        </div>
        <div class=listcontainer>
            <div class="list" ref="list" @mousewheel="onMouseWheel">
                <div v-for="item in items" :key="item">{{item}}</div>
            </div>
            <scrollbar :totalCount="totalCount" :itemsPerPage="itemsPerPage" :parentHeight="height" v-model='position'>
            </scrollbar>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import Scrollbar from "../Scrollbar.vue"

const itemHeight = 18

export default Vue.extend({
    components: {
        Scrollbar
    },
    data() {
        return {
            position: 0,
            totalCount: 0,
            itemsPerPage: 0,
            height: 0,
            totalItems: [],
            startIndex: 0
        }
    },
    watch: {
        position: function (newVal) { this.startIndex = newVal }
    },
    computed: {
        items() {
            return this.totalItems.slice(this.startIndex, this.startIndex + this.itemsPerPage + 1)
        }
    },
    methods: {
        onChange: function (evt) {
            this.totalCount = parseInt((evt.srcElement).value)
            this.totalItems = Array.from(Array(this.totalCount).keys()).map((n, i) => `Item # ${i}`)
            this.onResize()
        },
        onResize: function () {
            this.height = (this.$refs.list).clientHeight
            this.itemsPerPage = Math.floor(this.height / itemHeight)
        },
        onMouseWheel: function (evt) { this.$emit('mousewheel', evt) }
    },
    created: function () {
        window.addEventListener("resize", this.onResize)
    },
    destroyed: function () {
        window.removeEventListener("resize", this.onResize)
    }
})
</script>

<style>
:root {
    --tablevue-main-background-color: white;
    
    --tablevue-scrollbar-width: 16px;
    --tablevue-scrollbar-border-width: 1px;
    --tablevue-scrollbar-background-color: azure;
    --tablevue-scrollbar-border-color: gray;
    --tablevue-scrollbar-grip-color: rgb(209, 209, 209);
    --tablevue-scrollbar-grip-hover-color: #bbb;
    --tablevue-scrollbar-grip-active-color: #999;
    --tablevue-scrollbar-button-color: #666;
    --tablevue-scrollbar-button-hover-color: #555;
    --tablevue-scrollbar-button-active-color: #444;
    --tablevue-scrollbar-button-background-color: white;
    --tablevue-scrollbar-button-hover-background-color: rgb(209, 209, 209);
    --tablevue-scrollbar-button-active-background-color: #aaa;
        
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
</style>  

<style scoped>
    .main {
        display: flex;
        flex-direction: column;
    }
    .listcontainer {
        margin: 20px;
        position: relative;
        flex-grow: 1;
        overflow: hidden;

        border-color: gray;
        border-style: solid;
        border-width: 1px;
    }
    .list {
        position: absolute;
        height: 100%;
        width: 100%;        
    }
</style>
