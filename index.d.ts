declare module 'virtual-table-vue' {
    import { PluginFunction } from "vue"
    export const install: PluginFunction<{}>

    interface Column {
        name: string
        isSortable?: boolean
        sortAscending?: boolean
        columnsType?: number
        width?: number | string
    }
    
    interface TableViewItem {
        isCurrent?: boolean
        index: number
    }
        
    interface ItemsSource {
        count: number,
        getItems: (startRange: number, endRamge: number) => Promise<TableViewItem[]>
    } 
}