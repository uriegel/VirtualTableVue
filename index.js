import TableView from "./TableView.vue"

export default {
    install: function(Vue, options) {
        // Let's register our component globally
        // https://vuejs.org/v2/guide/components-registration.html
        Vue.component("table-view", TableView)
    }
}

export function showDialog(test) {
    alert(test)
}
