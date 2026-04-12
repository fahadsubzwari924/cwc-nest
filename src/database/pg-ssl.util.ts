/**
 * Set PG_SSL=false (or 0, no, off, disable) when Postgres does not use TLS.
 * Omit or set PG_SSL=true for hosts that require SSL (e.g. many managed clouds).
 */
export function isPgSslDisabled(sslEnv: string | undefined): boolean {
  return /^(0|false|no|off|disable)$/i.test(String(sslEnv ?? '').trim());
}
