export function getDashboardUrl(orgId: number, workspaceId: number, dashboardUuid: string) {
  return `/dashboard?orgId=${orgId}&workspaceId=${workspaceId}&dashboardUuid=${dashboardUuid}`;
}
