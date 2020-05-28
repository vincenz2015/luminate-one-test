<?php

namespace App\Http\Controllers;

use App\Http\Resources\AvailabilityResource;
use App\Models\Availability;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class AvailabilityController extends Controller
{
    public function index(){
        $availabilities = Availability::get();
        return new AvailabilityResource($availabilities);
    }

    public function updateProjects(Request $request){
        $validator = Validator::make($request->all(), [
            'changes.*.day_index' => 'required|integer',
            'changes.*.resource_id' => 'required|exists:resources,id',
            'changes.*.status' => 'required',
            'project_id' => 'required|exists:projects,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        return self::updateSchedule($request->input('changes'), $request->input('project_id'));
    }

    public function updateAvailability(Request $request){
        $validator = Validator::make($request->all(), [
            '*.day_index' => 'required|integer',
            '*.resource_id' => 'required|exists:resources,id',
            '*.status' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        return self::updateSchedule($request->input(), null);
    }

    private static function updateSchedule($changes, $projectId){

        //convert day indexes to dates
        $items = self::convertToDates($changes);

        //get all possibly affected dates
        $dates = [];
        foreach($items as $item){
            array_push($dates, $item['date']);
        }
        $availabilities = Availability::whereIn('date', $dates)->get();

        //group into sql updates
        $toCreate = [];
        $toUpdate = [];
        $toDelete = [];

        foreach($items as $item){
            switch ($item['status']){
                case 'assign':
                case 'unavailable':
                    $exists = $availabilities->where('date', $item['date'])
                        ->where('resource_id', $item['resource_id'])
                        ->first();

                    $item['project_id'] = $projectId;
                    unset($item['status']);

                    if($exists) {
                        $item['id'] = $exists->id;
                        array_push($toUpdate, $item);
                    } else {
                        array_push($toCreate, $item);
                    }
                    break;
                case 'remove':
                case 'available':
                    $exists = $availabilities->where('date', $item['date'])
                        ->where('resource_id', $item['resource_id'])
                        ->first();

                    unset($item['status']);
                    if($exists) {
                        array_push($toDelete, $exists->id);
                    }
                    break;
                default:
                    Log::error('unable to parse change: ' . json_encode($item));
            }
        }

        try{
            DB::beginTransaction();

            Availability::insert($toCreate);

            foreach($toUpdate as $update){
                Availability::where('id', $update['id'])
                    ->update(['project_id' => $update['project_id']]);
            }

            Availability::whereIn('id', $toDelete)->delete();

            DB::commit();
        } catch (\Exception $e){
            Log::error($e);
            DB::rollBack();
            return response()->json(['message' => 'update failed, internal database issue. No data was changed.'], 500);
        }

        $availabilities = Availability::get();
        return new AvailabilityResource($availabilities);
    }

    /**
     * @param array $dateIndexes
     * @return array
     */
    private static function convertToDates($dateIndexes){
        $items = [];
        $anchor = Availability::getAnchorDate();
        foreach($dateIndexes as $item) {
            $item['date'] = $anchor->clone()->addDays($item['day_index'])->toDateString();
            unset($item['day_index']); //free up some memory
            array_push($items, $item);
        }
        return $items;
    }
}
