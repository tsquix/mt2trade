import { useMemo } from 'react';

export function useFilterByRegex(
  debouncedPhrase,
  servers,
  fieldsToFilter = []
) {
  return useMemo(() => {
    if (!debouncedPhrase) return servers || [];

    const cleanPhrase = debouncedPhrase.replace(/\s+/g, '');
    const regex = new RegExp(cleanPhrase, 'i');

    // Pre-extract and normalize fields once
    const prepared = servers.map((s) => ({
      original: s,
      fields: fieldsToFilter.map((field) => {
        const value = field.split('.').reduce((acc, key) => acc?.[key], s);
        return typeof value === 'string' ? value.replace(/\s+/g, '') : '';
      }),
    }));

    // First full search
    let result = prepared
      .filter((p) => p.fields.some((f) => regex.test(f)))
      .map((p) => p.original);

    // Partial fallback search
    if (result.length === 0 && cleanPhrase.length > 2) {
      const partial = cleanPhrase.slice(0, 2);
      const regexPartial = new RegExp(partial, 'i');

      result = prepared
        .filter((p) => p.fields.some((f) => regexPartial.test(f)))
        .map((p) => p.original);
    }

    return result;
  }, [debouncedPhrase, servers, fieldsToFilter]);
}
