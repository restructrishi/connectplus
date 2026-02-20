import { useState } from "react";

interface ConvertButtonProps {
  leadId: string;
  onConvert: (leadId: string) => void;
}

export function ConvertButton({ leadId, onConvert }: ConvertButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    Promise.resolve(onConvert(leadId)).finally(() => setLoading(false));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="text-xs px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
    >
      {loading ? "…" : "Convert to Opportunity"}
    </button>
  );
}
