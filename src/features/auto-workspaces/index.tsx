import * as React from 'react';

import { getConversations } from '../../lib/data';
import { SearchModal } from './components/search-modal/SearchModal';
import { useSearchModalStore } from './stores/searchModalStore';

function iconUrl(name: string): string {
  return new URL(`../../assets/icons/${name}.svg`, import.meta.url).toString();
}

type SidebarItemProps = {
  icon: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
};

function SidebarItem({ icon, label, isActive = false, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        height: 'var(--sidebar-item-height)',
        paddingInline: 'var(--sidebar-item-padding)',
        borderRadius: 'var(--sidebar-item-radius)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-xs)',
        background: isActive ? 'var(--color-bg-hover)' : 'transparent',
        color: 'var(--color-text-primary)',
      }}
    >
      <img alt="" src={iconUrl(icon)} style={{ width: 20, height: 20, opacity: 'var(--opacity-100)' }} />
      <div style={{ fontSize: 'var(--text-body-sm)', lineHeight: 'var(--line-height-20)', color: 'inherit' }}>{label}</div>
    </button>
  );
}

function SidebarRecentItem({ title }: { title: string }) {
  return (
    <button
      type="button"
      style={{
        width: '100%',
        height: 'var(--sidebar-item-height)',
        paddingInline: 'var(--sidebar-item-padding)',
        borderRadius: 'var(--sidebar-item-radius)',
        display: 'flex',
        alignItems: 'center',
        color: 'var(--color-text-primary)',
        background: 'transparent',
        overflow: 'hidden',
      }}
      title={title}
    >
      <div
        style={{
          fontSize: 'var(--text-body-sm)',
          lineHeight: 'var(--line-height-20)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          width: '100%',
          textAlign: 'left',
        }}
      >
        {title}
      </div>
    </button>
  );
}

export default function AutoWorkspacesToBePage() {
  const { openSearch, closeSearch, toggleSearch } = useSearchModalStore();

  const recent = React.useMemo(() => {
    return [...getConversations()]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);
  }, []);

  // Start with modal open to match Figma frame.
  React.useEffect(() => {
    openSearch();
  }, [openSearch]);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeSearch();
        return;
      }
      const isModK = (e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey);
      if (isModK) {
        e.preventDefault();
        toggleSearch();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closeSearch, toggleSearch]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--color-bg-default)' }}>
      <aside
        style={{
          width: 'var(--sidebar-width)',
          background: 'var(--sidebar-bg)',
          borderRight: 'var(--border-width-default) solid var(--color-grey-5-alpha-5)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <div style={{ padding: 'var(--sidebar-item-padding)', display: 'flex', flexDirection: 'column', gap: 'var(--sidebar-section-gap)' }}>
          <div style={{ height: 'var(--height-56)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button type="button" style={{ width: 36, height: 36, borderRadius: 'var(--button-radius)' }}>
              <img alt="" src={iconUrl('sidebar')} style={{ width: 20, height: 20 }} />
            </button>
            <button type="button" style={{ width: 36, height: 36, borderRadius: 'var(--button-radius)' }}>
              <img alt="" src={iconUrl('X')} style={{ width: 20, height: 20 }} />
            </button>
          </div>

          <div
            style={{
              paddingBottom: 'var(--spacing-sm)',
              borderBottom: 'var(--border-width-default) solid var(--color-grey-5-alpha-5)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            <SidebarItem icon="new-chat" label="New Chat" isActive />
            <SidebarItem icon="search" label="Search chats" onClick={openSearch} />
            <SidebarItem icon="apps" label="Apps" />
            <SidebarItem icon="more" label="More" />
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 'var(--sidebar-item-padding)' }}>
          <div style={{ fontSize: 'var(--text-caption)', lineHeight: 'var(--line-height-14)', color: 'var(--color-text-muted)', padding: 'var(--space-6) 0' }}>
            Recents
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {recent.map((c) => (
              <SidebarRecentItem key={c.id} title={c.title} />
            ))}
          </div>
        </div>

        <div style={{ padding: 'var(--sidebar-item-padding)', borderTop: 'var(--border-width-default) solid var(--color-grey-5-alpha-5)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <div style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--color-grey-91)', display: 'grid', placeItems: 'center', fontSize: 'var(--text-caption)' }}>
              CS
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--text-body-sm)', lineHeight: 'var(--line-height-20)', color: 'var(--color-text-primary)' }}>Chanhee Shin</div>
              <div style={{ fontSize: 'var(--text-caption)', lineHeight: 'var(--line-height-14)', color: 'var(--color-text-muted)' }}>Free</div>
            </div>
            <button type="button" style={{ height: 32, paddingInline: 'var(--space-12)', borderRadius: 999, border: 'var(--border-width-thick) solid var(--color-grey-56-alpha-20)' }}>
              <div style={{ fontSize: 'var(--text-body-sm)', lineHeight: 'var(--line-height-20)', color: 'var(--color-text-secondary)' }}>Upgrade</div>
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, position: 'relative', background: 'var(--color-bg-default)' }}>
        <div style={{ height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', color: 'var(--color-text-primary)' }}>
            <div style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--line-height-24)' }}>ChatGPT</div>
            <img alt="" src={iconUrl('chevron-down')} style={{ width: 20, height: 20, opacity: 0.7 }} />
          </div>
        </div>

        <div style={{ position: 'absolute', left: '50%', bottom: 56, transform: 'translateX(-50%)', width: 640, maxWidth: 'calc(100% - 64px)' }}>
          <div
            style={{
              height: 42,
              borderRadius: 999,
              border: 'var(--border-width-default) solid var(--color-border-subtle)',
              background: 'var(--color-bg-default)',
              display: 'flex',
              alignItems: 'center',
              paddingInline: 'var(--space-12)',
              gap: 'var(--spacing-sm)',
              boxShadow: '0 8px 24px var(--color-black-alpha-15)',
            }}
          >
            <input
              placeholder="Message ChatGPT"
              style={{
                flex: 1,
                fontSize: 'var(--text-body-sm)',
                lineHeight: 'var(--line-height-20)',
                color: 'var(--color-text-primary)',
              }}
            />
            <button type="button" style={{ width: 36, height: 36, borderRadius: 999 }}>
              <img alt="" src={iconUrl('audio')} style={{ width: 20, height: 20 }} />
            </button>
            <button type="button" style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--color-grey-5)' }}>
              <img alt="" src={iconUrl('voice-record')} style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </div>

        <div style={{ position: 'absolute', left: '50%', bottom: 10, transform: 'translateX(-50%)', fontSize: 'var(--text-caption)', color: 'var(--color-text-muted)' }}>
          ChatGPT can make mistakes. Check important info. See Cookie Preferences.
        </div>

        <SearchModal enableGroupSuggestion={false} />
      </main>
    </div>
  );
}

