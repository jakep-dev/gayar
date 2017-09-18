export * from './highlight/highlight.directive';
export * from './number/number.directive';
export * from './float/float.directive';
export * from './kmb-conversion/kmb-conversion.directive';

import { HighlightDirective } from './highlight/highlight.directive';
import { NumberDirective } from './number/number.directive';
import { KmbConversionDirective } from './kmb-conversion/kmb-conversion.directive';
import { FloatDirective } from './float/float.directive';

export const BLOCK_CONSTRAINTS = [
    HighlightDirective, 
    NumberDirective,
    KmbConversionDirective,
    FloatDirective
];