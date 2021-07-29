import { Org } from '../api/org/org.model';
import { UserRole } from '../api/user/user-role.model';
import { User } from '../api/user/user.model';
import { Workspace } from '../api/workspace/workspace.model';

export function buildEsIndexPatternsForDataExport(user: User, userRole: UserRole) {
  if (user.rootAdmin) {
    return ['*'];
  }

  const suffix = getSuffixForUserRole(userRole);

  return buildEsIndexPatterns(userRole, suffix);
}

export function buildEsIndexPatternsForWorkspace(user: User, userRole: UserRole, workspace: Workspace) {
  if (user.rootAdmin) {
    return ['*'];
  }

  const suffix = getSuffixForWorkspace(workspace);

  return buildEsIndexPatterns(userRole, suffix);
}

export function buildEsIndexPatternsForMuster(userRole: UserRole, unitId?: number) {
  if (unitId) {
    return [buildEsIndexPattern({
      org: userRole.role.org!,
      unitId,
      suffix: 'phi',
    })];
  }

  return buildEsIndexPatterns(userRole, 'phi');
}

function buildEsIndexPatterns(userRole: UserRole, suffix: IndexPatternSuffix) {
  if (userRole.allUnits) {
    return [buildEsIndexPattern({
      org: userRole.role.org!,
      unitId: '*',
      suffix,
    })];
  }

  return userRole.units.map(unit => buildEsIndexPattern({
    org: userRole.role.org!,
    unitId: unit.id,
    suffix,
  }));
}

function buildEsIndexPattern(args: {
  org: Org;
  unitId: string | number;
  suffix: IndexPatternSuffix;
}) {
  const { org, unitId, suffix } = args;

  return `${org.indexPrefix}-${unitId}-${suffix}-*`;
}

function getSuffixForUserRole(userRole: UserRole): IndexPatternSuffix {
  if (userRole.role.canViewPHI) {
    return 'phi';
  }

  if (userRole.role.canViewPII) {
    return 'pii';
  }

  return 'base';
}

function getSuffixForWorkspace(workspace: Workspace): IndexPatternSuffix {
  if (workspace.phi) {
    return 'phi';
  }

  if (workspace.pii) {
    return 'pii';
  }

  return 'base';
}

type IndexPatternSuffix = 'base' | 'pii' | 'phi';
