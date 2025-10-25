import { useMemo } from 'react';

export function useFilterByRegex(
  debouncedPhrase,
  servers,
  fieldsToFilter = []
) {
  return useMemo(() => {
    if (!debouncedPhrase) return servers;
    //wyszukiwarka z regex
    const cleanPhrase = debouncedPhrase.replace(/\s+/g, '');
    const regex = new RegExp(cleanPhrase, 'i');
    let res = servers.filter((s) =>
      fieldsToFilter.some((field) => {
        const value = s[field];
        return (
          typeof value === 'string' && regex.test(value.replace(/\s+/g, ''))
        );
      })
    );
    //partial search if nothing found
    if (res.length === 0 && debouncedPhrase.length > 1) {
      const partial = debouncedPhrase.slice(0, 1).replace(/\s+/g, '');
      const regexPartial = new RegExp(partial, 'i');

      res = servers.filter((s) =>
        fieldsToFilter.some((field) => {
          const value = s[field];
          return (
            typeof value === 'string' &&
            regexPartial.test(value.replace(/\s+/g, ''))
          );
        })
      );
    }

    return res;
  }, [debouncedPhrase, servers]);
}
