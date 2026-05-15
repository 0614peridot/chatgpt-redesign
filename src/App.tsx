import * as React from 'react';

import AsIsPage from './features/as-is/index';
import NewChatPage from './features/auto-workspaces/index';
import ProjectsPage from './features/projects/index';
import ProjectDetailPage from './features/project-detail/index';

type View = 'new-chat' | 'projects' | 'project-detail' | 'as-is';

export function App() {
  const [view, setView] = React.useState<View>(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'as-is' || v === 'projects') return v;
    if (v === 'project-detail') return 'project-detail';
    return 'new-chat';
  });

  const [activeProject, setActiveProject] = React.useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('project') ?? '';
  });

  const navigate = React.useCallback((v: string) => {
    const base = import.meta.env.BASE_URL; // '/' in dev, '/chatgpt-redesign/' in prod
    if (v.startsWith('project-detail:')) {
      const name = v.slice('project-detail:'.length);
      window.history.pushState({}, '', `${base}?view=project-detail&project=${encodeURIComponent(name)}`);
      setActiveProject(name);
      setView('project-detail');
    } else if (v === 'new-chat') {
      window.history.pushState({}, '', base);
      setView('new-chat');
    } else {
      window.history.pushState({}, '', `${base}?view=${v}`);
      setView(v as View);
    }
  }, []);

  if (view === 'as-is') return <AsIsPage />;
  if (view === 'projects') return <ProjectsPage navigate={navigate} />;
  if (view === 'project-detail') return <ProjectDetailPage projectName={activeProject} navigate={navigate} />;
  return <NewChatPage navigate={navigate} />;
}
