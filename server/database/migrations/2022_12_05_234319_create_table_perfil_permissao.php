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
        Schema::create('perfil_permissao', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('perfil_id');
            $table->foreign('perfil_id')->references('id')->on('perfis');
            $table->unsignedBigInteger('permissao_id');
            $table->foreign('permissao_id')->references('id')->on('permissoes');
            $table->timestamps();
        });

        $permissoes = \App\Models\Permissao::query()->get();

        $data = [];
        foreach ($permissoes as $permissao) {
            $data[] = [
                'perfil_id' => 1,
                'permissao_id' => $permissao->id,
            ];
        }

        DB::table('perfil_permissao')->insert($data);
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('perfil_permissao');
    }
};
