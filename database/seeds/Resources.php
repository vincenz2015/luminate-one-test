<?php

use Illuminate\Database\Seeder;

class Resources extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('resources')->insert([
            [
                'id' => 1,
                'name' => 'John Smith',
                'icon' => '🍰'
            ],[
                'id' => 2,
                'name' => 'Jane Doe',
                'icon' => '😍'
            ],[
                'id' => 3,
                'name' => 'Mike Burton',
                'icon' => '🛀'
            ],[
                'id' => 4,
                'name' => 'Lucy Smit',
                'icon' => '😁'
            ],[
                'id' => 5,
                'name' => 'Lou George',
                'icon' => '😀'
            ]
        ]);
    }
}
