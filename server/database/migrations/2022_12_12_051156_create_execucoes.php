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
        Schema::create('execucoes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('nome');
            $table->text('descricao');
            $table->dateTime('limite_dt');

            $table->unsignedBigInteger('status_id');
            $table->foreign('status_id')->references('id')->on('tarefa_status');

            $table->unsignedBigInteger('executante_id');
            $table->foreign('executante_id')->references('id')->on('users');

            $table->unsignedBigInteger('tarefa_id');
            $table->foreign('tarefa_id')->references('id')->on('tarefas');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('execucoes');
    }
};
