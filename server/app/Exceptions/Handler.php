<?php

namespace App\Exceptions;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Support\Facades\Log;
use Laravel\Sanctum\Exceptions\MissingAbilityException;
use Throwable;

use Illuminate\Support\Arr;
use Illuminate\Http\Response;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {});
    }

    public function render($request, Throwable $e) {
        if ($e instanceof MissingAbilityException) {
            return response()->json([
                'message' => 'Permissão negada',
                'expected' => $e->abilities()
            ], 401);
        }

        if ($e instanceof ModelNotFoundException) {
            $a = explode("App\Models", $e->getModel());
            $text = substr($a[1], 1);
            $ids = implode($e->getIds());
            return response()->json(['success' => false, 'message' => "Nenhum(a) $text com id(s) $ids encontrado"], Response::HTTP_NOT_FOUND);
        }

        return parent::render($request, $e);
    }

}
