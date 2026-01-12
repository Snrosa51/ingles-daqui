#!/usr/bin/env bash
set -euo pipefail

cd /opt/ingles-daqui

echo "==> Pull do GitHub..."
git pull origin main

echo "==> Build & up..."
docker compose up -d --build

echo "==> Status:"
docker compose ps

echo "==> Últimos logs:"
docker compose logs --tail=40

echo "✅ Update concluído com sucesso!"
