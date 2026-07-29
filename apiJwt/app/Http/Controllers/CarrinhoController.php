<?php

namespace App\Http\Controllers;

use App\Http\Resources\CarrinhoItemResource;
use App\Models\CarrinhoItem;
use App\Models\Produto;
use Illuminate\Http\Request;

class CarrinhoController extends Controller
{
    /**
     * Lista os itens do carrinho do utilizador autenticado.
     */
    public function index(Request $request)
    {
        $itens = CarrinhoItem::with('produto.user')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        $total = $itens->sum(fn ($item) => $item->quantidade * $item->produto->preco);

        return response()->json([
            'data' => CarrinhoItemResource::collection($itens),
            'total' => round($total, 2),
        ]);
    }

    /**
     * Adiciona um produto ao carrinho.
     * Se o produto já estiver no carrinho, soma a quantidade em vez de duplicar a linha.
     */
    public function store(Request $request)
    {
        $dados = $request->validate([
            'produto_id' => 'required|exists:produtos,id',
            'quantidade' => 'sometimes|integer|min:1',
        ]);

        $quantidade = $dados['quantidade'] ?? 1;
        $userId = $request->user()->id;

        $item = CarrinhoItem::where('user_id', $userId)
            ->where('produto_id', $dados['produto_id'])
            ->first();

        if ($item) {
            $item->quantidade += $quantidade;
            $item->save();
        } else {
            $item = CarrinhoItem::create([
                'user_id' => $userId,
                'produto_id' => $dados['produto_id'],
                'quantidade' => $quantidade,
            ]);
        }

        $item->load('produto.user');

        return new CarrinhoItemResource($item);
    }

    /**
     * Atualiza a quantidade de um item do carrinho.
     */
    public function update(Request $request, string $id)
    {
        $dados = $request->validate([
            'quantidade' => 'required|integer|min:1',
        ]);

        $item = CarrinhoItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $item->update($dados);
        $item->load('produto.user');

        return new CarrinhoItemResource($item);
    }

    /**
     * Remove um item específico do carrinho.
     */
    public function destroy(Request $request, string $id)
    {
        $item = CarrinhoItem::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $item->delete();

        return response()->json([
            'message' => 'Produto removido do carrinho.',
        ]);
    }

    /**
     * Esvazia todo o carrinho do utilizador autenticado.
     */
    public function limpar(Request $request)
    {
        CarrinhoItem::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'message' => 'Carrinho esvaziado com sucesso.',
        ]);
    }
}
