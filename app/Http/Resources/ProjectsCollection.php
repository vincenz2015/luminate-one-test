<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ProjectsCollection extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $response = [];

        foreach($this->collection as $item){
            array_push($response, [
                "id" => $item->id,
                "icon" => $item->icon,
                "name" => $item->name,
                "estimate" => $item->estimate,
                "scheduled" => $item->availabilities_count,
                "remaining" => $item->estimate - $item->availabilities_count,
                "archived" => $item->archived
            ]);
        }

        return $response;
    }
}
