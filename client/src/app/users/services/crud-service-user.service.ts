import {Injectable} from '@angular/core';
import {BaseCrudService} from "../../shared/services/crud-service-base.service";
import {BaseServiceService} from "../../shared/services/base-service.service";

export interface UserDetail {
    id: number;
    name: string;
    email: string;
    perfil_id: number;
    setor_id: number;
    filial_id: number;
    coordenadora_id: number;
}

export interface UserGridItem {
    id: number;
    name: string;
    email: string;
    perfil: string;
}

@Injectable({
    providedIn: 'root'
})
export class CrudServiceUserService extends BaseCrudService<UserDetail, UserGridItem> {
    constructor(public service: BaseServiceService) {
        super(service);
    }
}
