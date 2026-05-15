import * as React from 'react';

import AsIsPage from './features/as-is/index';
import NewChatPage from './features/auto-workspaces/index';
import ProjectsPage from './features/projects/index';

type View = 'new-chat' | 'projects' | 'as-is';

export function App() {
  const [view, setView] = React.useState<View>(() => {
    const v = new URLSearchParams(window.location.search).get('view');
    if (v === 'as-is' || v === 'projects') return v;
    return 'new-chat';
  });

  const navigate = React.useCallback((v: string) => {
    window.history.pushState({}, '', v === 'new-chat' ? '/' : `?view=${v}`);
    setView(v as View);
  }, []);

  if (view === 'as-is') return <AsIsPage />;
  if (view === 'projects') return <ProjectsPage navigate={navigate} />;
  return <NewChatPage navigate={navigate} />;
}
