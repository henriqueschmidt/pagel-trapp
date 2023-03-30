import {Observable} from 'rxjs';
import {Pageable} from "./table.model";

/*
 * Estrutura que deve ser respeitada por todas classes CrudService.
 */

export interface Base {
    id: number;
}

export interface RequestData {
    data?: any;
    success: boolean;
}

export interface CrudService {
    getById(url: string, id: number): Observable<RequestData>;

    listAll(
        url: string,
        pageable: Pageable,
        arquivado: boolean,
        filter: string,
        queryParamsList: { name: string; value: string }[],
        crudContext: Map<string, string>
    ): Observable<any>;

    create(url: string, definicao: Base, copyOf?: number): Observable<RequestData>;

    delete(url: string, id: number): Observable<RequestData>;

    replace(url: string, id: number, definicao: Base): Observable<RequestData>;

    listSelectOptions(url: string, url2: string): Observable<RequestData>

}
