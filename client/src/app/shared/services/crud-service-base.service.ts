import {Observable} from 'rxjs';
import {Base, CrudService, RequestData} from "../models/crud-service.model";
import {Pageable} from "../models/table.model";
import {ManageData} from "../components/crud/crud.component";
import {DialogMessageService} from "./dialog-message.service";

/*
 * Implementação base do CrudService
 */
export class BaseCrudService<D extends Base, G extends Base> implements CrudService
{
    constructor(public apiService: any) {}

    public create(url: string, definicao: Base, copyOf?: number | undefined) {
        return this.apiService.create(url, definicao, copyOf);
    }

    public replace(url: string, id: number, definicao: Base): Observable<RequestData> {
        return this.apiService.replace(url, id, definicao);
    }

    public getById(url: string, id: number): Observable<RequestData> {
        return this.apiService.getById(url, id);
    }

    public delete(url: string, id: number): Observable<any> {
        return this.apiService.delete(url, id);
    }

    // @ts-ignore
    public listAll(
        url: string,
        pageable: Pageable,
        arquivado: boolean,
        filter: string,
        queryParamsList: { name: string; value: string }[] = [],
        _crudContext: Map<string, string>
    ): Observable<RequestData> {
        queryParamsList.push({ name: 'filter', value: filter });
        return this.apiService.listGridItems(url, queryParamsList, pageable);
    }


    public listSelectOptions(url: string, url2: string): Observable<RequestData> {
        return this.apiService.listSelectOptions(url, url2);
    }

    public defaultSave(
        url: string,
        data: Base,
        settingsData: ManageData,
        crudService: BaseCrudService<Base, Base>,
        dialog: DialogMessageService
    ) {
        return new Promise((resolve, reject) => {
            if (settingsData.action === 'new') {
                crudService.create(url, data).subscribe(() => {
                    dialog.dialog.closeAll();
                    resolve(true);
                }, () => reject());
            } else {
                if (settingsData.id) {
                    data.id = settingsData.id;
                    crudService.replace(url, settingsData.id, data).subscribe(() => {
                        dialog.dialog.closeAll();
                        resolve(true);
                    }, () => reject());
                }
            }
        });
    }

}
