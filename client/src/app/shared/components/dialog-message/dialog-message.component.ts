import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
    type: string;
    title?: string;
    message: string;
    resolve_buttons: string[];
    rejected_buttons: string[];
    is_custom_html?: boolean;
}

@Component({
    selector: 'app-dialog-message',
    templateUrl: './dialog-message.component.html',
    styleUrls: ['./dialog-message.component.scss'],
})
export class DialogMessageComponent implements OnInit {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {}

    ngOnInit() {
        if (this.data.type === 'error' && !this.data.title)
            this.data.title = 'Erro!'
        if (this.data.type === 'success' && !this.data.title)
            this.data.title = 'Sucesso'
        if (this.data.type === 'warning' && !this.data.title)
            this.data.title = 'Voce tem certeza?'
    }
}
