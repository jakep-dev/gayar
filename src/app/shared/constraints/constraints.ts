export * from './highlight.directive';
export * from './number.directive';
export * from './float.directive';
export * from './kmb-conversion.directive';

import { HighlightDirective } from './highlight.directive';
import { NumberDirective } from './number.directive';
import { KmbConversionDirective } from './kmb-conversion.directive';
import { FloatDirective } from './float.directive';

export const BLOCK_CONSTRAINTS = [
    HighlightDirective, 
    NumberDirective,
    KmbConversionDirective,
    FloatDirective
];