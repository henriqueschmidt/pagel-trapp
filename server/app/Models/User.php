<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\HasApiTokens;
use phpDocumentor\Reflection\Type;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'perfil_id',
        'setor_id',
        'filial_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Add a mutator to ensure hashed passwords
     */
    public function setPasswordAttribute($password)
    {
        $this->attributes['password'] = bcrypt($password);
    }

    public function perfil()
    {
        return Perfil::query()
            ->where('id', Auth::user()->perfil_id)
            ->first();
    }

    public function permissoes()
    {
        return Permissao::query()
            ->join('perfil_permissao as pp', 'pp.permissao_id', '=', 'permissoes.id')
            ->where('pp.perfil_id', Auth::user()->perfil_id)
            ->pluck('sistema')
            ->toArray();
    }

    public function hasPerfil($perfil)
    {
        if (gettype($perfil) === "string") {
            return $this->perfil()->sistema == $perfil;
        } else {
            return in_array($this->perfil()->sistema, $perfil);
        }
    }

    public function hasPermissao($permissao)
    {
        if (gettype($permissao) === "string") {
            return in_array($permissao, $this->permissoes());
        } else {
            return !empty(array_intersect($permissao, $this->permissoes()));
        }
    }
}
