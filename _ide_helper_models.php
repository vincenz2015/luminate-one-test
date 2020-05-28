<?php

// @formatter:off
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App{
/**
 * App\User
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection|\Illuminate\Notifications\DatabaseNotification[] $notifications
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\User whereUpdatedAt($value)
 */
	class User extends \Eloquent {}
}

namespace App{
/**
 * App\ModelsWorker
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWorker newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWorker newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWorker query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWorker whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWorker whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWorker whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWorker whereUpdatedAt($value)
 */
	class ModelsWorker extends \Eloquent {}
}

namespace App{
/**
 * App\ModelsWork
 *
 * @property int $id
 * @property string $name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWork newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWork newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWork query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWork whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWork whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWork whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\ModelsWork whereUpdatedAt($value)
 */
	class ModelsWork extends \Eloquent {}
}

