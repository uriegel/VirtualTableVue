<template>
    <svg class="svg" viewBox="0 0 100 100" @mousedown.stop="upMouseDown" @mouseleave="mouseleave" @mouseup="mouseup">
        <path :class="{ 'hidden': down }" style="fill:#666;fill-opacity:1;stroke:none;:none;" d="M 20,70 50,30 80,70 Z" />
        <path :class="{ 'hidden': !down }" style="fill:#666;fill-opacity:1;stroke:none;:none;" d="M 80,30 50,70 20,30 Z" />
    </svg>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
    props: {
        down: Boolean
    },
    methods: {
        upMouseDown: function () {
            //const mouseUp = () => this.setPosition(Math.max(0, this.position - 1))
            const mouseUp = () => console.log("MausAb")
            mouseUp()
            this.timer = setTimeout(() => this.interval = setInterval(mouseUp, 10), 600)
        },
        mouseup() {
            clearTimeout(this.timer)
            clearInterval(this.interval)
        },
        mouseleave() {
            clearTimeout(this.timer)
            clearInterval(this.interval)
        },
    }
})
</script>

<style scoped>
.svg {
    width: 100%;
    background-color: var(--tablevue-main-background-color);
    transition: background-color 0.5s;
}
.svg:hover {
    background-color: var(--tablevue-scrollbar-grip-color);
}
.hidden {
    display: none;
}
.svg:active {
    background-color: var(--tablevue-scrollbar-button-active-color);
    cursor: default;
}

</style>
