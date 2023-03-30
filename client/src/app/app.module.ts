import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LoginComponent} from './auth/components/login/login.component';
import {AngularMaterialModule} from "./core/modules/angular-material/angular-material.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {APIInterceptor} from "./core/interceptors/APIInterceptor.module";
import {UsersComponent} from './users/components/users/users.component';
import {TableComponent} from "./shared/components/table/table.component";
import {UserCrudComponent} from './users/components/user-crud/user-crud.component';
import { UserDetailComponent } from './users/components/user-detail/user-detail.component';
import { TasksComponent } from './tasks/components/tasks/tasks.component';
import { TasksCrudComponent } from './tasks/components/tasks-crud/tasks-crud.component';
import { TasksDetailComponent } from './tasks/components/tasks-detail/tasks-detail.component';
import { DialogMessageComponent } from './shared/components/dialog-message/dialog-message.component';
import { FiliaisComponent } from './filiais/components/filiais/filiais.component';
import { FiliaisDetailsComponent } from './filiais/components/filiais-details/filiais-details.component';
import { FiliaisCrudComponent } from './filiais/components/filiais-crud/filiais-crud.component';
import { SetorComponent } from './setores/components/setor/setor.component';
import { SetorCrudComponent } from './setores/components/setor-crud/setor-crud.component';
import { SetorDetailsComponent } from './setores/components/setor-details/setor-details.component';
import { MenuComponent } from './layout/components/menu/menu.component';
import {MAT_DATE_LOCALE} from "@angular/material/core";
import { ProfileComponent } from './users/components/profile/profile.component';
import { AtividadeTiposComponent } from './atividadeTipos/components/atividade-tipos/atividade-tipos.component';
import { AtividadeTiposCrudComponent } from './atividadeTipos/components/atividade-tipos-crud/atividade-tipos-crud.component';
import { AtividadeTiposDetailsComponent } from './atividadeTipos/components/atividade-tipos-details/atividade-tipos-details.component';
import { MyTasksComponent } from './tasks/components/my-tasks/my-tasks.component';
import { EncerradosComponent } from './tasks/components/encerrados/encerrados.component';
import { ColaboradoraRelatorioComponent } from './relatorios/colaboradora-relatorio/colaboradora-relatorio.component';
import { ExecutanteRelatorioComponent } from './relatorios/executante-relatorio/executante-relatorio.component';
import { FilialRelatorioComponent } from './relatorios/filial-relatorio/filial-relatorio.component';
import { RelatorioComponent } from './relatorios/relatorio/relatorio.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        UsersComponent,
        TableComponent,
        UserCrudComponent,
        UserDetailComponent,
        TasksComponent,
        TasksCrudComponent,
        TasksDetailComponent,
        DialogMessageComponent,
        FiliaisComponent,
        FiliaisDetailsComponent,
        FiliaisCrudComponent,
        SetorComponent,
        SetorCrudComponent,
        SetorDetailsComponent,
        MenuComponent,
        ProfileComponent,
        AtividadeTiposComponent,
        AtividadeTiposCrudComponent,
        AtividadeTiposDetailsComponent,
        MyTasksComponent,
        EncerradosComponent,
        ColaboradoraRelatorioComponent,
        ExecutanteRelatorioComponent,
        FilialRelatorioComponent,
        RelatorioComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        AngularMaterialModule,
        ReactiveFormsModule,
        HttpClientModule,
        FormsModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: APIInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
