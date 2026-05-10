import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import type { Conversation } from '../../../../types';
import { getGroups, searchConversations } from '../../../../lib/data';
import { useSearchModalStore } from '../../stores/searchModalStore';
import { GroupSuggestionCard, type GroupSuggestion } from './GroupSuggestionCard';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

export type SearchModalProps = {
  enableGroupSuggestion?: boolean;
  onClose?: () => void;
  onSelectConversation?: (conversationId: string) => void;
};

function normalizeQuery(input: string): string {
  return input.trim().toLowerCase();
}

function matchesGroup(query: string, group: { name: string; displayName: string; description: string; summary: string }): boolean {
  const q = normalizeQuery(query);
  if (!q) return false;
  const haystacks = [group.displayName, group.name, group.description, group.summary].map((s) => s.toLowerCase());
  return haystacks.some((h) => h.includes(q));
}

export function SearchModal({ enableGroupSuggestion = true, onClose, onSelectConversation }: SearchModalProps) {
  const { isSearchOpen, closeSearch, dismissedSuggestions, dismissSuggestion } = useSearchModalStore();

  const [value, setValue] = React.useState('');
  const [debouncedQuery, setDebouncedQuery] = React.useState('');

  const [results, setResults] = React.useState<Conversation[]>([]);
  const [suggestion, setSuggestion] = React.useState<GroupSuggestion | null>(null);

  React.useEffect(() => {
    if (!isSearchOpen) {
      setValue('');
      setDebouncedQuery('');
      setResults([]);
      setSuggestion(null);
    }
  }, [isSearchOpen]);

  React.useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q) {
      setResults([]);
      setSuggestion(null);
      return;
    }

    setResults(searchConversations(q));

    if (!enableGroupSuggestion) {
      setSuggestion(null);
      return;
    }

    const groups = getGroups();
    const match = groups.find((g) => matchesGroup(q, g) && g.confidence >= 0.8 && !dismissedSuggestions.includes(g.id));

    if (!match) {
      setSuggestion(null);
      return;
    }

    setSuggestion({
      groupId: match.id,
      displayName: match.displayName,
      description: match.description,
      confidence: match.confidence,
      similarCount: match.conversationCount,
    });
  }, [debouncedQuery, dismissedSuggestions, enableGroupSuggestion]);

  const requestClose = React.useCallback(() => {
    closeSearch();
    onClose?.();
  }, [closeSearch, onClose]);

  React.useEffect(() => {
    if (!isSearchOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, requestClose]);

  return (
    <AnimatePresence>
      {isSearchOpen ? (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--modal-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--modal-padding)',
            zIndex: 50,
          }}
          onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget) requestClose();
          }}
        >
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            style={{
              width: 'min(560px, 100%)',
              borderRadius: 'var(--modal-radius)',
              background: 'var(--color-bg-default)',
              border: 'var(--border-width-default) solid var(--color-border-subtle)',
              padding: 'var(--modal-padding)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--search-modal-gap)',
              boxShadow: 'var(--modal-shadow)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--search-modal-gap-sm)' }}>
              <div style={{ flex: 1 }}>
                <SearchInput
                  value={value}
                  onValueChange={setValue}
                  onDebouncedQueryChange={setDebouncedQuery}
                  placeholder="Search chats"
                />
              </div>
              <button
                type="button"
                onClick={requestClose}
                style={{
                  height: 'var(--button-height-default)',
                  paddingInline: 'var(--button-padding-x)',
                  borderRadius: 'var(--button-radius)',
                  border: 'var(--border-width-default) solid var(--color-border-default)',
                  background: 'var(--color-bg-default)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                Close
              </button>
            </div>

            <AnimatePresence>{suggestion ? (
              <GroupSuggestionCard
                suggestion={suggestion}
                onBundle={() => {
                  // mock action: keep modal open, no side effects beyond demo
                }}
                onLater={() => {
                  // mock action: hide for now (local only)
                  setSuggestion(null);
                }}
                onDismiss={(groupId) => {
                  dismissSuggestion(groupId);
                }}
              />
            ) : null}</AnimatePresence>

            <SearchResults
              query={debouncedQuery}
              results={results}
              onSelect={(conversationId) => {
                onSelectConversation?.(conversationId);
                requestClose();
              }}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

