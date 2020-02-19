declare module 'virtual-table-view' {
    import { PluginFunction } from "vue"
    export const install: PluginFunction<{}>

    export interface Column {
        name: string
        isSortable?: boolean
        sortAscending?: boolean
        columnsType?: number
        width?: number | string
    }
    
    export interface TableViewItem {
        isCurrent?: boolean
        index: number
    }
        
    export interface ItemsSource {
        count: number,
        getItems: (startRange: number, endRamge: number) => Promise<TableViewItem[]>
    } 
}