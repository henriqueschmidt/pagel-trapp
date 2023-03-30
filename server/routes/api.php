<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['cors'])->group(function () {
    Route::post('/login', 'LoginController@authenticate');

    Route::middleware(['auth:sanctum'])->group(function () {

//        Route::get('/is-loggedin', fn() => true );
        Route::get('/is-loggedin', function () {
            $exitCode = \Illuminate\Support\Facades\Artisan::call('cache:clear');
            return true;
        } );

        Route
            ::prefix('/profile/')
            ->controller('ProfileController')
            ->group(function () {
                Route::get('', 'view');
                Route::post('', 'save');
            });

        Route
            ::prefix('/usuarios/')
            ->controller('UserController')
            ->group(function () {
                Route::get('perfis', 'perfis');
                Route::get('filiais', 'filiais');
                Route::get('setores', 'setores');
                Route::get('coordenadoras', 'coordenadoras');
                Route::get('', 'index');
                Route::post('', 'save');
                Route::put('{id}', 'save')->middleware(['auth:sanctum', 'ability:users.list']);
                Route::delete('{id}', 'destroy')->middleware(['auth:sanctum', 'ability:users.list']);
                Route::get('{id}', 'view');
            });

        Route
            ::prefix('/filiais')
            ->controller('FilialController')
            ->group(function () {
                Route::get('', 'index');
                Route::post('', 'save');
                Route::put('{id}', 'save');
                Route::delete('{id}', 'destroy');
                Route::get('{id}', 'view');
            });

        Route
            ::prefix('/setores')
            ->controller('SetorController')
            ->group(function () {
                Route::get('', 'index');
                Route::post('', 'save');
                Route::put('{id}', 'save');
                Route::delete('{id}', 'destroy');
                Route::get('{id}', 'view');
            });

        Route
            ::prefix('/atividades')
            ->controller('AtividadeController')
            ->group(function () {
                Route::get('', 'index');
                Route::post('', 'save');
                Route::put('{id}', 'save');
                Route::delete('{id}', 'destroy');
                Route::get('{id}', 'view');
            });

        Route
            ::prefix('/tarefas')
            ->controller('TarefaController')
            ->group(function () {
                Route::get('', 'index');
                Route::post('', 'save');
                Route::get('coordenadoras', 'getCoordenadoras');
                Route::get('atividades', 'atividades');
                Route::get('users', 'users');
                Route::get('colaboradoras/{coordenadora_id}', 'getColaboradoras');
                Route::get('status', 'getStatus');
                Route::post('{id}/encerrar', 'encerrar');
                Route::put('{id}', 'save');
                Route::delete('{id}', 'destroy');
                Route::get('{id}', 'view');
            });

        Route
            ::prefix('/relatorios')
            ->controller('RelatorioController')
            ->group(function () {
                Route::get('usuarios', 'users');
                Route::get('filiais', 'filiais');
                Route::get('atividades', 'atividades');
                Route::get('gerar', 'gerar');
            });

        Route::get('/minhas-tarefas', 'TarefaController@minhasTarefas');
        Route::get('/tarefas-encerradas', 'TarefaController@encerrados');

    });
});
