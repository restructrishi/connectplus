interface EmailComposerProps {
  opportunityId: string;
  type?: string;
  onSent?: () => void;
}

export function EmailComposer({ opportunityId, type, onSent }: EmailComposerProps) {
  return (
    <div className="text-sm text-slate-600">
      Email (stub) for opportunity {opportunityId.slice(-6)} — type: {type ?? "default"}
      <button type="button" onClick={onSent} className="ml-2 text-xs px-2 py-1 border rounded">Send</button>
    </div>
  );
}
