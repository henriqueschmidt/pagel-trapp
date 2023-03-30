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
        Schema::create('perfis', function (Blueprint $table) {
            $table->id();
            $table->string('nome');
            $table->string('sistema');
            $table->timestamps();
        });

        DB::table('perfis')->insert([
            [ 'nome' => 'Suporte', 'sistema' => 'dev' ],
            [ 'nome' => 'Admin', 'sistema' => 'admin' ],
            [ 'nome' => 'Gestora', 'sistema' => 'gestora' ],
            [ 'nome' => 'Diretoria', 'sistema' => 'diretoria' ],
            [ 'nome' => 'Coordenadora', 'sistema' => 'coordenadora' ],
            [ 'nome' => 'Colaboradora', 'sistema' => 'colaboradora' ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('perfis');
    }
};
