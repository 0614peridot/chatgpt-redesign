import * as React from 'react';

export type SearchInputProps = {
  value: string;
  onValueChange: (next: string) => void;
  onDebouncedQueryChange: (query: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

const DEBOUNCE_MS = 300;

export function SearchInput({
  value,
  onValueChange,
  onDebouncedQueryChange,
  placeholder = 'Search chats',
  autoFocus = true,
}: SearchInputProps) {
  React.useEffect(() => {
    const t = window.setTimeout(() => onDebouncedQueryChange(value), DEBOUNCE_MS);
    return () => window.clearTimeout(t);
  }, [value, onDebouncedQueryChange]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        height: 'var(--input-height)',
        paddingInline: 'var(--input-padding-x)',
        borderRadius: 'var(--button-radius)',
        border: 'var(--border-width-default) solid var(--input-border)',
        background: 'var(--color-bg-default)',
      }}
    >
      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        style={{
          width: '100%',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--line-height-24)',
          color: 'var(--color-text-primary)',
        }}
      />
    </div>
  );
}

