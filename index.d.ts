declare module 'virtual-table-vue' {
    import { PluginFunction } from "vue"
    export const install: PluginFunction<{}>
    export const showDialog: (test: string)=>void

    interface Column {
        name: string
        isSortable?: boolean
        sortAscending?: boolean
        columnsType?: number
        width?: number | string
    }
    
    interface TableViewItem {
        index: number
    }
        
    interface ItemsSource {
        count: number,
        getItems: (startRange: number, endRange: number) => Promise<TableViewItem[]>
        indexToSelect: number | undefined
    } 
}