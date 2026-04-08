# Nuxt Maintenance Mode

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]

Put your [Nuxt](https://nuxt.com) application behind a maintenance screen when you need it: visitors receive **503 Service Unavailable**, while you can still tune behavior with path rules, a bypass secret, and runtime configuration.

**Links:** [Changelog](/CHANGELOG.md) · [Playground on StackBlitz](https://stackblitz.com/github/kristianbinau/nuxt-maintenance-mode?file=playground%2Fapp.vue)

## Requirements

- [Nuxt](https://nuxt.com) **3.x** (module compatibility: `>=3.0.0`)

## Features

- **HTTP 503** — Maintenance responses use the correct status code so automation and caches behave predictably.
- **Include and exclude paths** — Scope maintenance to specific routes; supports `*` wildcards.
- **Bypass secret** — Optional shared secret with cookie-based bypass for operators and QA.
- **`useMaintenance` composable** — Branch UI or logic on whether the current path is under maintenance.
- **Public runtime config** — Toggle and tune maintenance without redeploying when values come from the environment.
- **TypeScript** — Typed module options and composables.

## Installation

```bash
npx nuxi module add @kristianbinau/nuxt-maintenance-mode
```

Then enable the module in `nuxt.config.ts` (see below).

## Configuration

Register options under the `maintenanceMode` key.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@kristianbinau/nuxt-maintenance-mode'],
  maintenanceMode: {
    enabled: true,
  },
})
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enabled` | `boolean` | `false` | Master switch for maintenance mode. |
| `bypassSecret` | `string \| null` | `null` | If set, visiting `/?bypass=<secret>` sets a bypass cookie so that client can skip maintenance for allowed paths. |
| `include` | `string[] \| null` | `null` | If set, only matching paths are under maintenance. Wildcards (`*`) supported. |
| `exclude` | `string[] \| null` | `null` | Paths that never show maintenance. Wildcards (`*`) supported. |

If both `include` and `exclude` are set, **`include` takes precedence** when evaluating rules.

## Runtime configuration

Values on `runtimeConfig.public` override options from `nuxt.config.ts` when both are present (merge follows your Nuxt runtime config setup).

Exposed public keys:

| Key | Role |
|-----|------|
| `maintenanceModeEnabled` | Same as `maintenanceMode.enabled` |
| `maintenanceModeBypassSecret` | Same as `maintenanceMode.bypassSecret` |
| `maintenanceModeExclude` | Same as `maintenanceMode.exclude` |
| `maintenanceModeInclude` | Same as `maintenanceMode.include` |

Example wiring public env-driven flags in `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      maintenanceModeEnabled: process.env.NUXT_PUBLIC_MAINTENANCE_MODE_ENABLED === 'true',
      maintenanceModeBypassSecret: process.env.NUXT_PUBLIC_MAINTENANCE_MODE_BYPASS_SECRET ?? null,
    },
  },
})
```

Use the same key names as in the table above for other fields when you need them. Nuxt exposes `runtimeConfig.public` values through `NUXT_PUBLIC_*` environment variables according to [Nuxt runtime config](https://nuxt.com/docs/guide/going-further/runtime-config) naming rules.

## Composables

`useMaintenance` reports whether a path is currently treated as under maintenance (using the same rules as server middleware).

```ts
const url = useRequestURL()
const { isUnderMaintenance } = useMaintenance(url.pathname)
```

You may pass an explicit path instead of deriving it from the request:

```ts
const { isUnderMaintenance } = useMaintenance('/blog')
```

## Development

Clone the repository, install dependencies, and use the playground app.

```bash
npm install
npm run dev:prepare
npm run dev
```

Other useful scripts:

| Script | Purpose |
|--------|---------|
| `npm run dev:build` | Production build of the playground |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:types` | `vue-tsc` for the module and playground |
| `npm run release` | Lint, test, build, version, publish (maintainers) |

## License

MIT — see [`package.json`](./package.json) `license` field.

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@kristianbinau/nuxt-maintenance-mode/latest.svg?style=flat&colorA=020420&colorB=00DC82
[npm-version-href]: https://npmjs.com/package/@kristianbinau/nuxt-maintenance-mode
[npm-downloads-src]: https://img.shields.io/npm/dm/@kristianbinau/nuxt-maintenance-mode.svg?style=flat&colorA=020420&colorB=00DC82
[npm-downloads-href]: https://npm.chart.dev/@kristianbinau/nuxt-maintenance-mode
[license-src]: https://img.shields.io/npm/l/@kristianbinau/nuxt-maintenance-mode.svg?style=flat&colorA=020420&colorB=00DC82
[license-href]: https://npmjs.com/package/@kristianbinau/nuxt-maintenance-mode
[nuxt-src]: https://img.shields.io/badge/Nuxt-020420?logo=nuxt.js
[nuxt-href]: https://nuxt.com
