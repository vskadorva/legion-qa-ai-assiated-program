import { faker } from '@faker-js/faker';

export type ProgramPayload = {
  name: string;
  description: string;
};

/** Unique program name for happy-path UI and API setup. */
export function buildProgramName(prefix = 'Web Development'): string {
  return `${prefix} ${faker.string.alphanumeric(6)}-${Date.now()}`;
}

/** Happy-path program payload — override fields as needed per test. */
export function buildProgramPayload(overrides: Partial<ProgramPayload> = {}): ProgramPayload {
  return {
    name: buildProgramName(),
    description: faker.lorem.sentence(),
    ...overrides,
  };
}
