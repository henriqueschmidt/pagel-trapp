<?php

namespace App\Repositories;

use App\Models\User;

class UsersRepository
{

    public function __construct() {}

    public function checkIfExists(string $email): bool
    {
        return User::query()
            ->where('email', $email)
            ->exists();
    }

}
