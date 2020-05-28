<?php

namespace App\Http\Controllers\Auth;

use Socialite;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login']]);
    }

    public function logout()
    {
        auth('api')->logout();

        return response()->json(['logged_out' => true]);
    }

    public function getUser()
    {
        $user = auth('api')->user();

        if(! $user) {
            return response('Unauthorized.', 401);
        }

        return response()->json(auth('api')->user());
    }
}
