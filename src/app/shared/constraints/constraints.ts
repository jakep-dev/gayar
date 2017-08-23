export * from './highlight.directive';
export * from './number.directive';

import { HighlightDirective } from './highlight.directive';
import { NumberDirective } from './number.directive';

export const BLOCK_CONSTRAINTS = [
    HighlightDirective, 
    NumberDirective
];