<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ResourcesCollection extends ResourceCollection
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
                "archived" => $item->archived
            ]);
        }

        return $response;
    }
}
