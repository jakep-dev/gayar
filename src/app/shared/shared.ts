export * from './tile/tile.component';
export * from './loading/cube/cube.component';

import { TileComponent } from './tile/tile.component';
import { CubeComponent } from './loading/cube/cube.component';

export const BLOCK_SHARED = [
    TileComponent,
    CubeComponent
];