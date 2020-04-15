<template>
    <svg class="svg" viewBox="0 0 100 100" @mousedown.stop="upMouseDown" @mouseleave="mouseleave" @mouseup="mouseup">
        <path class="button" :class="{ 'hidden': down }" style="fill-opacity:1;stroke:none;:none;" d="M 20,70 50,30 80,70 Z" />
        <path class="button" :class="{ 'hidden': !down }" style="fill-opacity:1;stroke:none;:none;" d="M 80,30 50,70 20,30 Z" />
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
            const mouseUp = () => this.$emit('click')
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
    display: var(--tablevue-scrollbar-button-display);
    width: 100%;
    background-color: var(--tablevue-scrollbar-button-background-color);
    transition: background-color 0.3s;
}
.svg:hover {
    background-color: var(--tablevue-scrollbar-button-hover-background-color);
}
.svg:active {
    background-color: var(--tablevue-scrollbar-button-active-background-color);
    cursor: default;
}
.button {
    fill: var(--tablevue-scrollbar-button-color); 
}
.svg:hover .button {
    fill: var(--tablevue-scrollbar-button-hover-color); 
}
.svg:active .button {
    fill: var(--tablevue-scrollbar-button-active-color); 
}
.hidden {
    display: none;
}

</style>
