<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call(Projects::class);
        $this->call(Resources::class);
        $this->call(Availability::class);
    }
}
