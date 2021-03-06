<template>
    <thead>
        <tr ref='tr' :class="{'pointer-ew': draggingReady }">
            <th v-for="(column, index) in columns" :key="column.name" @mousemove='onMouseMove' @mousedown='onMouseDown' @dblclick.stop='() => {}'>
                <div class="col" :class="{'is-sortable': column.isClickable, 'subItem': column.subItem}" @click='onSlotClick(column, index)'>
                    <slot :name="'col' + index"></slot>
                    <div class="maincol" @click='onClick(column)' v-if="column.name"
                        :class="{'is-sortable': column.isSortable, 'sort-ascending': column.sortAscending, 'sort-descending': column.sortDescending}">{{column.name}}
                    </div>
                    <div @click='onSubItemClick(column)' :class="{ 'is-sortable': column.subItem, 'sort-ascending': column.sortSubItemAscending, 'sort-descending': column.sortSubItemDescending	
                        }">{{column.subItem}}	
                    </div>                    
                </div>                        
            </th>
        </tr>
    </thead>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
    props: {
        columns: {},
        eventBus: { type: Object, default: () => new Vue() },        
    },
    watch: {
        columns: {
            immediate: true,
            handler (newVal, oldVal) {
                if (oldVal != newVal)
                    Vue.nextTick(() => {
                        const ths = Array.from((this.$refs.tr).children) 
                        ths.forEach((th, i) => (th.style.width) = this.columns[i].width || (100 / this.columns.length) + '%')
                    })
            }
        }
    },
    data() {
        return {
            draggingReady: false
        }
    },
    methods: {
        onMouseMove: function (evt) {
            const th = evt.target
            if (th.nodeName == "TH") {
                const thWidth = th.clientWidth + th.clientLeft
                const mouseX = evt.offsetX + th.clientLeft
                const trRect = (this.$refs.tr).getBoundingClientRect()
                const absoluteRight = trRect.width + trRect.x
                this.draggingReady = (mouseX < 3 || mouseX > thWidth - 4) 
                    && (evt.pageX - trRect.x > 4)
                    && (evt.pageX < absoluteRight - 4)
            }
            else
                this.draggingReady = false
        },
        onMouseDown: function (evt) {
            if (this.draggingReady) {
                const th = evt.target
                const mouseX = evt.offsetX + th.clientLeft
                const dragleft = mouseX < 3

                const startDragPosition = evt.pageX
                const targetColumn = evt.target.closest("th")

                const currentHeader = dragleft ? targetColumn.previousElementSibling : targetColumn
                const nextHeader = currentHeader.nextElementSibling

                const currentLeftWidth = currentHeader.offsetWidth
                const sumWidth = currentLeftWidth + nextHeader.offsetWidth

                const onmove = (evt) => {
                    document.body.style.cursor = 'ew-resize'
                    let diff = evt.pageX - startDragPosition
                    if (currentLeftWidth + diff < 15)
                        diff = 15 - currentLeftWidth
                    else if (diff > sumWidth - currentLeftWidth - 15)
                        diff = sumWidth - currentLeftWidth - 15

                    const getCombinedWidth = (column, nextColumn) => {
                        const firstWidth = 
                            column.style.width
                            ? parseFloat(column.style.width.substr(0, column.style.width.length - 1))
                            : 100 / this.columns.length
                        const secondWidth = 
                            nextColumn.style.width
                            ? parseFloat(nextColumn.style.width.substr(0, nextColumn.style.width.length - 1))
                            : 100 / this.columns.length
                        return firstWidth + secondWidth
                    }                        

                    const combinedWidth = getCombinedWidth(currentHeader, nextHeader)

                    let leftWidth = currentLeftWidth + diff
                    let rightWidth = sumWidth - currentLeftWidth - diff
                    const factor = combinedWidth / sumWidth
                    leftWidth = leftWidth * factor
                    rightWidth = rightWidth * factor

                    currentHeader.style.width = leftWidth + '%'
                    nextHeader.style.width = rightWidth + '%'
                    evt.preventDefault()
                }

                const onup = () => {
                    const getWidths = () => {
                        const ths = Array.from((this.$refs.tr).children) 
                        return ths.map(th => {
                            let width = th.style.width
                            if (!width)
                                width = (100 / this.columns.length) + '%'
                            return width
                        })
                    }

                    window.removeEventListener('mousemove', onmove)
                    window.removeEventListener('mouseup', onup)
                    ;(document.body.style.cursor) = null
                    this.$emit('on-columns-widths-changed', getWidths())
                }

                window.addEventListener('mousemove', onmove)
                window.addEventListener('mouseup', onup)
                evt.preventDefault()
                evt.stopPropagation()
            }
        },
        onClick: function (column) {
            if (!this.draggingReady) {
                const index = this.columns.findIndex(n => n == column)
                if (column.isSortable) {
                    const descending = column.sortAscending == true
                    this.columns.forEach(n => {
                        this.$set(n, 'sortAscending', false)
                        this.$set(n, 'sortDescending', false)
                        this.$set(n, 'sortSubItemAscending', false)
                        this.$set(n, 'sortSubItemDescending', false)
                    })
                    if (descending)
                        this.$set(column, 'sortDescending', true)
                    else
                        this.$set(column, 'sortAscending', true)
                    this.$emit('on-column-click', index, descending, false)
                }
            }
        },
        onSlotClick: function(column, index) {
            if (column.isClickable)
                this.$emit('on-column-click', index)
        },
        onSubItemClick: function (column) {
            if (!this.draggingReady && column.subItem) {
                const descending = column.sortSubItemAscending == true
                this.columns.forEach(n => {
                    this.$set(n, 'sortAscending', false)
                    this.$set(n, 'sortDescending', false)
                    this.$set(n, 'sortSubItemAscending', false)
                    this.$set(n, 'sortSubItemDescending', false)
                })
                if (descending)
                    this.$set(column, 'sortSubItemDescending', true)
                else
                    this.$set(column, 'sortSubItemAscending', true)
                const index = this.columns.findIndex(n => n == column)
                this.$emit('on-column-click', index, descending, true)
            }
        } 
    },
    mounted() {
        this.eventBus.$on('themeChanged', () => this.$emit('onColumnHeight', this.$el.getBoundingClientRect().height))
        this.$emit('onColumnHeight', this.$el.getBoundingClientRect().height)
    }
})
</script>

<style scoped>
    th .col div {
        text-overflow: ellipsis;
    }
    tr th {
        overflow: hidden;
        white-space: nowrap;
        user-select: none;
        text-align: left;
        font-weight: normal;
        color: var(--tablevue-selected-color);
        background-color: var(--tablevue-selected-background-color);        
        border-left-color: var(--tablevue-columns-separator-color);
        border-left-style: solid;
        border-left-width: 1px;
    }

    tr th:first-child {
        border-left-width: 0px;
    }

    tr.pointer-ew {
        cursor: ew-resize;
    }
    .is-sortable {
        background-color: var(--tablevue-selected-background-color);
        transition: background-color 0.3s; 
    }
    .is-sortable:hover {
        background-color: var(--tablevue-selected-background-hover-color);
    }
    .subItem {
        display: flex;
        flex-direction: row;
    }
    .maincol {
        flex-grow: 1;
        padding-left: 5px;            
        overflow: hidden;    
    }
    .sort-ascending:before {
        position: relative;
        bottom: 11px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 6px solid var(--tablevue-selected-color);
        content: '';
        margin-right: 5px;
    }
    .sort-descending:before {
        position: relative;
        top: 10px;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 6px solid var(--tablevue-selected-color);
        content: '';
        margin-right: 5px;
    }
    .colimg {
        width: 16px;
        height: 16px;
    }
</style>
