export * from './kmb-conversion/kmb-conversion.pipe';
export * from './comma-conversion/comma-conversion.pipe';
export * from './group-by/group-by.pipe';

import { KmbConversionPipe } from './kmb-conversion/kmb-conversion.pipe';
import { CommaConversionPipe } from './comma-conversion/comma-conversion.pipe';
import { GroupByPipe } from './group-by/group-by.pipe';

export const BLOCK_PIPES = [
    KmbConversionPipe,
    CommaConversionPipe,
    GroupByPipe
];
