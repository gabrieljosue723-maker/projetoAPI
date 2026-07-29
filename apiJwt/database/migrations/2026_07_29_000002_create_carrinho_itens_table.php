<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carrinho_itens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('CASCADE');
            $table->foreignId('produto_id')->constrained('produtos')->onDelete('CASCADE');
            $table->unsignedInteger('quantidade')->default(1);
            $table->timestamps();

            // Um utilizador só pode ter uma linha por produto no carrinho;
            // adicionar de novo só aumenta a quantidade.
            $table->unique(['user_id', 'produto_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrinho_itens');
    }
};
