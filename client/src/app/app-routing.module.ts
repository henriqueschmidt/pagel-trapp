import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./auth/components/login/login.component";
import {UsersComponent} from "./users/components/users/users.component";
import {HasRoleGuard} from "./auth/guards/has-role.guard";
import {FiliaisComponent} from "./filiais/components/filiais/filiais.component";
import {SetorComponent} from "./setores/components/setor/setor.component";
import {TasksComponent} from "./tasks/components/tasks/tasks.component";
import {ProfileComponent} from "./users/components/profile/profile.component";
import {AtividadeTiposComponent} from "./atividadeTipos/components/atividade-tipos/atividade-tipos.component";
import {MyTasksComponent} from "./tasks/components/my-tasks/my-tasks.component";
import {EncerradosComponent} from "./tasks/components/encerrados/encerrados.component";
import {RelatorioComponent} from "./relatorios/relatorio/relatorio.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
    },
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'perfil',
        component: ProfileComponent,
    },
    {
        path: 'usuarios',
        component: UsersComponent,
        canActivate: [HasRoleGuard],
        data: {
            role: 'users.list'
        },
        children: [
            {
                path: ':status',
                component: UsersComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'users.create'
                }
            },
            {
                path: ':status/:id',
                component: UsersComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'users.list'
                }
            },
        ]
    },
    {
        path: 'filiais',
        component: FiliaisComponent,
        canActivate: [HasRoleGuard],
        data: {
            role: 'filiais.list'
        },
        children: [
            {
                path: ':status',
                component: FiliaisComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'filiais.create'
                }
            },
            {
                path: ':status/:id',
                component: FiliaisComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'filiais.list'
                }
            },
        ]
    },

    {
        path: 'setores',
        component: SetorComponent,
        canActivate: [HasRoleGuard],
        data: {
            role: 'filiais.list'
        },
        children: [
            {
                path: ':status',
                component: SetorComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'filiais.create'
                }
            },
            {
                path: ':status/:id',
                component: SetorComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'filiais.list'
                }
            },
        ]
    },

    {
        path: 'atividades',
        component: AtividadeTiposComponent,
        canActivate: [HasRoleGuard],
        data: {
            role: 'atividades.list'
        },
        children: [
            {
                path: ':status',
                component: AtividadeTiposComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'atividades.create'
                }
            },
            {
                path: ':status/:id',
                component: AtividadeTiposComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'atividades.list'
                }
            },
        ]
    },

    {
        path: 'tarefas',
        component: TasksComponent,
        canActivate: [HasRoleGuard],
        data: {
            role: 'tarefas.list'
        },
        children: [
            {
                path: ':status',
                component: TasksComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'tarefas.create'
                }
            },
            {
                path: ':status/:id',
                component: TasksComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'tarefas.list'
                }
            },
        ]
    },

    {
        path: 'minhas-tarefas',
        component: MyTasksComponent,
        canActivate: [HasRoleGuard],
        data: {
            role: 'tarefas.list'
        },
        children: [
            {
                path: ':status',
                component: MyTasksComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'tarefas.create'
                }
            },
            {
                path: ':status/:id',
                component: MyTasksComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'tarefas.list'
                }
            },
        ]
    },

    {
        path: 'tarefas-concluidas',
        component: EncerradosComponent,
        canActivate: [HasRoleGuard],
        data: {
            role: 'tarefas.list'
        },
        children: [
            {
                path: ':status',
                component: EncerradosComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'tarefas.create'
                }
            },
            {
                path: ':status/:id',
                component: EncerradosComponent,
                canActivate: [HasRoleGuard],
                data: {
                    role: 'tarefas.list'
                }
            },
        ]
    },

    {
        path: 'relatorios',
        component: RelatorioComponent,
        canActivate: [HasRoleGuard],
        data: {
            role: 'relatorios'
        },
        children: []
    },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
