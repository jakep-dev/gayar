export * from './tile/tile.component';
export * from './tile/blank/blank.component';
export * from './loading/cube/cube.component';
export * from './errors/errors';
export * from './behavior/behaviors';
export * from './charts/charts';
export * from './constraints/constraints';
export * from './tables/tables'
export * from './blocks/blocks';
export * from './components/components';


import { TileComponent } from './tile/tile.component';
import { BlankComponent } from './tile/blank/blank.component';
import { CubeComponent } from './loading/cube/cube.component';
import { BLOCK_ERRORS  } from './errors/errors';
import { BLOCK_CHART_BEHAVIORS } from './behavior/behaviors';
import { BLOCK_CHART_TYPES } from './charts/charts';
import { BLOCK_CONSTRAINTS } from './constraints/constraints';
import { BLOCK_SEARCH_TABLE } from './tables/tables'
import { SHARED_BLOCKS } from './blocks/blocks';
import { BLOCK_UTIL } from './util/util';
import { BLOCK_COMPONENTS } from './components/components';


export const BLOCK_SHARED = [
    TileComponent,
    BlankComponent,
    CubeComponent,
    BLOCK_ERRORS,
    BLOCK_CHART_BEHAVIORS,
    BLOCK_CHART_TYPES,
    BLOCK_CONSTRAINTS,
    BLOCK_SEARCH_TABLE,
    BLOCK_UTIL,
    BLOCK_COMPONENTS
];

export const BLOCK_SHARED_SERVICE = [
    SHARED_BLOCKS
]
