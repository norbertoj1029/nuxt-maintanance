import {
  defineNuxtModule,
  createResolver,
  addImportsDir,
  addRouteMiddleware,
  addServerHandler,
} from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  /**
   * Enable or disable the maintenance mode
   */
  enabled: boolean

  /**
   * Bypass secret, used to bypass maintenance mode
   * If set, users can bypass maintenance mode by visiting `/?bypass=<bypassCodevalue>`
   */
  bypassSecret: string | null

  /**
   * Exclude paths from maintenance mode
   * If set, these paths will not be in maintenance mode
   *
   * Supports wildcard paths like `/blog/*`
   *
   * When both `exclude` and `include` are set, `include` will take precedence
   */
  exclude: string[] | null
  /**
   * Include paths in maintenance mode
   * If set, only these paths will be in maintenance mode
   *
   * Supports wildcard paths like `/blog/*`
   *
   * When both `exclude` and `include` are set, `include` will take precedence
   */
  include: string[] | null
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'maintenance-mode',
    configKey: 'maintenanceMode',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },
  defaults: {
    enabled: false,
    bypassSecret: null,
    exclude: null,
    include: null,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Add Options to Runtime Config
    const pub = nuxt.options.runtimeConfig.public as {
      maintenanceModeEnabled: boolean
      maintenanceModeBypassSecret: string | null
      maintenanceModeExclude: string[] | null
      maintenanceModeInclude: string[] | null
    }
    pub.maintenanceModeEnabled ||= options.enabled
    pub.maintenanceModeBypassSecret ||= options.bypassSecret
    pub.maintenanceModeExclude ||= options.exclude
    pub.maintenanceModeInclude ||= options.include

    // Add Composable
    addImportsDir(resolve('./runtime/composables'))

    // Add Middleware
    addRouteMiddleware(
      {
        name: 'maintenance-mode',
        path: resolve('./runtime/middleware'),
        global: true,
      },
      { prepend: true, override: true },
    )

    // Add Nitro Middleware
    addServerHandler({
      handler: resolve('./runtime/server/middleware'),
      middleware: true,
    })
  },
})
