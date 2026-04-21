import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('GitHub Actions CI workflow', () => {
  it('defines the expected pull_request and main push pipeline', () => {
    const workflowPath = resolve(process.cwd(), '.github/workflows/ci.yml');
    const workflow = readFileSync(workflowPath, 'utf8');

    expect(workflow).toContain('name: CI');
    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('- opened');
    expect(workflow).toContain('- synchronize');
    expect(workflow).toContain('- reopened');
    expect(workflow).toContain('- ready_for_review');
    expect(workflow).toContain('push:');
    expect(workflow).toContain('- main');
    expect(workflow).toContain('cancel-in-progress: true');
    expect(
      Array.from(
        workflow.matchAll(
          /node-version:\s*['"]?20(?:\.x|(?:\.\d+){1,2})?['"]?/g
        )
      )
    ).toHaveLength(4);
    expect(workflow).toContain('lint:');
    expect(workflow).toContain('typecheck:');
    expect(workflow).toContain('test:');
    expect(workflow).toContain('build:');
    expect(workflow).toContain('npm ci');
    expect(workflow).toContain('npm run lint');
    expect(workflow).toContain('npm run typecheck');
    expect(workflow).toContain('npm test');
    expect(workflow).toContain('npm run build');
  });
});
