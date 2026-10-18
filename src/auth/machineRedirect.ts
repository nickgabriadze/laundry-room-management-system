const MACHINE_ROUTE_PATTERN = /^\/machine\/[WD][EFG]\d+$/;

export function getMachineRedirect(search: string) {
  const requestedRoute = new URLSearchParams(search).get("redirect");
  return requestedRoute && MACHINE_ROUTE_PATTERN.test(requestedRoute)
    ? requestedRoute
    : null;
}

export function getPostOnboardingRoute(search: string) {
  return getMachineRedirect(search) ?? "/";
}
