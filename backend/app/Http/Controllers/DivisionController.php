<?php

namespace App\Http\Controllers;

use App\Models\Division;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    public function index(Request $request)
    {
        $name = $request->input('name');

        $query = Division::query();

        if ($name) {
            $query->where('name', 'like', '%' . $name . '%');
        }

        $divisions = $query->paginate(10);

        return response()->json([
            'status' => 'success',
            'message' => 'Data divisions fetched successfully',
            'data' => [
                'divisions' => $divisions->items(),
            ],
            'pagination' => [
                'current_page' => $divisions->currentPage(),
                'last_page' => $divisions->lastPage(),
                'per_page' => $divisions->perPage(),
                'total' => $divisions->total(),
            ],
        ]);
    }

    public function getDivisionByUUID($uuid)
    {
        $division = Division::find($uuid); // Mengambil divisi berdasarkan UUID

        if (!$division) {
            return response()->json([
                'status' => 'error',
                'message' => 'Division not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Division retrieved successfully',
            'data' => $division,
        ]);
    }
}
