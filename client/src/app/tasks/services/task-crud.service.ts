import { Injectable } from '@angular/core';
import {BaseCrudService} from "../../shared/services/crud-service-base.service";
import {BaseServiceService} from "../../shared/services/base-service.service";

export interface TaskExecucaoDetail {
    id: number;
    nome: string;
    executante_id: number;
    limite_dt: Date;
    descricao: string;
    status_id: number;
    tarefa_id: number;
}

export interface TaskDetailSave extends TaskDetail {
    filial: { id: number; nome: string };
}

export interface TaskDetail {
    id: number;
    nome: string;
    responsavel_user_id: number;
    entrega_dt: Date;
    limite_dt: Date;
    descricao: string;
    status_id: number;
    descricao_execucao: string;
    processo_numero: string;
    solicitacao_user_id: number;
    created_at: Date;
    tarefa_status_id: number;
    atividade_id: number;
    execucoes: TaskExecucaoDetail[];
}

export interface TaskGridItem {
    id: number;
    name: string;
    email: string;
    perfil: string;
}

@Injectable({
    providedIn: 'root'
})
export class TaskCrudService extends BaseCrudService<TaskDetail, TaskGridItem> {
    constructor(public service: BaseServiceService) {
        super(service);
    }
}
