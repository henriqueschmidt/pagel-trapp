export enum Direction {
    ASC,
    DESC,
}

export enum MatchMode {
    ALL,
    ANY,
}

export enum NoOpPropertyValueTransformer {
    INSTANCE,
}

export enum NullHandler {
    INCLUDE,
    IGNORE,
}

export enum NullHandling {
    NATIVE,
    NULLS_FIRST,
    NULLS_LAST,
}

export interface Page<T> extends Slice<T> {
    readonly totalElements: number;
    readonly totalPages: number;
}

export interface Pageable {
    readonly offset?: number;
    pageNumber: number;
    pageSize: number;
    readonly paged?: boolean;
    sort?: Sort;
    readonly unpaged?: boolean;
}

export interface Slice<T> {
    readonly content: T[];
    readonly first: boolean;
    readonly last: boolean;
    readonly number: number;
    readonly numberOfElements: number;
    readonly pageable: Pageable;
    readonly size: number;
    readonly sort: Sort;
}

export interface Sort {
    readonly empty?: boolean;
    sortOrders: undefined | SortOrder[];
    readonly sorted?: boolean;
    readonly unsorted?: boolean;
}

export interface SortOrder {
    readonly ascending?: boolean;
    readonly descending?: boolean;
    direction?: Direction;
    ignoreCase?: boolean;
    nullHandling?: NullHandling;
    property: string;
}

export enum StringMatcher {
    DEFAULT,
    EXACT,
    STARTING,
    ENDING,
    CONTAINING,
    REGEX,
}

export enum Unpaged {
    INSTANCE,
}
