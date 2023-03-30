import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Base, RequestData} from "../models/crud-service.model";
import {map, Observable} from "rxjs";
import {Direction, Page, Pageable} from "../models/table.model";

@Injectable({
  providedIn: 'root'
})
export class BaseServiceService {

    page: string = '';
    httpService: HttpClient;

    public constructor(httpService: HttpClient) {
        this.httpService = httpService;
    }

    public create(url: string, model: Base, copyOf?: number): Observable<RequestData> {
        const queryParamsList: { name: string; value: string }[] = [];
        if (copyOf !== undefined && copyOf !== null) {
            queryParamsList.push({ name: 'copyOf', value: copyOf.toString() });
        }
        let params = new HttpParams();
        for (const queryParam of queryParamsList) {
            params = params.append(queryParam.name, queryParam.value);
        }
        const headers = new HttpHeaders().set(
            'Content-type',
            'application/json'
        );
        return this.httpService
            .post(`/${url}`, JSON.stringify(model), {
                headers,
                params,
                responseType: 'text',
            })
            .pipe(map(res => JSON.parse(res)));
    }

    public getById(url: string, id: number): Observable<RequestData> {
        return this.httpService
            .get(`/${url}/${id}`, {
                responseType: 'text',
            })
            .pipe(map(res => JSON.parse(res)));
    }

    public listAll(
        url: string,
        queryParamsList: { name: string; value: string }[],
        pageable: Pageable,
        crudContext: Map<string, string> = new Map<string, string>
    ): Observable<any> {
        if (pageable) {
            queryParamsList.push({
                name: 'page',
                value: pageable.pageNumber + '',
            });
            queryParamsList.push({
                name: 'size',
                value: pageable.pageSize + '',
            });
            if (pageable.sort && pageable.sort.sortOrders) {
                for (const sortOrder of pageable.sort.sortOrders) {
                    queryParamsList.push({
                        name: 'sort',
                        value:
                            sortOrder.property +
                            (sortOrder.direction === Direction.DESC
                                ? ',DESC'
                                : ''),
                    });
                }
            }
        }
        let params = new HttpParams();
        for (const queryParam of queryParamsList) {
            params = params.append(queryParam.name, queryParam.value);
        }
        return this.httpService
            .get(`/${url}`, {
                params,
                responseType: 'text',
            })
            .pipe(map(res => JSON.parse(res)));
    }

    public listGridItems(
        url: string,
        queryParamsList: { name: string; value: string }[],
        pageable: Pageable
    ): Observable<Page<Base>> {
        if (pageable) {
            queryParamsList.push({
                name: 'page',
                value: pageable.pageNumber + '',
            });
            queryParamsList.push({
                name: 'size',
                value: pageable.pageSize + '',
            });
            if (pageable.sort && pageable.sort.sortOrders) {
                for (const sortOrder of pageable.sort.sortOrders) {
                    queryParamsList.push({
                        name: 'sort',
                        value:
                            sortOrder.property +
                            (sortOrder.direction === Direction.DESC
                                ? ',DESC'
                                : ''),
                    });
                }
            }
        }
        let params = new HttpParams();
        for (const queryParam of queryParamsList) {
            params = params.append(queryParam.name, queryParam.value);
        }
        return this.httpService
            .get(`${url}`, {
                params,
                responseType: 'text',
            })
            .pipe(map(res => JSON.parse(res)));
    }

    public listSelectOptions(url: string, url2: string): Observable<RequestData> {
        return this.httpService
            .get(`/${url}${url2}`, {
                responseType: 'text',
            })
            .pipe(map(res => JSON.parse(res)));
    }

    public patch(url: string, id: number, model: Base): Observable<RequestData> {
        return this.httpService
            .patch(`/${url}/` + id + '', model, {
                responseType: 'text',
            })
            .pipe(map(res => JSON.parse(res)));
    }

    public replace(url: string, id: number, model: Base): Observable<RequestData> {
        const headers = new HttpHeaders().set(
            'Content-type',
            'application/json'
        );
        return this.httpService
            .put(`/${url}/` + id + '', JSON.stringify(model), {
                headers,
                responseType: 'text',
            })
            .pipe(map(res => JSON.parse(res)));
    }

    public delete(url: string, id: number): Observable<any> {
        return this.httpService.delete(`/${url}/${id}`);
    }

}
