import {
    Component,
    InjectionToken,
    Injector,
    Input,
    OnChanges,
    OnInit,
    PipeTransform,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { debounceTime, Subject } from 'rxjs';
import {Direction, Pageable} from "../../models/table.model";

export interface Action {
    icon: string;
    tooltip: string;
    onClick: () => void;
    disabled: boolean;
}

export interface CrudTableColumnInterface {
    id: string;
    title: string;
    value: string | Function;
    class?: string;
    sortKey?: string;
    classFunction?: Function;
    formatter?: InjectionToken<PipeTransform>;
}

export interface CrudTableInterface {
    // service: PageableRestService,
    title: string;
    url: string;
    service: any;
    columns: CrudTableColumnInterface[];
    pageSize: number;
    pageSizeOptions?: number[];
    hasFilter?: boolean;
    filter?: string;
    header?: {
        fixed: boolean;
    };
    footer?: {
        renderer?: Function;
        fixed: boolean;
    };
    defaultSort?: {
        column: string;
        sort: string;
    };
    actionFunction?: Function;
}

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, OnChanges {
    @Input() crudContext!: Map<string, string>;
    @Input() config!: CrudTableInterface;
    @Input() isArchived!: boolean;
    @Input() displayCustomFilters: boolean = false;
    @Input() search: string = '';
    @Input() customParams: { key: string; value: any }[] = [];
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    searchNotifier = new Subject();
    columns_name: string[] = [];
    formatter_columns = new Map<string, PipeTransform>();
    pageable: Pageable = {
        pageNumber: 0,
        pageSize: 10,
    };
    resultsLength: number = 0;
    data: [] = [];
    isLoading: boolean = true;
    custom_filters: {
        coordenadora: {id: number; name: string}[];
        executantes: {id: number; name: string}[];
        solicitado: {id: number; name: string}[];
        status: {id: number; name: string}[];
        atividade: {id: number; name: string}[];
    } = {
        coordenadora: [],
        executantes: [],
        solicitado: [],
        status: [],
        atividade: [],
    };

    solicitacao_filter = [];
    status_filter = [];
    atividade_filter = [];
    executantes_filter = [];
    coordenadoras_filter = [];
    prazo: any;
    solicitado: any;

    constructor(public injector: Injector) {}

    ngOnInit(): void {
        this.setInitialTableConfig();
        this.columns_name = this.config.columns.map(z => z.id);
        if (this.config.actionFunction) this.columns_name.push('actions');
        this.config.columns.forEach(column => {
            if (column.formatter) {
                this.formatter_columns.set(
                    column.id,
                    this.injector.get(column.formatter)
                );
            }
        });

        this.searchNotifier.pipe(debounceTime(500)).subscribe(() => {
            this.paginator.pageIndex = 0;
            this.pageable.pageNumber = 0;
            this.request();
        });
        // setInterval(() => this.request(), 10000)
    }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes);
        if (changes['isArchived'] && !changes['isArchived'].firstChange) {
            this.request();
        }
        if (changes['search'] && !changes['search'].firstChange) {
            this.searchNotifier.next(true)
        }
    }

    setInitialTableConfig() {
        const pageable_keys: string[] = ['pageSize', 'defaultSort'];

        Object.keys(this.config).forEach((config_key: string) => {
            if (!pageable_keys.includes(config_key)) return;
            if (config_key === 'pageSize') {
                this.pageable.pageSize = this.config.pageSize;
            }
            if (config_key === 'defaultSort' && this.config.defaultSort) {
                const direction: Direction =
                    this.config.defaultSort.sort === 'asc'
                        ? Direction.ASC
                        : Direction.DESC;
                this.pageable.sort = {
                    sortOrders: [
                        {
                            direction,
                            property: this.config.defaultSort.column,
                        },
                    ],
                };
            }
        });
    }

    addSortSubscribe() {
        this.sort.sortChange.subscribe(sort => {
            if (sort.direction && sort.active) {
                const direction: Direction =
                    sort.direction === 'asc' ? Direction.ASC : Direction.DESC;
                this.pageable.sort = {
                    sortOrders: [
                        {
                            direction,
                            property: sort.active,
                        },
                    ],
                };
            }
            this.request();
        });
    }

    handlePageEvent($event: PageEvent) {
        this.pageable.pageSize = $event.pageSize;
        this.pageable.pageNumber = $event.pageIndex;
        this.request();
    }

    request() {
        const { search, config, pageable } = this;

        const params: { name: string; value: string }[] = [];
        if (this.customParams.length > 0) {
            this.config.pageSize = 1000000;
            console.log(this.customParams)
            this.customParams.forEach(param => {
                params.push({ name: param.key, value: param.value+'' })
            })
        }
        if (this.displayCustomFilters) {
            if (this.coordenadoras_filter.length > 0) {
                params.push({ name: 'coordenadoras', value: JSON.stringify(this.coordenadoras_filter) })
            }
            if (this.prazo && this.prazo instanceof Date) {
                params.push({ name: 'prazo', value: this.prazo.toDateString() })
            }
            if (this.solicitado && this.solicitado instanceof Date) {
                params.push({ name: 'solicitado', value: this.solicitado.toDateString() })
            }
            if (this.executantes_filter.length > 0) {
                params.push({ name: 'executantes', value: JSON.stringify(this.executantes_filter) })
            }
            if (this.solicitacao_filter.length > 0) {
                params.push({ name: 'solicitacao_filter', value: JSON.stringify(this.solicitacao_filter) })
            }
            if (this.status_filter.length > 0) {
                params.push({ name: 'status_filter', value: JSON.stringify(this.status_filter) })
            }
            if (this.atividade_filter.length > 0) {
                params.push({ name: 'atividade_filter', value: JSON.stringify(this.atividade_filter) })
            }
        }

        this.config.service
            .listAll(this.config.url, pageable, this.isArchived, search, params)
            .subscribe((response: any) => {
                this.resultsLength = response.totalElements;
                this.custom_filters = response.custom_filters;
                this.data = response.data.map((row_data: any) => {
                    const data = new Map<string, string | Component | {}>();
                    config.columns.forEach(column => {
                        let value: {};
                        value = this.getColumnValue(column, row_data);
                        let cl = column.class;
                        if (column.classFunction) {
                            if (cl) {
                                cl += ` ${column.classFunction(row_data)}`;
                            } else {
                                cl = `${column.classFunction(row_data)}`;
                            }
                            data.set(`row-class-${column.id}`, cl ?? '')
                        } else {
                            data.set(`row-class`, '')
                        }

                        data.set(column.id, value);
                    });
                    if (config.actionFunction) {
                        data.set('actions', config.actionFunction(row_data));
                    }
                    return data;
                });
                if (this.isLoading) {
                    this.isLoading = false;
                    setTimeout(() => this.addSortSubscribe(), 0);
                }
            });
    }

    private getColumnValue(
        column: CrudTableColumnInterface,
        row_data: any
    ): {} {
        let value: { text?: string; html?: string } = {};
        if (typeof column.value === 'string') {
            value = { text: row_data[column.value] };
        } else {
            const generated_value = column.value(row_data);
            if (typeof generated_value === 'string') {
                value = { text: generated_value };
            } else {
                value = generated_value;
            }
        }
        if (this.formatter_columns.has(column.id)) {
            const item = this.formatter_columns.get(column.id);
            if (item && value?.text) value.text = item.transform(value.text);
        }
        return value;
    }
}
