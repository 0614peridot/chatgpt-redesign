import * as React from 'react';
import { getConversations } from '../../lib/data';

function iconUrl(name: string): string {
  return new URL(`../../assets/icons/${name}.svg`, import.meta.url).toString();
}

// ── Sidebar item (icon + label) ──────────────────────────────────────────────
type SidebarItemProps = {
  icon?: string;
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
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-6)',
        width: '100%',
        minHeight: 'var(--sidebar-item-height)',
        paddingTop: '7.5px',
        paddingBottom: '8.5px',
        paddingInline: 'var(--sidebar-item-padding)',
        borderRadius: 'var(--sidebar-item-radius)',
        background: isActive ? 'var(--color-grey-5-alpha-5)' : 'transparent',
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
          fontSize: 'var(--font-size-14)',
          lineHeight: 'var(--line-height-20)',
          fontFamily: 'var(--font-family-body)',
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

// ── Sidebar section label ────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        paddingInline: 'var(--space-12)',
        paddingBlock: 'var(--space-4)',
        fontSize: 'var(--font-size-14)',
        lineHeight: 'var(--line-height-20)',
        fontFamily: 'var(--font-family-body)',
        color: 'var(--color-text-muted)',
        flexShrink: 0,
        width: '100%',
      }}
    >
      {children}
    </div>
  );
}

// ── Icon button (circle/square) ──────────────────────────────────────────────
type IconButtonVariant = 'primary' | 'subtle' | 'square';

type IconBtnProps = {
  icon: string;
  variant?: IconButtonVariant;
  size?: number;
  iconSize?: number;
  onClick?: () => void;
};

function IconBtn({ icon, variant = 'subtle', size = 36, iconSize = 20, onClick }: IconBtnProps) {
  const bg =
    variant === 'primary'
      ? 'var(--color-grey-5)'
      : 'transparent';
  const radius =
    variant === 'square'
      ? 'var(--radius-8)'
      : 'var(--radius-full)';

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
        borderRadius: radius,
        background: bg,
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

// ── Quick action button ──────────────────────────────────────────────────────
function QuickButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      type="button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-10)',
        paddingInline: 'var(--space-16)',
        paddingBlock: 'var(--space-10)',
        borderRadius: 'var(--radius-full)',
        border: 'var(--stroke-weight-1_2) solid var(--color-grey-56-alpha-20)',
        background: 'transparent',
        flexShrink: 0,
      }}
    >
      <span style={{ flexShrink: 0, width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img alt="" src={iconUrl(icon)} style={{ width: 16, height: 16 }} />
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

// ── Main page ────────────────────────────────────────────────────────────────
export default function NewChatPage({ navigate }: { navigate?: (view: string) => void }) {
  const recent = React.useMemo(
    () =>
      [...getConversations()]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 13),
    [],
  );

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
      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
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
          {/* Header row */}
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

          {/* Sticky menu — New chat, Search chats */}
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
            <SidebarItem icon="new-chat" label="New chat" isActive />
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
          {/* Top menu group: Apps, Projects, More */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              paddingBottom: 'var(--space-16)',
              overflow: 'hidden',
            }}
          >
            <SidebarItem icon="apps" label="Apps" />
            <SidebarItem icon="group" label="Projects" onClick={() => navigate?.('projects')} />
            <SidebarItem icon="more" label="More" />
          </div>

          {/* Projects section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              paddingBottom: 'var(--space-16)',
              overflow: 'hidden',
            }}
          >
            <SectionLabel>Projects</SectionLabel>
            <SidebarItem icon="group" label="New project" />
            <SidebarItem icon="group" label="Master's Thesis" />
            <SidebarItem icon="group" label="Coding study" />
            <SidebarItem icon="group" label="Interview Prep" />
            <SidebarItem icon="more" label="More" />
          </div>

          {/* Recents section */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              paddingBottom: 'var(--space-16)',
              overflow: 'hidden',
            }}
          >
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
            {/* Avatar */}
            <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 'var(--radius-full)', overflow: 'hidden', background: 'var(--color-grey-91)' }}>
              <img alt="" src={iconUrl('profile')} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* Name + plan */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-16)',
                  lineHeight: 'var(--line-height-20)',
                  color: 'var(--color-text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                Chanhee Shin
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-12)',
                  lineHeight: 'var(--line-height-14)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Free
              </div>
            </div>
            {/* Upgrade pill */}
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
              <span
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-12)',
                  lineHeight: 'var(--line-height-14)',
                  color: 'var(--color-black)',
                  letterSpacing: 'var(--letter-spacing-wide)',
                  whiteSpace: 'nowrap',
                }}
              >
                Upgrade
              </span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────────── */}
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
          {/* Model selector */}
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
          {/* Right actions */}
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
            alignItems: 'stretch',
          }}
        >
          {/* Centered greeting + input */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 326,
              paddingInline: 'var(--space-172)',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 40,
                alignItems: 'center',
                width: '100%',
              }}
            >
              {/* Greeting */}
              <div
                style={{
                  fontFamily: 'var(--font-family-body)',
                  fontSize: 'var(--font-size-28)',
                  lineHeight: 'var(--line-height-34)',
                  color: 'var(--color-text-primary)',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                What's on the agenda today?
              </div>

              {/* Chat bar + quick buttons */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-24)',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                {/* Chat bar */}
                <div style={{ width: '100%', flexShrink: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      height: 'var(--chat-bar-height)',
                      background: 'var(--chat-bar-bg)',
                      borderRadius: 'var(--chat-bar-radius)',
                      padding: 'var(--chat-bar-padding)',
                      boxShadow:
                        '0px 3px 6px 0px rgba(0,0,0,0.04), 0px 4px 80px 8px rgba(0,0,0,0.04), 0px 0px 1px 0px rgba(0,0,0,0.62)',
                      overflow: 'hidden',
                    }}
                  >
                    <IconBtn icon="add" variant="subtle" />
                    {/* Input area */}
                    <div style={{ flex: 1, minWidth: 0, height: 36, position: 'relative' }}>
                      <div
                        style={{
                          position: 'absolute',
                          top: -10,
                          left: 0,
                          right: 0.14,
                          minHeight: 56,
                          maxHeight: 'var(--height-270)',
                          overflowX: 'hidden',
                          overflowY: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingInline: 'var(--space-6)',
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            minWidth: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'var(--font-family-body)',
                              fontSize: 'var(--font-size-16)',
                              lineHeight: 'var(--line-height-20)',
                              color: 'var(--color-text-muted)',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Ask anything
                          </span>
                        </div>
                      </div>
                    </div>
                    <IconBtn icon="audio" variant="subtle" />
                    <IconBtn icon="voice-record" variant="primary" />
                  </div>
                </div>

                {/* Quick action buttons */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 'var(--space-12)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}
                >
                  <QuickButton icon="image2" label="Create an image" />
                  <QuickButton icon="edit" label="Write or edit" />
                  <QuickButton icon="telescope" label="Look something up" />
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer footer */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 32,
              paddingInline: 'var(--space-8)',
              paddingBlock: 'var(--space-8)',
            }}
          >
            <div
              style={{
                paddingInline: 'var(--space-8)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
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
    </div>
  );
}
