export const entityActionExpressions = {
  now: () => new Date().toISOString(),
} as const;

export type EntityActionExpressionKey = keyof typeof entityActionExpressions;
