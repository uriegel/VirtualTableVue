<template>
    <div class="tableview-root" tabindex="1" ref="list" @keydown="onKeyDown" @mousewheel="onMouseWheel">
        <table ref="table" @mousedown="onMouseDown" @dblclick='onDblClick' 
                :class="{ 'scrollbar': itemsSource.count > itemsPerPage }">
            <columns :columns='columns' @onColumnHeight='onColumnHeight' :eventBus="columnsEventBus"
                @on-columns-widths-changed='onColumnsWidthChanged' @on-column-click='onColumnClick'></columns>
            <tbody ref="tbody">
                <slot v-for="item in displayItems" :item="item"></slot>
            </tbody>
        </table>    
        <div ref="scrollbar" class="table-scrollbar" >
            <scrollbar :totalCount="itemsSource.count" :itemsPerPage="itemsPerPage" :parentHeight="height" :eventBus="scrollbarEventBus"
                v-bind:style="{height: height+'px'}" v-model="position">
            </scrollbar>
        </div>    
    </div>
</template>

<script>
import Vue from 'vue'
import Columns from './Columns.vue'
import Scrollbar from './Scrollbar.vue'

export default Vue.extend({

    components: {
        Columns,
        Scrollbar
    },
    props: {
        eventBus: { type: Object, default: () => new Vue() },
        columns: {},
        itemsSource: {
            type: Object,
            default: () => {
                return { 
                    count: 0,   
                    getItems: async () => await []
                }
            }
        }
    },
    data() {
        return {
            columnsEventBus: new Vue(),
            scrollbarEventBus: new Vue(),
            position: 0,
            height: 0,
            itemsPerPage: 0,
            startIndex: 0,
            itemHeight: 0,
            displayItems: [],
            index: -1,
            columnHeight: undefined,
        }
    },
    watch: {
        itemsSource: {
            immediate: true,
            async handler(newVal) {
                this.position = 0
                if (newVal.indexToSelect != -1)
                    this.setCurrentIndex(newVal.indexToSelect || 0) 
                await this.onResize()
                this.$emit("selection-changed", this.index, this.displayItems[this.index - this.startIndex]) 
            }
        },
        position(newVal) { 
            this.startIndex = newVal 
            this.setPosition()
        },
        index: {
            immediate: true,
            handler(newVal) { 
                this.$emit("selection-changed", newVal, this.displayItems[newVal - this.startIndex]) 
            }
        },
    },
    methods: {
        focus() { this.$refs.list.focus() },
        onColumnHeight(height) { 
            this.columnHeight = height
            this.$refs.scrollbar.style.top = `${height}px`
        },
        onColumnsWidthChanged(widths) {
            this.$emit('columns-widths-changed', widths)
        },
        async onResize() {
            if (this.$refs.list)
                this.height = this.$refs.list.clientHeight - this.columnHeight
            this.itemsPerPage = this.itemHeight ? Math.floor(this.height / this.itemHeight) : 1
            await this.setPosition()
        },
        onKeyDown(evt) {
            switch (evt.which) {
                case 13: // return
                    this.onDblClick()
                    break
                case 33:
                    this.pageUp()
                    break
                case 34:
                    this.pageDown()
                    break                
                case 35: // End
                    if (!evt.shiftKey)
                        this.end()
                    break
                case 36: //Pos1
                    if (!evt.shiftKey)
                        this.pos1()
                    break
                case 38:
                    this.upOne()
                    break
                case 40:
                    this.downOne()
                    break
                default:
                    return // exit this handler for other keys
            }
            evt.preventDefault() // prevent the default action (scroll / move caret)
        },
        onMouseDown(evt) {
            const tr = (evt.target).closest("tbody tr")
            if (tr) {
                const currentIndex = 
                    Array.from(this.$refs.table.querySelectorAll("tr"))
                    .findIndex(n => n == tr)
                    + this.position -1
                if (currentIndex != -1)
                    this.setCurrentIndex(currentIndex)
            }
        },
        onMouseWheel(evt) {
            if (this.itemsSource.count > this.itemsPerPage) {
                var delta = evt.deltaY / Math.abs(evt.deltaY) * 3
                let newPos = this.position + delta
                if (newPos < 0)
                    newPos = 0
                if (newPos > this.itemsSource.count - this.itemsPerPage) {
                    newPos = this.itemsSource.count - this.itemsPerPage
                }
                this.position = newPos
            }
        },
        onDblClick() {
            this.$emit('action')
        },
        async setPosition() {
            this.displayItems = await this.itemsSource.getItems(this.startIndex, Math.min(this.startIndex + this.itemsPerPage + 1, this.itemsSource.count))
        },
        end() { this.setCurrentIndex(this.itemsSource.count - 1) },
        pos1() { this.setCurrentIndex(0) },
        upOne() { this.setCurrentIndex(this.index - 1) },
        downOne() { this.setCurrentIndex(this.index + 1) },
        pageDown() {
            this.setCurrentIndex(this.index < this.itemsSource.count - this.itemsPerPage + 1 ? this.index + this.itemsPerPage - 1: this.itemsSource.count - 1)
        },
        pageUp() { this.setCurrentIndex(this.index > this.itemsPerPage - 1 ? this.index - this.itemsPerPage + 1: 0) },
        setCurrentIndex(index) {
            if (index < 0)
                index = 0
            else if (index >= this.itemsSource.count)
                index = this.itemsSource.count - 1
            this.index = index;
            this.scrollIntoView()
        },
        scrollIntoView() {
            if (this.index < this.position)
                this.position = this.index
            if (this.index > this.position + this.itemsPerPage - 1)
                this.position = this.index - this.itemsPerPage + 1
        }, 
        onColumnClick(index, descending, add) {
            this.$emit('column-click', index, descending, add)
        },
        onThemeChanged() {
            if (this.$refs.tbody.childNodes.length > 0) {
                const tr = this.$refs.tbody.childNodes[0]
                this.itemHeight = tr.clientHeight
            }   
            else {
                const observer = new MutationObserver((mutationsList, observer) => {
                    let tr = mutationsList[0].addedNodes[0]
                    this.itemHeight = tr.clientHeight
                    observer.disconnect()
                    this.onResize()
                });
                observer.observe(this.$refs.tbody, { attributes: true, childList: true, subtree: true })
            }
            this.columnsEventBus.$emit("themeChanged")
            this.scrollbarEventBus.$emit("refresh")
            this.onResize()
        } 
    },
    created() {
        window.addEventListener("resize", this.onResize)
    },
    destroyed() {
        window.removeEventListener("resize", this.onResize)
    },
    mounted() {
        const observer = new MutationObserver((mutationsList, observer) => {
            let tr = mutationsList[0].addedNodes[0]
            this.itemHeight = tr.clientHeight
            observer.disconnect()
            this.onResize()
        });
        observer.observe(this.$refs.tbody, { attributes: true, childList: true, subtree: true })

        this.eventBus.$on('focus', this.focus)
        this.eventBus.$on('setCurrentIndex', this.setCurrentIndex)
        this.eventBus.$on('resize', this.onResize)
        this.eventBus.$on('themeChanged', this.onThemeChanged)
        this.onResize()
    }
})
</script>

<style scoped>
.tableview-root {
    flex-grow: 1;    
    position: relative;
    overflow: hidden;
    outline-width: 0px;
    color: var(--tablevue-main-color);
    background-color: var(--tablevue-main-background-color);
}
table {
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    table-layout: fixed;
    border-spacing: 0px;
}
td {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: none;
    transition: padding-right .4s;
}    
.scrollbar td:last-child {
    padding-right: var(--tablevue-right-margin-scrollbar);
}
.table-scrollbar {
    position: absolute;
    right: 0px;
    width: 0px;
}
tr.isCurrent {
    outline-color: lightgray;
    outline-width: 1px;
    outline-style: solid;
    outline-offset: -1px;
}
.tableview-root:focus tr.isCurrent {
    outline-color: var(--tablevue-tr-selected-color);
    outline-width: 1px;
    outline-style: solid;
    outline-offset: -1px;
}
</style>

