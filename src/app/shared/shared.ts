export * from './tile/tile.component';
export * from './loading/cube/cube.component';
export * from './errors/errors';

import { TileComponent } from './tile/tile.component';
import { CubeComponent } from './loading/cube/cube.component';
import { BLOCK_ERRORS  } from './errors/errors';


export const BLOCK_SHARED = [
    TileComponent,
    CubeComponent,
    BLOCK_ERRORS
];
