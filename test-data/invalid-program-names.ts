/** Curated invalid program names for validation / negative-path tests. */
export const INVALID_PROGRAM_NAMES = {
  empty: '',
  whitespaceOnly: '   ',
  tabsOnly: '\t\t',
} as const;

export const DUPLICATE_NAME_SCENARIO = {
  seedDescription: 'Original full-stack curriculum',
  conflictDescription: 'Second program with the same title',
} as const;
