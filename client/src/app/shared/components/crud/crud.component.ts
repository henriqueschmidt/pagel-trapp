import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CrudTableColumnInterface, CrudTableInterface, TableComponent,} from '../table/table.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import {Base, CrudService} from "../../models/crud-service.model";
import {PermissionsService} from "../../../auth/services/permissions.service";

export interface ManageData {
    action: string;
    id: number | null;
    page: string;
    deParaId?: number;
}

@Component({ template: '' })
export abstract class CrudComponent<T extends CrudService> implements OnInit {
    @Input() link!: string;
    @Input() title!: string;
    @Input() manageComponent!: any;
    @Input() displayNew: boolean = true;
    @Input() displayCustomFilters: boolean = false;
    @Input() crudContext!: Map<string, string>;
    @Input() columns!: CrudTableColumnInterface[];
    @Input() customParams: { key: string; value: any }[] = [];
    @ViewChild(TableComponent) tableComponent!: TableComponent;

    isArchived: boolean = false;
    default_columns: CrudTableColumnInterface[] = [
        {
            id: 'id',
            title: 'ID',
            value: 'id',
        },
        // {
        //     id: 'dataHoraCriacao',
        //     title: 'Data de criação',
        //     value: 'dataHoraCriacao',
        // },
    ];
    table_config!: CrudTableInterface;
    public crudService!: T;
    page: string = '';
    dialogRef!: MatDialogRef<any>;

    constructor(
        public route: ActivatedRoute,
        public router: Router,
        public dialog: MatDialog,
        public permissionsService: PermissionsService
    ) {}

    setCrudService(crudService: T) {
        this.crudService = crudService;
    }

    ngOnInit(): void {
        this.setTableConfigs();
        this.checkForAction();
    }

    setTableConfigs() {
        if (!this.columns) return;
        const columns: CrudTableColumnInterface[] = [];
        this.default_columns.forEach(column => {
            if (column.id === 'id') {
                if (this.columns.filter(z => z.id === 'id').length == 0) {
                    columns.push(column)
                }
            }
        });
        this.columns.forEach(column => columns.push(column));

        this.table_config = {
            url: this.link,
            pageSize: 15,
            hasFilter: true,
            columns: columns,
            service: this.crudService,
            title: this.title,
            pageSizeOptions: [5, 10, 15, 20, 25],
            actionFunction: (data: Base) => {
                const actions = [
                    {
                        icon: 'visibility',
                        tooltip: 'Ver',
                        onClick: () =>
                            this.openDialog('view', this.page, data.id),
                        disabled: false,
                    },
                    {
                        icon: 'edit',
                        tooltip: 'Editar',
                        onClick: () =>
                            this.openDialog('edit', this.page, data.id),
                        disabled: false,
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Remover',
                        onClick: () =>
                            this.crudService
                                .delete(this.link.substring(1), data.id)
                                .subscribe(() => this.reload()),
                        disabled: false,
                    },
                ];

                if (this.permissionsService.hasPerfil('colaboradora')) {
                    actions.pop();
                }

                return actions;
            },
        };
    }

    checkForAction() {
        if (this.route.children.length > 0) {
            this.route.children[0].params.subscribe((params: any) => {
                if (params['status'] === 'novo') {
                    this.openDialog('new', this.page);
                }

                if (
                    params['status'] === 'editar' ||
                    params['status'] === 'ver'
                ) {
                    this.openDialog(
                        params['status'] === 'editar' ? 'edit' : 'view',
                        this.page,
                        params['id']
                    );
                }
            });
        }
    }

    openDialog(action: string, page: string, id: number | null = null) {
        const data: ManageData = {
            action,
            page,
            id,
        };

        if (action === 'view')
            this.router.navigate([`/${this.link}/ver/${id}`]);
        if (action === 'edit')
            this.router.navigate([`/${this.link}/editar/${id}`]);

        this.dialogRef = this.dialog.open(this.manageComponent, {
            panelClass: 'dialog-full-width',
            data,
        });

        this.dialogRef.afterClosed().subscribe(() => {
            this.router.navigate([`/${this.link}`]);
            this.reload();
        });
    }

    reload() {
        this.tableComponent.request();
    }
}
