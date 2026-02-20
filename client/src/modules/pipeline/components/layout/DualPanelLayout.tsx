import { useState } from "react";
import { LeftPanel } from "./LeftPanel";
import { RightPanel } from "./RightPanel";
import { CreateCompanyModal } from "../companies/CreateCompanyModal";
import { usePipeline } from "../../hooks/usePipeline";

export function DualPanelLayout() {
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);
  const {
    companies,
    leads,
    opportunities,
    loading,
    error,
    loadAll,
    createCompany,
    createLead,
    convertLead,
    markLeadLost,
  } = usePipeline();

  const handleCreateCompany = (name: string) => createCompany(name);
  const handleAddLead = (companyId: string) => createLead(companyId).then(() => {});
  const handleConvert = (leadId: string) => convertLead(leadId).then(() => {});
  const handleMarkLost = (leadId: string, reason: string) => markLeadLost(leadId, reason).then(() => {});

  if (loading) return <div className="p-6 text-slate-500">Loading…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col gap-4 p-4 max-w-[1400px]">
      <div className="flex items-center justify-between">
        <p className="text-slate-600 text-sm">
          Left: companies and active leads. Right: opportunities — select one to view details.
        </p>
        <button
          type="button"
          onClick={() => setCompanyModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
        >
          Create company
        </button>
      </div>
      <div className="flex-1 min-h-0 flex gap-4">
      <aside className="w-[360px] flex-shrink-0 min-h-0">
        <LeftPanel
          companies={companies}
          leads={leads}
          opportunities={opportunities}
          onAddLead={handleAddLead}
          onConvert={handleConvert}
          onMarkLost={handleMarkLost}
        />
      </aside>
      <main className="flex-1 min-w-0 min-h-0">
        <RightPanel
          opportunities={opportunities}
          selectedId={selectedOppId}
          onSelect={setSelectedOppId}
          onRefresh={loadAll}
        />
      </main>
      </div>
      <CreateCompanyModal isOpen={companyModalOpen} onClose={() => setCompanyModalOpen(false)} onCreate={handleCreateCompany} />
    </div>
  );
}
