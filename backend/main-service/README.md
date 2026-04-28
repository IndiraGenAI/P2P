# P2P-ORG · Main Service (NestJS)

Sibling service to `back-service`. Same conventions (configs, core, auth, guards, baseController, swagger, etc.) but starts with **no business modules** so you can add new ones here without touching `back-service`.

- Runs on **port 4000** by default (see `.env`)
- API prefix `/api`
- Shares the same database (`erp-db` package) and JWT secret as `back-service`
  - As long as both services use the same `JWT_SECRET`, a token issued by `back-service` will also work on `main-service` and vice-versa

## Set env

Copy `.env.example` to `.env` and adjust values.

## Install

```bash
npm install
```

## Run

```bash
# watch mode
npm run start:dev

# production
npm run build
npm run start:prod
```

Health check: <http://localhost:4000/api/check-health>
Swagger (DEV only): <http://localhost:4000/swagger>

## Adding a new module

1. Create the module folder under `src/modules/<your-module>/`
2. Register it in `src/modules/application.module.ts` by pushing into `ApplicationModules`

## License

Nest is [MIT licensed](LICENSE).
