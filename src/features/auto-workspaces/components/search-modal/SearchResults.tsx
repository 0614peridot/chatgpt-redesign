import * as React from 'react';
import type { Conversation } from '../../../../types';

export type SearchResultsProps = {
  query: string;
  results: Conversation[];
  isLoading?: boolean;
  onSelect: (conversationId: string) => void;
  emptyState?: React.ReactNode;
};

export function SearchResults({ query, results, isLoading = false, onSelect, emptyState }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body-sm)', lineHeight: 'var(--line-height-20)' }}>
        Searching…
      </div>
    );
  }

  if (!query.trim()) {
    return (
      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body-sm)', lineHeight: 'var(--line-height-20)' }}>
        검색어를 입력하세요.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-body-sm)', lineHeight: 'var(--line-height-20)' }}>
        {emptyState ?? '검색 결과가 없습니다.'}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
      {results.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onSelect(c.id)}
          style={{
            textAlign: 'left',
            padding: 'var(--search-modal-item-padding)',
            borderRadius: 'var(--search-modal-item-radius)',
            border: 'var(--border-width-default) solid var(--color-border-subtle)',
            background: 'var(--color-bg-default)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-xxs)',
          }}
        >
          <div style={{ fontSize: 'var(--text-body)', lineHeight: 'var(--line-height-24)', color: 'var(--color-text-primary)' }}>
            {c.title}
          </div>
          <div style={{ fontSize: 'var(--text-caption)', lineHeight: 'var(--line-height-16)', color: 'var(--color-text-muted)' }}>
            {c.summary}
          </div>
        </button>
      ))}
    </div>
  );
}

