import { Injectable } from '@angular/core';
import { DialogMessageComponent } from '../components/dialog-message/dialog-message.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

interface ISize {
    width: string | undefined;
    height: string | undefined;
    minWidth: string | undefined;
    minHeight: string | undefined;
}

interface ISizes {
    [key: string]: ISize;
}

@Injectable({
    providedIn: 'root',
})
export class DialogMessageService {
    constructor(public dialog: MatDialog) {}

    /**
     * Display a success dialog message
     *
     * @param message - expected message to display on dialog
     * @param resolve_buttons - expected an array with name of buttons
     * @param rejected_buttons expected an array with name of buttons
     * @param size - expected size of dialog
     * @returns dialog promise
     * */
    success(
        message: string,
        resolve_buttons: string[] = [],
        rejected_buttons: string[] = [],
        size: string = 'small'
    ) {
        return this.generateMessage(
            message,
            size,
            'success',
            resolve_buttons,
            rejected_buttons
        );
    }

    /**
     * Display an error dialog message
     *
     * @param message - expected message to display on dialog
     * @param resolve_buttons - expected an array with name of buttons
     * @param rejected_buttons expected an array with name of buttons
     * @param size - expected size of dialog
     * @param title
     * @returns dialog promise
     * */
    error(
        message: string,
        resolve_buttons: string[] = [],
        rejected_buttons: string[] = [],
        size: string = 'small',
        title?: string
    ) {
        return this.generateMessage(
            message,
            size,
            'error',
            resolve_buttons,
            rejected_buttons,
            title
        );
    }

    /**
     * Display a warning dialog message
     *
     * @param message - expected message to display on dialog
     * @param resolve_buttons - expected an array with name of buttons
     * @param rejected_buttons expected an array with name of buttons
     * @param size - expected size of dialog
     * @returns dialog promise
     * */
    warning(
        message: string,
        resolve_buttons: string[] = [],
        rejected_buttons: string[] = [],
        size: string = 'small'
    ) {
        return this.generateMessage(
            message,
            size,
            'warning',
            resolve_buttons,
            rejected_buttons
        );
    }

    /**
     * Display an info dialog message
     *
     * @param message - expected message to display on dialog
     * @param resolve_buttons - expected an array with name of buttons
     * @param rejected_buttons expected an array with name of buttons
     * @param size - expected size of dialog
     * @returns dialog promise
     * */
    info(
        message: string,
        resolve_buttons: string[] = [],
        rejected_buttons: string[] = [],
        size: string = 'small'
    ) {
        return this.generateMessage(
            message,
            size,
            'info',
            resolve_buttons,
            rejected_buttons
        );
    }

    /**
     * Generate a dialog
     *
     * @param message - expected message to display on dialog
     * @param type
     * @param resolve_buttons - expected an array with name of buttons
     * @param rejected_buttons expected an array with name of buttons
     * @param size - expected size of dialog
     * @param title
     * @returns dialog action promise
     * */
    generateMessage(
        message: string,
        size: string,
        type: string,
        resolve_buttons: string[],
        rejected_buttons: string[],
        title?: string
    ) {
        const { width, height, minHeight, minWidth } = this.getSize(size);

        const configs: MatDialogConfig = {
            width,
            height,
            minHeight,
            minWidth,
            data: {
                title,
                type,
                message,
                resolve_buttons,
                rejected_buttons,
            },
        };
        const dialog = this.dialog.open(DialogMessageComponent, configs);

        return new Promise((res, rej) => {
            dialog.backdropClick().subscribe(() => res('backdrop'));
            dialog.afterClosed().subscribe(result => {
                if (rejected_buttons.includes(result)) {
                    rej(result);
                } else {
                    res(result);
                }
            });
        });
    }

    /**
     * Returns the width and height of dialog.
     *
     * @param size - expected size configuration
     * @returns the object with width, min width, height and min height
     * */
    getSize(size: string = 'small'): ISize {
        const sizes: ISizes = {
            small: {
                width: '25%',
                height: '35%',
                minWidth: '450px',
                minHeight: '350px',
            },
            medium: {
                width: '30%',
                height: '45%',
                minWidth: '450px',
                minHeight: '350px',
            },
            large: {
                width: '40%',
                height: '55%',
                minWidth: '450px',
                minHeight: '350px',
            },
            full: {
                width: '100vw',
                height: '100vh',
                minWidth: '100%',
                minHeight: '100%',
            },
        };

        return sizes[size];
    }
}
