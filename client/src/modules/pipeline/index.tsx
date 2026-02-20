import { DualPanelLayout } from "./components/layout/DualPanelLayout";

export function PipelineModule() {
  return (
    <div className="max-w-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline</h1>
        <p className="text-slate-600 text-sm mt-1">
          Manage companies, leads, and opportunities. Use Pipeline Engine for the full stage workflow (BOQ → quote → approval).
        </p>
      </div>
      <DualPanelLayout />
    </div>
  );
}
