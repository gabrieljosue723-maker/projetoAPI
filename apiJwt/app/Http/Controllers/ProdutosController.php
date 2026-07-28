<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProdutoResource;
use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ProdutoResource::collection(Produto::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {


        $dados = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nome' => 'required|string',
            'descricao' => 'sometimes|string',
            'preco' => 'required|numeric',
            'imagem' => 'required|file',
        ]);
        if ($request->hasFile('imagem')) {
            $dados['imagem'] = $request->file('imagem')->store('produtos', 'public');
        }

        $produto = Produto::create($dados);

        return new ProdutoResource($produto);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return new ProdutoResource(Produto::findOrFail($id));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $dados = $request->validate([
            'nome' => 'string',
            'descricao' => 'string',
            'preco' => 'numeric',
            'imagem' => 'string',
        ]);

        $produto = Produto::findOrFail($id);
        $produto->update($dados);
        return new ProdutoResource($produto);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $produto = Produto::findOrFail($id);
        $produto->delete();
        return response()->json([
            'message' => 'Produto deletado com sucesso',
        ]);
    }

    public function produtosDeletados()
    {
        return ProdutoResource::collection(Produto::onlyTrashed()->get());
    }

    public function restaurar(string $id)
    {
        $produto = Produto::withTrashed()->findOrFail($id);
        $produto->restore();
        return new ProdutoResource($produto);
    }

    public function deletarPermanente(string $id)
    {
        $produto = Produto::withTrashed()->findOrFail($id);
        $produto->forceDelete();
        return response()->json([
            'message' => 'Produto deletado permanentemente',
        ]);
    }
}
