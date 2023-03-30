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
        Schema::create('setores', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->timestamps();
        });

        DB::table('setores')->insert([
            [ 'nome' => 'Previdenciario' ],
            [ 'nome' => 'Civil' ],
            [ 'nome' => 'Trabalhista' ],
            [ 'nome' => 'Secretaria' ],
            [ 'nome' => 'Calculo' ],
            [ 'nome' => 'Admin' ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('setores');
    }
};
