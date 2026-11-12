#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
root=$(mktemp -d)
project=print3d-smoke-${RANDOM}
cleanup() { docker compose -p "$project" -f deploy/docker-compose.yml --project-directory "$root" down >/dev/null 2>&1 || true; rm -rf "$root"; }
trap cleanup EXIT
mkdir -p "$root/state/data" "$root/state/uploads"
chmod -R 777 "$root/state"
printf 'ADMIN_SESSION_SECRET=smoke-test-only-secret-not-for-production\n' > "$root/runtime.env"
export SITE_PORT=3199
# Production must refuse an absent database. Only this temporary CI DB is initialized.
if docker run --rm "$SITE_IMAGE"; then echo 'Image accepted absent production data'; exit 1; fi
docker run --rm -v "$root/state/data:/app/data" --entrypoint sh "$SITE_IMAGE" -c './node_modules/.bin/prisma migrate deploy'
docker run --rm -v "$root/state/data:/app/data" -v "$root/state/uploads:/app/uploads" --entrypoint node "$SITE_IMAGE" -e '
const {PrismaClient}=require("@prisma/client"); const p=new PrismaClient();
p.siteSetting.create({data:{key:"deploy-smoke",value:"retained"}}).then(()=>require("fs").writeFileSync("/app/uploads/sentinel","retained")).catch(()=>process.exitCode=1).finally(()=>p.$disconnect());'
compose() { docker compose -p "$project" -f deploy/docker-compose.yml --project-directory "$root" "$@"; }
compose up -d --wait --wait-timeout 180 app
curl -fsS http://127.0.0.1:3199/api/health
compose up -d --force-recreate --wait --wait-timeout 180 app
compose exec -T app node -e '
const {PrismaClient}=require("@prisma/client"); const p=new PrismaClient();
p.siteSetting.findUniqueOrThrow({where:{key:"deploy-smoke"}}).then(r=>{if(r.value!=="retained" || require("fs").readFileSync("/app/uploads/sentinel","utf8")!=="retained")process.exitCode=1}).catch(()=>process.exitCode=1).finally(()=>p.$disconnect());'
