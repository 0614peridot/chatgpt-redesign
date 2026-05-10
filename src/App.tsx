import * as React from 'react';

import AsIsPage from './features/as-is/index';
import AutoWorkspacesToBePage from './features/auto-workspaces/index';

export function App() {
  const view = new URLSearchParams(window.location.search).get('view');
  if (view === 'to-be') return <AutoWorkspacesToBePage />;
  return <AsIsPage />;
}

