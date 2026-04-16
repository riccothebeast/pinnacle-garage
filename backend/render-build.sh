#!/usr/bin/env bash
# Exit on error
set -o errexit

# Install composer dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

# Clear existing cache
php artisan optimize:clear

# Generate application key if APP_KEY is not set (useful for first deployment)
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Run database migrations
php artisan migrate --force

# Optimize application for production
php artisan config:cache
php artisan route:cache
php artisan view:cache
