import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mkdtemp, writeFile, readFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { processCopyList } from './copy-files'

describe('processCopyList', () => {
  let tempDir: string

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'builder-test-'))
  })

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true })
  })

  it('does nothing when copy-list.json is missing', async () => {
    // Should return silently without error
    await expect(processCopyList(tempDir)).resolves.toBeUndefined()
  })

  it('throws on invalid repo format', async () => {
    await writeFile(
      join(tempDir, 'copy-list.json'),
      JSON.stringify({
        repo: 'invalid repo!',
        files: [{ src: 'README.md' }],
      }),
    )
    await expect(processCopyList(tempDir)).rejects.toThrow('Invalid repo format')
  })

  it('throws on invalid ref format', async () => {
    await writeFile(
      join(tempDir, 'copy-list.json'),
      JSON.stringify({
        ref: 'bad ref!!',
        files: [{ src: 'README.md' }],
      }),
    )
    await expect(processCopyList(tempDir)).rejects.toThrow('Invalid ref format')
  })

  it('throws on path traversal in src', async () => {
    await writeFile(
      join(tempDir, 'copy-list.json'),
      JSON.stringify({
        files: [{ src: '../../../etc/passwd' }],
      }),
    )

    await expect(processCopyList(tempDir)).rejects.toThrow('Invalid file path')
  })

  it('throws on path traversal in dest', async () => {
    await writeFile(
      join(tempDir, 'copy-list.json'),
      JSON.stringify({
        files: [{ src: 'README.md', dest: '../../../etc/evil' }],
      }),
    )

    await expect(processCopyList(tempDir)).rejects.toThrow('Invalid file path')
  })

  it('fetches and writes files from GitHub', async () => {
    // Mock fetch to avoid network calls
    const mockContent = '# Test File'
    const originalFetch = globalThis.fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockContent),
    })

    await writeFile(
      join(tempDir, 'copy-list.json'),
      JSON.stringify({
        repo: 'incubrain/builder',
        ref: 'main',
        files: [{ src: 'README.md' }],
      }),
    )

    await processCopyList(tempDir)

    const result = await readFile(join(tempDir, 'README.md'), 'utf-8')
    expect(result).toBe(mockContent)
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://raw.githubusercontent.com/incubrain/builder/main/README.md',
    )

    globalThis.fetch = originalFetch
  })

  it('handles fetch failures gracefully', async () => {
    const originalFetch = globalThis.fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    })

    await writeFile(
      join(tempDir, 'copy-list.json'),
      JSON.stringify({
        files: [{ src: 'nonexistent.md' }],
      }),
    )

    // Should not throw — failures are logged but not fatal
    await expect(processCopyList(tempDir)).resolves.toBeUndefined()

    globalThis.fetch = originalFetch
  })

  it('writes to custom dest path', async () => {
    const mockContent = 'custom dest content'
    const originalFetch = globalThis.fetch
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockContent),
    })

    await writeFile(
      join(tempDir, 'copy-list.json'),
      JSON.stringify({
        files: [{ src: 'README.md', dest: 'docs/README.md' }],
      }),
    )

    await processCopyList(tempDir)

    const result = await readFile(join(tempDir, 'docs/README.md'), 'utf-8')
    expect(result).toBe(mockContent)

    globalThis.fetch = originalFetch
  })
})
