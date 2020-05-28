<?php

namespace App\Http\Controllers;

use App\Http\Resources\ResourcesCollection;
use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResourcesController extends Controller
{
    public function index(){
        return new ResourcesCollection(Resource::get());
    }

    public function create(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'icon' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $resource = Resource::create([
            'name' => $request->input('name'),
            'icon' => $request->input('icon'),
        ]);

        return response()->json($resource);
    }

    public function update(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:resources,id',
            'name' => 'required',
            'icon' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $resource = Resource::find($request->input('id'));
        if($request->input('name')){
            $resource->name = $request->input('name');
        }
        if($request->input('icon')){
            $resource->icon = $request->input('icon');
        }
        if($request->input('archived')){
            $resource->archived = true;
        } else {
            $resource->archived = false;
        }
        $resource->save();

        return response()->json($resource, 200);
    }

    public function delete(Request $request, $id){
        $validator = Validator::make(array_merge($request->all(), ['id' => $id]), [
            'id' => 'required|exists:resources,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        Resource::find($id)->delete();

        return response()->json(['message' => 'resource deleted'],200);
    }
}
