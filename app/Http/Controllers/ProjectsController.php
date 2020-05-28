<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectsCollection;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProjectsController extends Controller
{
    public function index(){
        return new ProjectsCollection(Project::withCount('availabilities')->get());
    }

    public function create(Request $request){
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'icon' => 'required',
            'estimate' => 'required|numeric'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $project = Project::create([
            'name' => $request->input('name'),
            'icon' => $request->input('icon'),
            'estimate' => $request->input('estimate')
        ]);

        return response()->json($project);
    }

    public function update(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:projects,id',
            'name' => 'required',
            'icon' => 'required',
            'estimate' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $project = Project::find($request->input('id'));
        if($request->input('name')){
            $project->name = $request->input('name');
        }
        if($request->input('icon')){
            $project->icon = $request->input('icon');
        }
        if($request->input('estimate')){
            $project->estimate = $request->input('estimate');
        }
        if($request->input('archived')){
            $project->archived = true;
        } else {
            $project->archived = false;
        }
        $project->save();

        return response()->json($project, 200);
    }

    public function delete(Request $request, $id){
        $validator = Validator::make(array_merge($request->all(), ['id' => $id]), [
            'id' => 'required|exists:projects,id',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        Project::find($id)->delete();

        return response()->json(['message' => 'resource deleted'],200);
    }
}
