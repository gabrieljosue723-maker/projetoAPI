<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProdutoResource;
use App\Models\Produto;
use Illuminate\Http\Request;

class ProdutosController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * Suporta pesquisa opcional via query string:
     *   ?nome=cadeira            -> filtra pelo nome (parcial, case-insensitive)
     *   ?preco_min=1000          -> produtos com preço >= 1000
     *   ?preco_max=5000          -> produtos com preço <= 5000
     */
    public function index(Request $request)
    {
        $query = Produto::query();

        if ($request->filled('nome')) {
            $query->where('nome', 'like', '%' . $request->input('nome') . '%');
        }

        if ($request->filled('preco_min')) {
            $query->where('preco', '>=', $request->input('preco_min'));
        }

        if ($request->filled('preco_max')) {
            $query->where('preco', '<=', $request->input('preco_max'));
        }

        return ProdutoResource::collection($query->latest()->get());
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
        'nome' => 'required|string|max:255',
        'descricao' => 'nullable|string',
        'preco' => 'required|numeric|min:0',
        'telefone' => 'nullable|string|max:20',
        'whatsapp' => 'nullable|string|max:20',
        'facebook' => 'nullable|string|max:255',
        'imagem' => 'required|file|mimes:jpeg,png,jpg,webp|max:2048',
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
