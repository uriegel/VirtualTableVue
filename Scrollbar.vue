<template>
    <transition name="slide">
        <div v-show="range > 1" class="scrollbar-container" 
                @mousedown="pageMouseDown" @mouseleave="mouseleave" @mouseup="mouseup">
            <triangle @click="onUpClick"></triangle>
            <div class="scrollbar" ref="scrollbar">
                <div class="scrollbarGrip" ref="grip" @mousedown.stop="gripMouseDown" @mouseup="mouseup"
                    v-bind:style="{ height: gripHeight + 'px', top: gripTop + 'px' }">
                </div>
            </div>
            <triangle :down=true @click="onDownClick"></triangle>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue'
import Triangle from './triangle.vue'

export default Vue.extend({
    components: {
        Triangle
    },    
    props: {
        eventBus: { type: Object, default: () => new Vue() },
        value: Number,
        totalCount: Number,
        itemsPerPage: Number,
        parentHeight: Number
    },
    data() {
        return {
            position: 0,
            scrollbarHeight: 0,
            timer: undefined,
            interval: undefined
        }
    },
    watch: {
        parentHeight: function () {
            this.refresh()
        },
        value: function (newVal) {
            this.position = newVal
        },
        totalCount: function () {
        //    this.setPosition(0)
        }
    },
    mounted() {
        this.eventBus.$on('refresh', () => this.refresh())
    },
    computed: {
        range() {
            const range = Math.max(0, this.totalCount - this.itemsPerPage) + 1
            if (range > 1 && this.scrollbarHeight == 0) 
                this.refresh()
            return range
        },
        gripHeight() {
            var gripHeight = this.scrollbarHeight * (this.itemsPerPage / this.totalCount)
            if (gripHeight < 5)
                gripHeight = 5
            return gripHeight
        },
        gripTop() {
            return (this.scrollbarHeight - this.gripHeight) * (this.position / (this.range -1))
        }
    }, 
    methods: {
        onUpClick() { this.setPosition(Math.max(0, this.position - 1)) },
        onDownClick() { this.setPosition(Math.min(this.range -1, this.position + 1)) },
        pageMouseDown: function (evt) {
            let up = evt.offsetY <= this.gripTop 
            const page = () => {
                if ((evt.offsetY > this.gripTop && evt.offsetY < this.gripTop + this.gripHeight)
                        || up ? evt.offsetY > this.gripTop : evt.offsetY < this.gripTop + this.gripHeight) {
                    this.mouseup()
                    return
                }
                    
                this.setPosition(evt.offsetY <= this.gripTop
                    ? Math.max(0, this.position - this.itemsPerPage + 1)
                    : Math.min(this.range -1, this.position + this.itemsPerPage - 1)
                )
            }
            page()
            this.timer = setTimeout(() => this.interval = setInterval(page, 50), 600)
        },
        gripMouseDown: function (evt) {
            const startPos = evt.y - this.gripTop
            const range = this.scrollbarHeight - this.gripHeight
            const maxPosition = this.totalCount - this.itemsPerPage
            const onmove = (evt) => {
                const delta = evt.y - startPos
                const factor = Math.min(1, (Math.max(0, delta * 1.0 / range)))
                this.setPosition(Math.floor(factor * maxPosition))
                evt.preventDefault()
                evt.stopPropagation()
            }
            const onup = () => {
                window.removeEventListener('mousemove', onmove, true)
                window.removeEventListener('mouseup', onup, true)
            }
            window.addEventListener('mousemove', onmove, true)
            window.addEventListener('mouseup', onup, true)
            evt.preventDefault()
            evt.stopPropagation()
        },
        mouseup() {
            clearTimeout(this.timer)
            clearInterval(this.interval)
        },
        mouseleave() {
            clearTimeout(this.timer)
            clearInterval(this.interval)
        },
        setPosition(position) {
            this.position = position
            this.$emit('input', this.position)
        },
        refresh() {
            setTimeout(() => {
                this.scrollbarHeight = this.$refs.scrollbar.clientHeight 
                this.setPosition(Math.min(this.range -1, this.position))
            }, 200)            
        }
    }
})
</script>

<style scoped>
.scrollbar-container {
    position: absolute;
    height: 100%;
    width: var(--tablevue-scrollbar-width); 
    overflow: hidden;
    box-sizing: border-box;
    right: 0px;
    border-style: solid;
    border-color: var(--tablevue-scrollbar-border-color);
    border-width: var(--tablevue-scrollbar-border-width);
    user-select: none;
    display: flex;
    flex-direction: column;    
}
.scrollbar {
    background-color: var(--tablevue-scrollbar-background-color);
    transition: background-color 0.5s;
    flex-grow: 1;
    position: relative;
}

.scrollbar:hover {
    background-color: var(--tablevue-scrollbar-background-hover-color);
}

.scrollbar:active {
    background-color: var(--tablevue-scrollbar-background-hover-color);
}

.slide-enter-active, .slide-leave-active {
    transform-origin: right top;
    transition: transform 0.4s, opacity 0.4s;
}
.slide-enter, .slide-leave-to {
    opacity: 0;
    transform: scale(0);
}

.scrollbarGrip {
    position: absolute;
    box-sizing: border-box;
    border-radius: var(--tablevue-scrollbar-grip-radius);
    background-color: var(--tablevue-scrollbar-grip-color);
    top: 15px;
    width: var(--tablevue-scrollbar-grip-width);
    right: var(--tablevue-scrollbar-grip-right);
    height: 28px;
    transition: background-color 0.5s, width 0.5s;
}

.scrollbar:hover .scrollbarGrip {
    width: 100%;
}

.scrollbar:active .scrollbarGrip {
    width: 100%;
}

.scrollbarGrip:hover {
    background-color: var(--tablevue-scrollbar-grip-hover-color);
}

.scrollbarGrip:active {
    background-color: var(--tablevue-scrollbar-grip-active-color);
    transition: background-color 0s;
}

</style>
