<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     *
     * Torna a coluna "foto" opcional, porque o formulário de registo
     * simples (usado no botão "Criar conta" do login) não pede foto.
     */
    public function up(): void
    {
        DB::statement('ALTER TABLE users MODIFY foto VARCHAR(255) NULL DEFAULT NULL');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE users MODIFY foto VARCHAR(255) NOT NULL DEFAULT ''");
    }
};
