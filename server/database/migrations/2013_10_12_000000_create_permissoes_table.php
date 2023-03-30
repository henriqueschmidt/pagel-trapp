<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permissoes', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('sistema');
            $table->timestamps();
        });

        DB::table('permissoes')->insert([
            [ 'nome' => 'Listagem de usuários', 'sistema' => 'users.list' ],
            [ 'nome' => 'Criação de usuários', 'sistema' => 'users.create' ],
            [ 'nome' => 'Edição de usuários', 'sistema' => 'users.update' ],

            [ 'nome' => 'Listagem de filiais', 'sistema' => 'filiais.list' ],
            [ 'nome' => 'Criação de filiais', 'sistema' => 'filiais.create' ],
            [ 'nome' => 'Edição de filiais', 'sistema' => 'filiais.update' ],

            [ 'nome' => 'Listagem de setores', 'sistema' => 'setores.list' ],
            [ 'nome' => 'Criação de setores', 'sistema' => 'setores.create' ],
            [ 'nome' => 'Edição de setores', 'sistema' => 'setores.update' ],

            [ 'nome' => 'Listagem de tarefas', 'sistema' => 'tarefas.list' ],
            [ 'nome' => 'Criação de tarefas', 'sistema' => 'tarefas.create' ],
            [ 'nome' => 'Edição de tarefas', 'sistema' => 'tarefas.update' ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('permissoes');
    }
};
