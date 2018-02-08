export * from './e-401/e-401.component';
export * from './e-500/e-500.component';
export * from './e-403/e-403.component';
export * from './no-access/no-access.component';


import { E401Component } from './e-401/e-401.component';
import { E500Component } from './e-500/e-500.component';
import { E403Component } from './e-403/e-403.component';
import { NoAccessComponent } from './no-access/no-access.component';

export const BLOCK_ERRORS = [ E401Component, E500Component, E403Component, NoAccessComponent ];