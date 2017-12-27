export * from './e-401/e-401.component';
export * from './no-access/no-access.component';


import { E401Component } from './e-401/e-401.component';
import { NoAccessComponent } from './no-access/no-access.component';

export const BLOCK_ERRORS = [ E401Component, NoAccessComponent];