import type { Page, Route } from '@playwright/test';

const PROGRAMS_COLLECTION = /\/api\/programs\/?$/;
const PROGRAMS_ITEM = /\/api\/programs\/([^/]+)$/;

function programsPathname(url: string): string | null {
  try {
    return new URL(url).pathname;
  } catch {
    return null;
  }
}

export async function mockEmptyProgramsList(page: Page): Promise<void> {
  await page.route('**/api/programs**', async (route: Route) => {
    const pathname = programsPathname(route.request().url());
    if (route.request().method() === 'GET' && pathname && PROGRAMS_COLLECTION.test(pathname)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
      return;
    }
    await route.continue();
  });
}

type MockProgram = { id: string; name: string; description: string };

export async function mockMutableProgramsApi(page: Page): Promise<void> {
  const programs: MockProgram[] = [];

  await page.route('**/api/programs**', async (route: Route) => {
    const method = route.request().method();
    const pathname = programsPathname(route.request().url());

    if (!pathname) {
      await route.continue();
      return;
    }

    if (method === 'GET' && PROGRAMS_COLLECTION.test(pathname)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: programs }),
      });
      return;
    }

    if (method === 'POST' && PROGRAMS_COLLECTION.test(pathname)) {
      const body = route.request().postDataJSON() as { name: string; description: string };
      const program: MockProgram = {
        id: `mock-${Date.now()}`,
        name: body.name,
        description: body.description,
      };
      programs.push(program);
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ data: program }),
      });
      return;
    }

    const deleteMatch = PROGRAMS_ITEM.exec(pathname);
    if (method === 'DELETE' && deleteMatch) {
      const id = deleteMatch[1];
      const index = programs.findIndex((program) => program.id === id);
      if (index >= 0) {
        programs.splice(index, 1);
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      return;
    }

    await route.continue();
  });
}
