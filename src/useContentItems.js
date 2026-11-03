import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';
import { BUNDLED_FAQ_ROWS, groupFaq } from './festivalData';

const cacheKey = kind => `jj_content_${kind}`;

const readCache = kind => {
  try {
    return JSON.parse(localStorage.getItem(cacheKey(kind)));
  } catch {
    return null;
  }
};

const writeCache = (kind, items) => {
  try {
    localStorage.setItem(cacheKey(kind), JSON.stringify(items));
  } catch {
    // Storage full or blocked; the live list still works without the cache.
  }
};

const clearCache = kind => {
  try {
    localStorage.removeItem(cacheKey(kind));
  } catch {
    // Nothing to clear if storage is blocked.
  }
};

// Returns the list saved in Supabase for `kind` (artists, schedule, teams).
// Shows the last saved copy while loading or offline, and the built-in list
// if nothing has been saved yet.
export function useContentItems(kind, fallback) {
  const [items, setItems] = useState(() => readCache(kind) || fallback);

  useEffect(() => {
    let active = true;
    supabase
      .from('content_items')
      .select('data')
      .eq('kind', kind)
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .then(({ data, error }) => {
        if (!active || error) return;
        if (!data || data.length === 0) {
          // Nothing saved (or everything removed): go back to the built-in list.
          clearCache(kind);
          setItems(fallback);
          return;
        }
        const list = data.map(row => row.data);
        writeCache(kind, list);
        setItems(list);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
    // `fallback` is a module-level constant, so it does not need to be a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  return items;
}

// FAQ is stored one row per question; the app receives it grouped into sections.
export function useFaqSections() {
  const rows = useContentItems('faq', BUNDLED_FAQ_ROWS);
  return useMemo(() => groupFaq(rows), [rows]);
}
