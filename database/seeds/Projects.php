<?php

use Illuminate\Database\Seeder;

class Projects extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('projects')->insert([
            [
                'id' => 1,
                'name' => 'Apple',
                'icon' => '😡',
                'estimate' => 120
            ],[
                'id' => 2,
                'name' => 'Banana',
                'icon' => '👛',
                'estimate' => 120
            ],[
                'id' => 3,
                'name' => 'Orange',
                'icon' => '👓',
                'estimate' => 120
            ],[
                'id' => 4,
                'name' => 'Pineapple',
                'icon' => '😰',
                'estimate' => 120
            ],[
                'id' => 5,
                'name' => 'Watermelon',
                'icon' => '🆗',
                'estimate' => 120
            ]
        ]);
    }
}
