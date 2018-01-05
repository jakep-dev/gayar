export * from './e-401/e-401.component';
export * from './e-500/e-500.component';


import { E401Component } from './e-401/e-401.component';
import { E500Component } from './e-500/e-500.component';

export const BLOCK_ERRORS = [ E401Component, E500Component ];