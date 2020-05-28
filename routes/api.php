<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('login/states', 'Auth\LoginController@getUser');

Route::group(['middleware' => 'api'], function($router) {

    Route::post('logout', 'Auth\LoginController@logout');

    Route::get('availability', 'AvailabilityController@index');
    Route::patch('availability/projects', 'AvailabilityController@updateProjects');
    Route::patch('availability', 'AvailabilityController@updateAvailability');

    Route::get('projects', 'ProjectsController@index');
    Route::post('projects', 'ProjectsController@create');
    Route::patch('projects', 'ProjectsController@update');
    Route::delete('projects/{id}', 'ProjectsController@delete');

    Route::get('resources', 'ResourcesController@index');
    Route::post('resources', 'ResourcesController@create');
    Route::patch('resources', 'ResourcesController@update');
    Route::delete('resources/{id}', 'ResourcesController@delete');
});
