<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tarefas', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->text('descricao');
            $table->text('descricao_execucao');
            $table->dateTime('status_dt');
            $table->dateTime('entrega_dt');
            $table->dateTime('limite_dt');
            $table->dateTime('encerramento_dt')->nullable();

            $table->unsignedBigInteger('solicitacao_user_id');
            $table->foreign('solicitacao_user_id')->references('id')->on('users');

            $table->unsignedBigInteger('filial_id');
            $table->foreign('filial_id')->references('id')->on('filiais');

            $table->unsignedBigInteger('responsavel_user_id');
            $table->foreign('responsavel_user_id')->references('id')->on('users');

            $table->unsignedBigInteger('tarefa_status_id');
            $table->foreign('tarefa_status_id')->references('id')->on('tarefa_status');

            $table->unsignedBigInteger('tarefa_origem_id')->nullable();
            $table->foreign('tarefa_origem_id')->references('id')->on('tarefa_origem');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tarefas');
    }
};
