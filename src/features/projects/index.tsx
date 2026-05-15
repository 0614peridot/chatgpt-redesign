import * as React from 'react';
import { getConversations } from '../../lib/data';

type NavigateFn = (view: string) => void;

function iconUrl(name: string): string {
  return new URL(`../../assets/icons/${name}.svg`, import.meta.url).toString();
}

// ── Sidebar shared components ─────────────────────────────────────────────────
function SidebarItem({
  icon,
  label,
  isActive = false,
  isSelected = false,
  onClick,
}: {
  icon?: string;
  label: string;
  isActive?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  const bg = isSelected
    ? 'var(--color-grey-91)'
    : isActive
      ? 'var(--color-grey-5-alpha-5)'
      : 'transparent';

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-6)',
        width: '100%',
        minHeight: 'var(--sidebar-item-height)',
        paddingTop: '7.5px',
        paddingBottom: '8.5px',
        paddingInline: 'var(--sidebar-item-padding)',
        borderRadius: 'var(--sidebar-item-radius)',
        background: bg,
        color: 'var(--color-text-primary)',
        textAlign: 'left',
        overflow: 'hidden',
      }}
    >
      {icon && (
        <span style={{ flexShrink: 0, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img alt="" src={iconUrl(icon)} style={{ width: 20, height: 20 }} />
        </span>
      )}
      <span
        style={{
          flex: 1,
          minWidth: 0,
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--font-size-14)',
          lineHeight: 'var(--line-height-20)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {label}
      </span>
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        paddingInline: 'var(--space-12)',
        paddingBlock: 'var(--space-4)',
        fontFamily: 'var(--font-family-body)',
        fontSize: 'var(--font-size-14)',
        lineHeight: 'var(--line-height-20)',
        color: 'var(--color-text-muted)',
        flexShrink: 0,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

function IconBtn({
  icon,
  variant = 'subtle',
  size = 36,
  iconSize = 20,
  onClick,
}: {
  icon: string;
  variant?: 'primary' | 'subtle' | 'square';
  size?: number;
  iconSize?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: variant === 'square' ? 'var(--radius-8)' : 'var(--radius-full)',
        background: variant === 'primary' ? 'var(--color-grey-5)' : 'transparent',
      }}
    >
      <img
        alt=""
        src={iconUrl(icon)}
        style={{
          width: iconSize,
          height: iconSize,
          filter: variant === 'primary' ? 'invert(1)' : undefined,
        }}
      />
    </button>
  );
}

// ── Create Project Modal ──────────────────────────────────────────────────────
function CreateProjectModal({
  initialName = '',
  onClose,
  onConfirm,
}: {
  initialName?: string;
  onClose: () => void;
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = React.useState(initialName);
  const hasName = name.trim().length > 0;

  // Auto-focus input on open
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    inputRef.current?.focus();
    if (initialName) {
      inputRef.current?.select();
    }
  }, [initialName]);

  // Close on Escape key
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    // Overlay
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--popup-overlay)',
      }}
    >
      {/* Modal card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'var(--popup-width)',
          background: 'var(--color-white)',
          border: 'var(--popup-border)',
          borderRadius: 'var(--popup-radius)',
          padding: 'var(--popup-padding)',
          boxShadow: 'var(--popup-shadow)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-16)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-20)',
              lineHeight: 'var(--line-height-24)',
              color: 'var(--color-black)',
              fontWeight: 'var(--font-weight-regular)',
              whiteSpace: 'nowrap',
            }}
          >
            Create Project
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)' }}>
            <IconBtn icon="setting" size={36} iconSize={20} />
            <IconBtn icon="X" size={36} iconSize={20} onClick={onClose} />
          </div>
        </div>

        {/* Form section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, width: '100%' }}>
          {/* Label */}
          <span
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-16)',
              lineHeight: 'var(--line-height-20)',
              color: 'var(--color-black)',
              fontWeight: 'var(--font-weight-regular)',
            }}
          >
            Project name
          </span>

          {/* Input (Placeholder component) */}
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && hasName) onConfirm(name.trim()); }}
            placeholder="UX Research Interview"
            style={{
              width: '100%',
              background: 'var(--color-white)',
              border: 'var(--popup-input-border)',
              borderRadius: 'var(--popup-input-radius)',
              paddingInline: 'var(--popup-input-padding-x)',
              paddingBlock: 'var(--popup-input-padding-y)',
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-14)',
              lineHeight: 'var(--line-height-20)',
              color: 'var(--color-grey-5)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />

          {/* Info box */}
          <div
            style={{
              background: 'var(--popup-info-bg)',
              borderRadius: 'var(--popup-info-radius)',
              paddingInline: 'var(--space-16)',
              paddingBlock: 'var(--space-12)',
              display: 'flex',
              gap: 'var(--space-10)',
              alignItems: 'flex-start',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ flexShrink: 0, width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
              <img alt="" src={iconUrl('bulb')} style={{ width: 20, height: 20 }} />
            </span>
            <span
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-12)',
                lineHeight: 'var(--line-height-14)',
                color: 'var(--color-grey-36)',
              }}
            >
              Projects keep chats, files, and custom instructions in one place.&nbsp; Use them for ongoing work, or just to keep things tidy.
            </span>
          </div>
        </div>

        {/* CTA button — right-aligned */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <button
            type="button"
            disabled={!hasName}
            onClick={() => { if (hasName) onConfirm(name.trim()); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingInline: 'var(--cta-padding-x)',
              paddingBlock: 'var(--cta-padding-y)',
              borderRadius: 'var(--cta-radius)',
              background: hasName ? 'var(--cta-bg-default)' : 'var(--cta-bg-disabled)',
              cursor: hasName ? 'pointer' : 'not-allowed',
              transition: 'background 0.15s',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-16)',
                lineHeight: 'var(--line-height-20)',
                color: 'var(--cta-text)',
                whiteSpace: 'nowrap',
                fontWeight: 'var(--font-weight-regular)',
              }}
            >
              Create project
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Project card (small 265px) ────────────────────────────────────────────────
type ProjectCardData = {
  title: string;
  meta: string;
  date: string;
};

function ProjectCardSmall({ title, meta, date }: ProjectCardData) {
  return (
    <div
      style={{
        flexShrink: 0,
        width: 265,
        background: 'var(--color-white)',
        border: 'var(--project-card-border)',
        borderRadius: 'var(--project-card-radius)',
        paddingInline: 'var(--project-card-padding-x)',
        paddingBlock: 'var(--project-card-padding-y)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span
              style={{
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-20)',
                lineHeight: 'var(--line-height-24)',
                color: 'var(--color-text-primary)',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </span>
            <div
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: 'var(--radius-8)',
                opacity: 0,
              }}
            >
              <img alt="" src={iconUrl('more')} style={{ width: 24, height: 24 }} />
            </div>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-14)',
              lineHeight: 'var(--line-height-20)',
              color: 'var(--color-grey-36)',
              letterSpacing: 'var(--letter-spacing-meta)',
              width: '100%',
            }}
          >
            {meta}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <span
            style={{
              fontFamily: 'var(--font-family-body)',
              fontSize: 'var(--font-size-12)',
              lineHeight: 'var(--line-height-14)',
              color: 'var(--color-text-muted)',
              whiteSpace: 'nowrap',
            }}
          >
            {date}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Suggestion pill button ────────────────────────────────────────────────────
function SuggestionPill({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flexShrink: 0,
        width: 265,
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-10)',
        paddingInline: 'var(--space-16)',
        paddingBlock: 'var(--space-10)',
        borderRadius: 'var(--radius-full)',
        border: 'var(--stroke-weight-1_2) solid var(--color-grey-56-alpha-20)',
        background: 'transparent',
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <span style={{ flexShrink: 0, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img alt="" src={iconUrl('group')} style={{ width: 16, height: 16 }} />
      </span>
      <span
        style={{
          fontFamily: 'var(--font-family-body)',
          fontSize: 'var(--font-size-16)',
          lineHeight: 'var(--line-height-20)',
          color: 'var(--color-grey-36)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Wide "New Project" card ───────────────────────────────────────────────────
function NewProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: 828,
        flexShrink: 0,
        background: 'var(--color-white)',
        border: 'var(--project-card-border)',
        borderRadius: 'var(--project-card-radius)',
        paddingInline: 'var(--project-card-padding-x)',
        paddingBlock: 'var(--project-card-padding-y)',
        display: 'flex',
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <span style={{ flexShrink: 0, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img alt="" src={iconUrl('group')} style={{ width: 20, height: 20 }} />
        </span>
        <span
          style={{
            fontFamily: 'var(--font-family-body)',
            fontSize: 'var(--font-size-20)',
            lineHeight: 'var(--line-height-24)',
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          New Project
        </span>
      </div>
    </button>
  );
}

// ── Sidebar (Projects page — Projects item selected) ──────────────────────────
function Sidebar({ navigate }: { navigate: NavigateFn }) {
  const recent = React.useMemo(
    () =>
      [...getConversations()]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 13),
    [],
  );

  return (
    <aside
      style={{
        flexShrink: 0,
        width: 'var(--sidebar-width)',
        background: 'var(--color-bg-sidebar)',
        borderRight: 'var(--border-width-default) solid var(--color-grey-5-alpha-5)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        zIndex: 2,
      }}
    >
      {/* Sticky top */}
      <div
        style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sidebar-section-gap)',
          paddingInline: 'var(--sidebar-item-padding)',
        }}
      >
        <div
          style={{
            height: 52,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingInline: 'var(--space-2)',
          }}
        >
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
            <IconBtn icon="sidebar" variant="square" />
            <IconBtn icon="edit" variant="square" />
          </div>
        </div>

        <div
          style={{
            borderBottom: 'var(--border-width-default) solid var(--color-grey-5-alpha-5)',
            paddingBottom: 'var(--space-2)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            overflow: 'hidden',
          }}
        >
          <SidebarItem icon="new-chat" label="New chat" onClick={() => navigate('new-chat')} />
          <SidebarItem icon="search" label="Search chats" />
        </div>
      </div>

      {/* Scrollable history */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingInline: 'var(--sidebar-item-padding)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingBottom: 'var(--space-16)', overflow: 'hidden' }}>
          <SidebarItem icon="apps" label="Apps" />
          <SidebarItem icon="group" label="Projects" isSelected />
          <SidebarItem icon="more" label="More" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingBottom: 'var(--space-16)', overflow: 'hidden' }}>
          <SectionLabel>Projects</SectionLabel>
          <SidebarItem icon="group" label="New project" />
          <SidebarItem icon="group" label="Master's Thesis" />
          <SidebarItem icon="group" label="Coding study" />
          <SidebarItem icon="group" label="Interview Prep" />
          <SidebarItem icon="more" label="More" />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', paddingBottom: 'var(--space-16)', overflow: 'hidden' }}>
          <SectionLabel>Recents</SectionLabel>
          {recent.map((c) => (
            <SidebarItem key={c.id} label={c.title} />
          ))}
        </div>
      </div>

      {/* Profile section */}
      <div
        style={{
          flexShrink: 0,
          borderTop: 'var(--border-width-default) solid var(--color-grey-5-alpha-15)',
          paddingInline: 'var(--space-16)',
          paddingBlock: 'var(--space-12)',
          height: 65,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', width: '100%' }}>
          <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--color-grey-91)' }}>
            <img alt="" src={iconUrl('profile')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-16)', lineHeight: 'var(--line-height-20)', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Chanhee Shin
            </div>
            <div style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-12)', lineHeight: 'var(--line-height-14)', color: 'var(--color-text-muted)' }}>
              Free
            </div>
          </div>
          <button
            type="button"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              paddingInline: 'var(--space-10)',
              paddingBlock: 'var(--space-6)',
              borderRadius: 'var(--radius-full)',
              border: 'var(--border-width-default) solid var(--color-grey-5-alpha-15)',
              background: 'var(--color-white)',
            }}
          >
            <span style={{ fontFamily: 'var(--font-family-body)', fontSize: 'var(--font-size-12)', lineHeight: 'var(--line-height-14)', color: 'var(--color-black)', letterSpacing: 'var(--letter-spacing-wide)', whiteSpace: 'nowrap' }}>
              Upgrade
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Static seed data ──────────────────────────────────────────────────────────
const SEED_PROJECTS: ProjectCardData[] = [
  { title: 'Paris Trip',         meta: '5 chats, 5 files',           date: '8 days ago'  },
  { title: 'Design Review',      meta: '3 chats, 2 files',           date: '2 days ago'  },
  { title: 'Client Feedback',    meta: '6 chats, 1 file',            date: '1 day ago'   },
  { title: 'Korean Food Recipe', meta: '3 mockups, 2 comments',      date: '2 days ago'  },
  { title: 'User Testing',       meta: '5 participants, 4 insights',  date: '3 days ago'  },
  { title: 'Feature Request',    meta: '8 suggestions, 1 follow-up', date: '1 week ago'  },
];

const SUGGESTIONS = ['UX Research Interview', 'English study', 'Fashion Platform Design'];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProjectsPage({ navigate }: { navigate: NavigateFn }) {
  const [projects, setProjects] = React.useState<ProjectCardData[]>(SEED_PROJECTS);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalInitialName, setModalInitialName] = React.useState('');

  const openModal = React.useCallback((initialName = '') => {
    setModalInitialName(initialName);
    setModalOpen(true);
  }, []);

  const closeModal = React.useCallback(() => {
    setModalOpen(false);
    setModalInitialName('');
  }, []);

  const handleCreateProject = React.useCallback((name: string) => {
    setProjects((prev) => [
      { title: name, meta: '0 chats, 0 files', date: 'just now' },
      ...prev,
    ]);
    setModalOpen(false);
    setModalInitialName('');
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        background: 'var(--color-bg-default)',
        isolation: 'isolate',
      }}
    >
      <Sidebar navigate={navigate} />

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Sticky header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-bg-default)',
            borderBottom: 'var(--border-width-default) solid var(--color-grey-91)',
            paddingInline: 'var(--space-8)',
            paddingBlock: 'var(--space-16)',
            gap: 0,
          }}
        >
          <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center' }}>
            <button
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-4)',
                paddingInline: 'var(--space-10)',
                paddingBlock: 3,
                minHeight: 36,
                borderRadius: 'var(--radius-8)',
                background: 'transparent',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-family-display)',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: 'var(--font-size-18)',
                  lineHeight: 'var(--line-height-28)',
                  letterSpacing: 'var(--letter-spacing-tight)',
                  color: 'var(--color-text-primary)',
                  paddingBottom: 2.5,
                  whiteSpace: 'nowrap',
                }}
              >
                ChatGPT
              </span>
              <img alt="" src={iconUrl('chevron-down')} style={{ width: 16, height: 16, flexShrink: 0 }} />
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexShrink: 0 }}>
            <IconBtn icon="invite" variant="subtle" />
            <IconBtn icon="profile" variant="subtle" />
          </div>
        </div>

        {/* Main body */}
        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'var(--color-white)',
          }}
        >
          <div
            style={{
              flex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-24)',
              paddingTop: 64,
              paddingInline: 'var(--space-24)',
              paddingBottom: 'var(--space-24)',
            }}
          >
            {/* Page title */}
            <div style={{ width: 828, flexShrink: 0 }}>
              <span
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-28)',
                  lineHeight: 'var(--line-height-34)',
                  color: 'var(--color-text-primary)',
                  whiteSpace: 'nowrap',
                }}
              >
                Projects
              </span>
            </div>

            {/* New Project wide card — opens modal */}
            <NewProjectCard onClick={() => openModal()} />

            {/* Project suggestions */}
            <div
              style={{
                width: '100%',
                maxWidth: 828,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-10)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-12)',
                  lineHeight: 'var(--line-height-14)',
                  color: 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                Project suggestions
              </span>
              <div style={{ display: 'flex', gap: 'var(--space-16)', flexWrap: 'nowrap' }}>
                {SUGGESTIONS.map((s) => (
                  <SuggestionPill key={s} label={s} onClick={() => openModal(s)} />
                ))}
              </div>
            </div>

            {/* Projects grid */}
            <div
              style={{
                width: '100%',
                maxWidth: 828,
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-10)',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-12)',
                  lineHeight: 'var(--line-height-14)',
                  color: 'var(--color-text-muted)',
                  whiteSpace: 'nowrap',
                }}
              >
                Projects
              </span>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-16)',
                  alignItems: 'flex-start',
                  maxWidth: 828,
                }}
              >
                {projects.map((p) => (
                  <ProjectCardSmall key={p.title + p.date} {...p} />
                ))}
              </div>
            </div>
          </div>

          {/* Footer disclaimer */}
          <div
            style={{
              flexShrink: 0,
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 32,
              paddingInline: 'var(--space-8)',
              paddingBlock: 'var(--space-8)',
            }}
          >
            <div style={{ paddingInline: 'var(--space-8)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-12)',
                  lineHeight: 'var(--line-height-14)',
                  color: 'var(--color-grey-36)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}
              >
                ChatGPT can make mistakes. Check important info. See Cookie Preferences.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal portal */}
      {modalOpen && (
        <CreateProjectModal
          initialName={modalInitialName}
          onClose={closeModal}
          onConfirm={handleCreateProject}
        />
      )}
    </div>
  );
}
