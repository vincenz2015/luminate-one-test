<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Availability
 *
 * @property int $id
 * @property int $resource_id
 * @property int $project_id
 * @property string $date
 * @property string $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Project $project
 * @property-read \App\Models\Resource $resource
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability whereResourceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Availability whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Availability extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'date',
        'project_id',
        'resource_id'
    ];

    public function project(){
        return $this->hasOne('App\Models\Project');
    }

    public function resource(){
        return $this->hasOne('App\Models\Resource');
    }

    /**
     * @return Carbon
     */
    public static function getAnchorDate()
    {
        return Carbon::createFromDate(2019, 1, 1)->subDay(1);
    }
}
