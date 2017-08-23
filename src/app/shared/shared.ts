export * from './tile/tile.component';
export * from './loading/cube/cube.component';
export * from './errors/errors';
export * from './behavior/behaviors';
export * from './charts/charts';
export * from './constraints/constraints';

import { TileComponent } from './tile/tile.component';
import { CubeComponent } from './loading/cube/cube.component';
import { BLOCK_ERRORS  } from './errors/errors';
import { BLOCK_CHART_BEHAVIORS } from './behavior/behaviors';
import { BLOCK_CHART_TYPES } from './charts/charts';
import { BLOCK_CONSTRAINTS } from './constraints/constraints';

export const BLOCK_SHARED = [
    TileComponent,
    CubeComponent,
    BLOCK_ERRORS,
    BLOCK_CHART_BEHAVIORS,
    BLOCK_CHART_TYPES,
    BLOCK_CONSTRAINTS
];
