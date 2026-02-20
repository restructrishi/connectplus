import { Construction } from "lucide-react";

interface ComingSoonProps {
  moduleName: string;
}

export function ComingSoon({ moduleName }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
      <Construction className="w-16 h-16 text-slate-400 mb-4" />
      <h2 className="text-xl font-semibold text-slate-800 mb-2">{moduleName}</h2>
      <p className="text-slate-500">This module is coming soon.</p>
    </div>
  );
}
