<template>
    <transition name="slide">
        <div v-show="range > 1" class="scrollbar-container" 
                @mousedown="pageMouseDown" @mouseleave="mouseleave" @mouseup="mouseup">
            <triangle></triangle>
            <div class="scrollbar">
                <div class="scrollbarGrip" @mousedown.stop="gripMouseDown" @mouseup="mouseup"
                    v-bind:style="{ height: gripHeight + 'px', top: gripTop + 'px' }">
                </div>
            </div>
            <!-- <div class="scrollbarDown" @mousedown.stop="downMouseDown" @mouseleave="mouseleave" @mouseup="mouseup">
                <div class="scrollbarDownImg"></div>
            </div> -->
            <triangle :down=true></triangle>
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
        value: Number,
        totalCount: Number,
        itemsPerPage: Number,
        parentHeight: Number
    },
    data() {
        return {
            position: 0,
            timer: undefined,
            interval: undefined
        }
    },
    watch: {
        parentHeight: function () {
            this.setPosition(Math.min(this.range -1, this.position))
        },
        value: function (newVal) {
            this.position = newVal
        },
        totalCount: function () {
        //    this.setPosition(0)
        }
    },
    computed: {
        range() {
            return Math.max(0, this.totalCount - this.itemsPerPage) + 1
        },
        gripHeight() {
            var gripHeight = (this.parentHeight - 32) * (this.itemsPerPage / this.totalCount)
            if (gripHeight < 5)
                gripHeight = 5
            return gripHeight
        },
        gripTop() {
            return (this.parentHeight - this.gripHeight) * (this.position / (this.range -1))
        }
    }, 
    methods: {
        upMouseDown: function () {
            const mouseUp = () => this.setPosition(Math.max(0, this.position - 1))
            mouseUp()
            this.timer = setTimeout(() => this.interval = setInterval(mouseUp, 10), 600)
        },
        downMouseDown: function () {
            const mouseDown = () => this.setPosition(Math.min(this.range -1, this.position + 1))
            mouseDown()
            this.timer = setTimeout(() => this.interval = setInterval(mouseDown, 10), 600)

        },
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
            const range = this.parentHeight - this.gripHeight
            const maxPosition = this.totalCount - this.itemsPerPage
            const onmove = (evt) => {
                const delta = evt.y - startPos
                const factor = Math.min(1, (Math.max(0, delta * 1.0 / range)))
                this.setPosition(Math.floor(factor * maxPosition))
            }
            const onup = () => {
                window.removeEventListener('mousemove', onmove)
                window.removeEventListener('mouseup', onup)
            }
            window.addEventListener('mousemove', onmove)
            window.addEventListener('mouseup', onup)
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
        }
    }
})
</script>

<style scoped>
.scrollbar-container {
    position: absolute;
    height: 100%;
    width: 16px; 
    overflow: hidden;
    box-sizing: border-box;
    background-color: var(--tablevue-main-background-color);
    right: 0px;
    border-style: solid;
    border-color: var(--tablevue-scrollbar-border-color);
    border-width: 1px;
    user-select: none;
    display: flex;
    flex-direction: column;    
}
.scrollbar {
    flex-grow: 1;
    position: relative;
}

.slide-enter-active, .slide-leave-active {
    transition: width 0.4s, height 0.4s, opacity 0.4s;
}
.slide-enter, .slide-leave-to {
    opacity: 0;
    width: 0px;
    height: 0px;
}

.scrollbarUp {
    position: absolute;
    box-sizing: border-box;
    background-color: var(--tablevue-main-background-color);
    width: 100%;
    height: 15px;
    transition: background-color 0.5s;
}

.scrollbarUp:hover, .scrollbarDown:hover {
    background-color: var(--tablevue-scrollbar-grip-color);
}

.scrollbarUp:active, .scrollbarDown:active {
    background-color: var(--tablevue-scrollbar-button-active-color);
    cursor: default;
}

.scrollbarUp:active .scrollbarUpImg, .scrollbarDown:active .scrollbarDownImg {
    border-bottom-color: var(--tablevue-scrollbar-border-active-color);
    border-top-color: var(--tablevue-scrollbar-border-active-color);
}

.scrollbarUpImg {
    position: absolute;
    top: 4px;
    left: 3px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 6px solid var(--tablevue-scrollbar-image-color);
}

.scrollbarDown {
    position: absolute;
    box-sizing: border-box;
    background-color: var(--tablevue-main-background-color);
    width: 100%;
    bottom: 0px;
    height: 15px;
    transition: background-color 0.5s;
}

.scrollbarDownImg {
    position: absolute;
    top: 4px;
    left: 3px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 6px solid var(--tablevue-scrollbar-image-color);
}

.scrollbarGrip {
    position: absolute;
    box-sizing: border-box;
    background-color: var(--tablevue-scrollbar-grip-color);
    top: 15px;
    width: 100%;
    height: 28px;
    transition: background-color 0.5s;
}

.scrollbarGrip:hover {
    background-color: var(--tablevue-scrollbar-grip-hover-color);
}

.scrollbarGrip:active {
    background-color: var(--tablevue-scrollbar-grip-active-color);
    transition: background-color 0s;
}

</style>
