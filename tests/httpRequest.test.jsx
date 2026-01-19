import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { httpRequest } from '../src/services/api';

describe('httpRequest', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('returns parsed data on success', async () => {
    const payload = { ok: true, data: [1, 2, 3] };

    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => JSON.stringify(payload),
    });

    const result = await httpRequest('/success');

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(payload);
  });

  it('aborts and normalizes timeout errors', async () => {
    vi.useFakeTimers();

    const abortError = new Error('Aborted');
    abortError.name = 'AbortError';

    globalThis.fetch.mockImplementationOnce((_, options) =>
      new Promise((_, reject) => {
        options.signal.addEventListener('abort', () => reject(abortError));
      })
    );

    const promise = httpRequest('/timeout', { timeoutMs: 50, maxRetries: 0 });

    vi.advanceTimersByTime(60);

    await expect(promise).rejects.toThrow('Timeout');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('normalizes network errors and retries until maxRetries', async () => {
    const networkError = new Error('Network down');

    globalThis.fetch.mockRejectedValue(networkError);

    await expect(httpRequest('/network-fail')).rejects.toThrow('Network error');
    expect(globalThis.fetch).toHaveBeenCalledTimes(3); // default maxRetries is 2 => 3 attempts
  });

  it('maps server errors (5xx) to normalized message', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => JSON.stringify({ message: 'boom' }),
    });

    await expect(httpRequest('/server-error')).rejects.toThrow('Server error');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('maps client errors (4xx) to request failed message', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: async () => JSON.stringify({ message: 'not found' }),
    });

    await expect(httpRequest('/client-error')).rejects.toThrow('Request failed 404');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('retries transient error and eventually succeeds', async () => {
    const payload = { ok: true };

    globalThis.fetch
      .mockRejectedValueOnce(new Error('Transient'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: async () => JSON.stringify(payload),
      });

    const result = await httpRequest('/retry');

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual(payload);
  });
});
