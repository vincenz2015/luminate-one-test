<?php

namespace App\Http\Resources;

use App\Models\Availability;
use Illuminate\Http\Resources\Json\ResourceCollection;

class AvailabilityResource extends ResourceCollection
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $anchor = Availability::getAnchorDate();
        $response = [];

        foreach($this->collection as $item){
            $dayIndex = $anchor->diffInDays($item->date) + 1;
            array_push($response, [
                "id" => $item->id,
                "day_index" => $dayIndex,
                "resource_id" => $item->resource_id,
                "project_id" => $item->project_id,
                "notes" => $item->notes,
            ]);
        }

        return $response;
    }
}
