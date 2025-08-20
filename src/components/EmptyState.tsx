import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {icon && (
        <div className="mb-4 text-4xl text-[var(--color-text-muted)]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--color-text-secondary)] mb-4 max-w-md">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-[var(--color-primary)] text-[var(--abc-pure-white)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}