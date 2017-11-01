export * from './search-table/search-table.component';
export * from './search-table-mobile/search-table-mobile.component';
export * from './simple-table/simple-table.component';

import { SearchTableComponent } from './search-table/search-table.component';
import { SearchTableMobileComponent } from './search-table-mobile/search-table-mobile.component';
import { SimpleTableComponent } from './simple-table/simple-table.component';

export const BLOCK_SEARCH_TABLE = [
    SearchTableComponent,
    SearchTableMobileComponent,
    SimpleTableComponent
];