#!/bin/sh

docker-compose --env-file .env.test --profile test up -d

echo -e "\n:: Postgres not yet ready to accept connections\n"

WAIT_FOR_PG_ISREADY="while ! pg_isready; do sleep 1; done;"
docker-compose exec gcb_postgres_test bash -c "$WAIT_FOR_PG_ISREADY"

echo -e "\n:: Postgres ready to accept connections\n"

echo -e ":: Running migrations...\n"
dotenv -e .env.test npx prisma migrate deploy

echo -e "\n:: Running tests...\n"

if [[ $1 = "integration" ]]; then
    npx jest roots __tests__/integration/ ${@:2}
else
    npx jest $@
fi

EXIT=$?

echo ""

docker-compose --profile test down

exit $EXIT
