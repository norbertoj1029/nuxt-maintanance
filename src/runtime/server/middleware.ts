import { defineEventHandler, getCookie } from 'h3'

import {
  isMaintenanceEnabled,
  getMaintenanceModeConfig,
  isUnderMaintenance,
  throwMaintenanceError,
  BYPASS_COOKIE_NAME,
} from './../utils'

export default defineEventHandler((event) => {
  // Early return if maintenance mode is not enabled.
  if (!isMaintenanceEnabled()) {
    return
  }

  const maintenanceConfig = getMaintenanceModeConfig()

  // Handle GETTING Bypass
  const bypassCookie = getCookie(event, BYPASS_COOKIE_NAME)
  const bypassCookieValue: string | null = bypassCookie ?? null

  // Handle Maintenance Checks
  if (!isUnderMaintenance(event.path, bypassCookieValue, maintenanceConfig)) {
    return
  }

  throwMaintenanceError()
})
