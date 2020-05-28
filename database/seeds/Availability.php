<?php

use Illuminate\Database\Seeder;

class Availability extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('availabilities')->insert([
            [
                'resource_id' => 1,
                'project_id' => 1,
                'date' => '2019-09-19'
            ],[
                'resource_id' => 1,
                'project_id' => 1,
                'date' => '2019-09-20'
            ],[
                'resource_id' => 1,
                'project_id' => null,
                'date' => '2019-09-21'
            ],[
                'resource_id' => 1,
                'project_id' => null,
                'date' => '2019-09-22'
            ],[
                'resource_id' => 2,
                'project_id' => null,
                'date' => '2019-09-21'
            ],[
                'resource_id' => 2,
                'project_id' => null,
                'date' => '2019-09-22'
            ],[
                'resource_id' => 3,
                'project_id' => null,
                'date' => '2019-09-21'
            ],[
                'resource_id' => 3,
                'project_id' => null,
                'date' => '2019-09-22'
            ],[
                'resource_id' => 4,
                'project_id' => null,
                'date' => '2019-09-21'
            ],[
                'resource_id' => 4,
                'project_id' => null,
                'date' => '2019-09-22'
            ],[
                'resource_id' => 5,
                'project_id' => null,
                'date' => '2019-09-21'
            ],[
                'resource_id' => 5,
                'project_id' => null,
                'date' => '2019-09-22'
            ],[
                'resource_id' => 1,
                'project_id' => 1,
                'date' => '2019-09-23'
            ],[
                'resource_id' => 1,
                'project_id' => 1,
                'date' => '2019-09-24'
            ],[
                'resource_id' => 4,
                'project_id' => 2,
                'date' => '2019-09-24'
            ],[
                'resource_id' => 1,
                'project_id' => 1,
                'date' => '2019-09-25'
            ],[
                'resource_id' => 4,
                'project_id' => 2,
                'date' => '2019-09-25'
            ],[
                'resource_id' => 1,
                'project_id' => 1,
                'date' => '2019-09-26'
            ],[
                'resource_id' => 4,
                'project_id' => 2,
                'date' => '2019-09-26'
            ],[
                'resource_id' => 4,
                'project_id' => 2,
                'date' => '2019-09-27'
            ]
        ]);
    }
}
