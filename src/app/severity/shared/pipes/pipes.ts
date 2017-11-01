export * from './kmb-conversion/kmb-conversion.pipe';
export * from './comma-conversion/comma-conversion.pipe';

import { KmbConversionPipe } from './kmb-conversion/kmb-conversion.pipe';
import { CommaConversionPipe } from './comma-conversion/comma-conversion.pipe';

export const BLOCK_PIPES = [
    KmbConversionPipe,
    CommaConversionPipe
];
