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
        Schema::create('tarefa_status', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('sistema');
            $table->timestamps();
        });

        DB::table('tarefa_status')->insert([
            [ 'nome' => 'Aguardando', 'sistema' => 'aguardando' ],
            [ 'nome' => 'Em andamento', 'sistema' => 'andamento' ],
            [ 'nome' => 'Cancelada', 'sistema' => 'cancelada' ],
            [ 'nome' => 'Encerrada', 'sistema' => 'encerrada' ],
            [ 'nome' => 'Aguardando retorno', 'sistema' => 'aguardando_retorno' ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tarefa_status');
    }
};
