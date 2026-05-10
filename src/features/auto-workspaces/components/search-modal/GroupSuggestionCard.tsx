import * as React from 'react';
import { motion } from 'framer-motion';

export type GroupSuggestion = {
  groupId: string;
  displayName: string;
  description: string;
  confidence: number; // 0~1
  similarCount: number;
};

export type GroupSuggestionCardProps = {
  suggestion: GroupSuggestion;
  onBundle: (groupId: string) => void;
  onLater: (groupId: string) => void;
  onDismiss: (groupId: string) => void;
};

export function GroupSuggestionCard({ suggestion, onBundle, onLater, onDismiss }: GroupSuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      style={{
        borderRadius: 'var(--card-radius)',
        border: 'var(--border-width-default) solid var(--card-border)',
        background: 'var(--color-bg-default)',
        padding: 'var(--card-padding)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--search-modal-gap-sm)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xxs)' }}>
        <div
          style={{
            fontSize: 'var(--text-body)',
            fontWeight: 'var(--text-weight-emphasis)',
            lineHeight: 'var(--line-height-24)',
            color: 'var(--color-text-primary)',
          }}
        >
          비슷한 주제 {suggestion.similarCount}개 발견
        </div>
        <div style={{ fontSize: 'var(--text-body-sm)', lineHeight: 'var(--line-height-20)', color: 'var(--color-text-secondary)' }}>
          {suggestion.displayName}
        </div>
        <div style={{ fontSize: 'var(--text-caption)', lineHeight: 'var(--line-height-16)', color: 'var(--color-text-muted)' }}>
          {suggestion.description}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--search-modal-gap-sm)' }}>
        <button
          type="button"
          onClick={() => onBundle(suggestion.groupId)}
          style={{
            height: 'var(--button-height-default)',
            paddingInline: 'var(--button-padding-x)',
            borderRadius: 'var(--button-radius)',
            border: 'var(--border-width-default) solid var(--color-border-default)',
            background: 'var(--color-bg-default)',
            color: 'var(--color-text-primary)',
          }}
        >
          묶기
        </button>
        <button
          type="button"
          onClick={() => onLater(suggestion.groupId)}
          style={{
            height: 'var(--button-height-default)',
            paddingInline: 'var(--button-padding-x)',
            borderRadius: 'var(--button-radius)',
            border: 'var(--border-width-default) solid var(--color-border-default)',
            background: 'var(--color-bg-default)',
            color: 'var(--color-text-secondary)',
          }}
        >
          나중에
        </button>
        <button
          type="button"
          onClick={() => onDismiss(suggestion.groupId)}
          style={{
            height: 'var(--button-height-default)',
            paddingInline: 'var(--button-padding-x)',
            borderRadius: 'var(--button-radius)',
            border: 'var(--border-width-default) solid var(--color-border-default)',
            background: 'var(--color-bg-default)',
            color: 'var(--color-text-muted)',
            marginLeft: 'auto',
          }}
        >
          거절
        </button>
      </div>
    </motion.div>
  );
}

