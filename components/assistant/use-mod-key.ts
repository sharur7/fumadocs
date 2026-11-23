'use client';

import { useEffect, useState } from 'react';

/** "⌘" on Apple devices, "Ctrl+" elsewhere. Starts as "⌘" to match the server render. */
export function useModKey() {
  const [mod, setMod] = useState('⌘');
  useEffect(() => {
    const platform =
      (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform ??
      navigator.platform ??
      '';
    if (!/mac|iphone|ipad|ipod/i.test(platform)) setMod('Ctrl+');
  }, []);
  return mod;
}
