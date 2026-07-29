#!/bin/sh
set -e

cd /var/www/html

echo "Rodando migrations..."
php artisan migrate --force

echo "Iniciando Apache..."
exec apache2-foreground
