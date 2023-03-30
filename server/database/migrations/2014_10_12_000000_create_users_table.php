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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            $table->unsignedBigInteger('perfil_id');
            $table->foreign('perfil_id')->references('id')->on('perfis');

            $table->unsignedBigInteger('filial_id')->nullable();
            $table->foreign('filial_id')->references('id')->on('filiais');

            $table->unsignedBigInteger('setor_id')->nullable();
            $table->foreign('setor_id')->references('id')->on('setores');

            $table->rememberToken();
            $table->timestamps();
        });

        $password = '$2y$10$8kVX.vherlwh9QdrCacNH.jRnvDqvXrJ0/FfEgjP084hBZLLia.Y.';

        DB::table('users')->insert([
            [ 'name' => 'Henrique', 'email' => 'henrique@mesnet.com.br', 'password' => $password, 'perfil_id' => 1, 'filial_id' => null ],
            [ 'name' => 'Jane', 'email' => 'jane@mesnet.com.br', 'password' => $password, 'perfil_id' => 2, 'filial_id' => null ],
            [ 'name' => 'Caroline', 'email' => 'caroline@mesnet.com.br', 'password' => $password, 'perfil_id' => 3, 'filial_id' => null ],
            [ 'name' => 'Jéssica Schuck', 'email' => 'jessica@mesnet.com.br', 'password' => $password, 'perfil_id' => 3, 'filial_id' => null ],
            [ 'name' => 'Estela', 'email' => 'estela@mesnet.com.br', 'password' => $password, 'perfil_id' => 5, 'filial_id' => 1 ],
            [ 'name' => 'Estelle', 'email' => 'estelle@mesnet.com.br', 'password' => $password, 'perfil_id' => 6, 'filial_id' => null ],
            [ 'name' => 'Rafaela', 'email' => 'rafaela@mesnet.com.br', 'password' => $password, 'perfil_id' => 6, 'filial_id' => null ],
            [ 'name' => 'Caroline 2', 'email' => 'caroline2@mesnet.com.br', 'password' => $password, 'perfil_id' => 6, 'filial_id' => null ],
            [ 'name' => 'Caroline Quadros', 'email' => 'carolinequadros@mesnet.com.br', 'password' => $password, 'perfil_id' => 6, 'filial_id' => null ],
            [ 'name' => 'Gabriela', 'email' => 'gabi@mesnet.com.br', 'password' => $password, 'perfil_id' => 6, 'filial_id' => null ],
            [ 'name' => 'Estela2', 'email' => 'estela2@mesnet.com.br', 'password' => $password, 'perfil_id' => 5, 'filial_id' => 2 ],
        ]);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
};
