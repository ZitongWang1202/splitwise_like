export const queryKeys = {
  groups: {
    all: ["groups"] as const,
  },
  balances: {
    all: ["balances"] as const,
    byGroup: (groupId: string) =>
      [...queryKeys.balances.all, groupId] as const,
  },
  settlements: {
    all: ["settlements"] as const,
    byGroup: (groupId: string) =>
      [...queryKeys.settlements.all, groupId] as const,
  },
  groupMembers: {
    all: ["groupMembers"] as const,
    byGroup: (groupId: string) =>
      [...queryKeys.groupMembers.all, groupId] as const,
  },
} as const
