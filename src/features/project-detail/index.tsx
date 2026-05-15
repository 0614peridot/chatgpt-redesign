import * as React from 'react';
import { getConversations } from '../../lib/data';

type NavigateFn = (view: string) => void;

function iconUrl(name: string): string {
  return new URL(`../../assets/icons/${name}.svg`, import.meta.url).toString();
}

function gifUrl(name: string): string {
  return new URL(`../../assets/gif/${name}.gif`, import.meta.url).toString();
}

// ── Micro components ──────────────────────────────────────────────────────────
function SidebarItem({
  icon, label, isSelected = false, onClick,
}: { icon?: string; label: string; isSelected?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-6)',
        width: '100%', minHeight: 'var(--sidebar-item-height)',
        paddingTop: '7.5px', paddingBottom: '8.5px', paddingInline: 'var(--sidebar-item-padding)',
        borderRadius: 'var(--sidebar-item-radius)',
        background: isSelected ? 'var(--color-grey-91)' : 'transparent',
        color: 'var(--color-text-primary)', textAlign: 'left', overflow: 'hidden',
      }}
    >
      {icon && (
        <span style={{ flexShrink: 0, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img alt="" src={iconUrl(icon)} style={{ width: 20, height: 20 }} />
        </span>
      )}
      <span style={{
        flex: 1, minWidth: 0, fontFamily: 'var(--font-family-body)',
        fontSize: 'var(--font-size-14)', lineHeight: 'var(--line-height-20)',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        {label}
      </span>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      paddingInline: 'var(--space-12)', paddingBlock: 'var(--space-4)',
      fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-14)',
      lineHeight: 'var(--line-height-20)', color: 'var(--color-text-muted)',
      flexShrink: 0, width: '100%',
    }}>
      {children}
    </div>
  );
}

function IconBtn({
  icon, variant = 'subtle', size = 36, iconSize = 20, onClick,
}: { icon: string; variant?: 'primary' | 'subtle' | 'square'; size?: number; iconSize?: number; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size,
        borderRadius: variant === 'square' ? 'var(--radius-8)' : 'var(--radius-full)',
        background: variant === 'primary' ? 'var(--color-grey-5)' : 'transparent',
      }}
    >
      <img
        alt="" src={iconUrl(icon)}
        style={{ width: iconSize, height: iconSize, filter: variant === 'primary' ? 'invert(1)' : undefined }}
      />
    </button>
  );
}

function SectionTab({
  label, isSelected, onClick,
}: { label: string; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingInline: 'var(--section-btn-padding-x)', paddingBlock: 'var(--section-btn-padding-y)',
        borderRadius: 'var(--section-btn-radius)',
        background: isSelected ? 'var(--section-btn-bg-selected)' : 'transparent',
        cursor: 'pointer',
      }}
    >
      <span style={{
        fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-14)',
        lineHeight: 'var(--line-height-20)', whiteSpace: 'nowrap',
        color: isSelected ? 'var(--section-btn-text-selected)' : 'var(--section-btn-text-default)',
      }}>
        {label}
      </span>
    </button>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const STATIC_PROJECTS = ["Master's Thesis", 'Coding study', 'Interview Prep'];

function Sidebar({ navigate, activeProjectName }: { navigate: NavigateFn; activeProjectName: string }) {
  const recent = React.useMemo(
    () => [...getConversations()]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 13),
    [],
  );

  return (
    <aside style={{
      flexShrink: 0, width: 'var(--sidebar-width)', background: 'var(--color-bg-sidebar)',
      borderRight: 'var(--border-width-default) solid var(--color-grey-5-alpha-5)',
      display: 'flex', flexDirection: 'column', height: '100%', zIndex: 2,
    }}>
      {/* Sticky top */}
      <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 'var(--sidebar-section-gap)', paddingInline: 'var(--sidebar-item-padding)' }}>
        <div style={{ height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 'var(--space-2)' }}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <IconBtn icon="sidebar" variant="square" />
            <IconBtn icon="edit" variant="square" />
          </div>
        </div>
        <div style={{ borderBottom: 'var(--border-width-default) solid var(--color-grey-5-alpha-5)', paddingBottom: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', overflow: 'hidden' }}>
          <SidebarItem icon="new-chat" label="New chat" onClick={() => navigate('new-chat')} />
          <SidebarItem icon="search" label="Search chats" />
        </div>
      </div>

      {/* Scrollable */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', paddingInline: 'var(--sidebar-item-padding)' }}>
        {/* Top nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingBottom: 'var(--space-16)', overflow: 'hidden' }}>
          <SidebarItem icon="apps" label="Apps" />
          <SidebarItem icon="group" label="Projects" isSelected onClick={() => navigate('projects')} />
          <SidebarItem icon="more" label="More" />
        </div>

        {/* Projects section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingBottom: 'var(--space-16)', overflow: 'hidden' }}>
          <SectionLabel>Projects</SectionLabel>
          <SidebarItem icon="group-add" label="New project" onClick={() => navigate('projects')} />
          {STATIC_PROJECTS.map((name) => (
            <SidebarItem
              key={name}
              icon="group"
              label={name}
              onClick={() => navigate(`project-detail:${name}`)}
            />
          ))}
          <SidebarItem icon="more" label="More" />
        </div>

        {/* Recents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingBottom: 'var(--space-16)', overflow: 'hidden' }}>
          <SectionLabel>Recents</SectionLabel>
          {recent.map((c) => (
            <SidebarItem key={c.id} label={c.title} />
          ))}
        </div>
      </div>

      {/* Profile */}
      <div style={{ flexShrink: 0, borderTop: 'var(--border-width-default) solid var(--color-grey-5-alpha-15)', paddingInline: 'var(--space-16)', paddingBlock: 'var(--space-12)', height: 65, display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', width: '100%' }}>
          <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--color-grey-91)' }}>
            <img alt="" src={iconUrl('profile')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-16)', lineHeight: 'var(--line-height-20)', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Chanhee Shin</div>
            <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-12)', lineHeight: 'var(--line-height-14)', color: 'var(--color-text-muted)' }}>Free</div>
          </div>
          <button type="button" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 'var(--space-10)', paddingBlock: 'var(--space-6)', borderRadius: 'var(--radius-full)', border: 'var(--border-width-default) solid var(--color-grey-5-alpha-15)', background: 'var(--color-white)' }}>
            <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-12)', lineHeight: 'var(--line-height-14)', color: 'var(--color-black)', letterSpacing: 'var(--letter-spacing-wide)', whiteSpace: 'nowrap' }}>Upgrade</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const TABS = ['Chats', 'Sources', 'Code'] as const;
type TabType = (typeof TABS)[number];

export default function ProjectDetailPage({
  projectName,
  navigate,
}: {
  projectName: string;
  navigate: NavigateFn;
}) {
  const [activeTab, setActiveTab] = React.useState<TabType>('Chats');

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', background: 'var(--color-bg-default)', isolation: 'isolate' }}>
      <Sidebar navigate={navigate} activeProjectName={projectName} />

      {/* ── Main ──────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', overflowX: 'hidden', position: 'relative', zIndex: 1 }}>

        {/* Sticky header */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, flexShrink: 0, display: 'flex', alignItems: 'center', background: 'var(--color-bg-default)', borderBottom: 'var(--border-width-default) solid var(--color-grey-91)', paddingInline: 'var(--space-8)', paddingBlock: 'var(--space-16)', gap: 0 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
            <button type="button" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', paddingInline: 'var(--space-10)', paddingBlock: 3, minHeight: 36, borderRadius: 'var(--radius-8)', background: 'transparent' }}>
              <span style={{ fontFamily: 'var(--font-family-display)', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-18)', lineHeight: 'var(--line-height-28)', letterSpacing: 'var(--letter-spacing-tight)', color: 'var(--color-text-primary)', paddingBottom: 2.5, whiteSpace: 'nowrap' }}>ChatGPT</span>
              <img alt="" src={iconUrl('chevron-down')} style={{ width: 16, height: 16, flexShrink: 0 }} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexShrink: 0 }}>
            <IconBtn icon="invite" variant="subtle" />
            <IconBtn icon="profile" variant="subtle" />
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--color-white)' }}>
          <div style={{ flex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-24)', paddingTop: 64, paddingInline: 'var(--space-24)', paddingBottom: 'var(--space-24)' }}>

            {/* Project title */}
            <div style={{ width: 828, flexShrink: 0 }}>
              <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-28)', lineHeight: 'var(--line-height-34)', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
                {projectName}
              </span>
            </div>

            {/* Chat bar */}
            <div style={{ flexShrink: 0, width: '100%', maxWidth: 828, height: 'var(--chat-bar-height)', background: 'var(--chat-bar-bg)', borderRadius: 'var(--chat-bar-radius)', padding: 'var(--chat-bar-padding)', display: 'flex', alignItems: 'center', overflow: 'hidden', boxShadow: '0px 3px 6px 0px rgba(0,0,0,0.04), 0px 4px 80px 8px rgba(0,0,0,0.04), 0px 0px 1px 0px rgba(0,0,0,0.62)' }}>
              <IconBtn icon="add" size={36} iconSize={20} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingInline: 'var(--space-6)' }}>
                <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-16)', lineHeight: 'var(--line-height-20)', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'center' }}>
                  New chat in {projectName}
                </span>
              </div>
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <IconBtn icon="voice-record" size={36} iconSize={20} />
                <IconBtn icon="audio" size={36} iconSize={20} />
                <IconBtn icon="new-chat" variant="primary" size={36} iconSize={20} />
              </div>
            </div>

            {/* Section tabs */}
            <div style={{ width: '100%', maxWidth: 828, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center' }}>
                {TABS.map((tab) => (
                  <SectionTab
                    key={tab}
                    label={tab}
                    isSelected={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  />
                ))}
              </div>
            </div>

            {/* Empty state */}
            <div style={{ flex: 1, minHeight: 200, display: 'flex', flexDirection: 'column', gap: 'var(--space-10)', alignItems: 'center', justifyContent: 'center', maxWidth: 828, width: '100%' }}>
              <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-16)', lineHeight: 'var(--line-height-20)', color: 'var(--color-black)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                No chats yet
              </span>
              <img
                src={gifUrl('empty-project')}
                alt=""
                style={{ width: 296, height: 296, flexShrink: 0, display: 'block' }}
              />
              <div style={{ display: 'flex', gap: 'var(--space-10)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)', paddingInline: 'var(--space-16)', paddingBlock: 'var(--space-10)', borderRadius: 'var(--radius-full)', border: 'var(--stroke-weight-1_2) solid var(--color-grey-56-alpha-20)', background: 'transparent', cursor: 'pointer' }}
                >
                  <img alt="" src={iconUrl('search')} style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-16)', lineHeight: 'var(--line-height-20)', color: 'var(--color-grey-36)', whiteSpace: 'nowrap' }}>Search chat</span>
                </button>
                <button
                  type="button"
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)', paddingInline: 'var(--space-16)', paddingBlock: 'var(--space-10)', borderRadius: 'var(--radius-full)', border: 'var(--stroke-weight-1_2) solid var(--color-grey-56-alpha-20)', background: 'transparent', cursor: 'pointer' }}
                >
                  <img alt="" src={iconUrl('add')} style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-16)', lineHeight: 'var(--line-height-20)', color: 'var(--color-grey-36)', whiteSpace: 'nowrap' }}>Find relevant chats</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ flexShrink: 0, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 32, paddingInline: 'var(--space-8)', paddingBlock: 'var(--space-8)' }}>
            <div style={{ paddingInline: 'var(--space-8)' }}>
              <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-12)', lineHeight: 'var(--line-height-14)', color: 'var(--color-grey-36)', textAlign: 'center', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                ChatGPT can make mistakes. Check important info. See Cookie Preferences.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
