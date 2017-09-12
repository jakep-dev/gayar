export * from './snack-bar/snack-bar.service';
export * from './dialog/dialog.service';

import { SnackBarService } from './snack-bar/snack-bar.service';
import { DialogService } from './dialog/dialog.service';

export const SHARED_BLOCKS = [ 
    SnackBarService,
    DialogService
 ];