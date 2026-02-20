import { useState, useEffect, useCallback } from "react";
import { pipelineApi } from "../services/pipelineApi";
import type { PipelineCompany, PipelineLead, PipelineOpportunity } from "../types/pipeline.types";

export function usePipeline() {
  const [companies, setCompanies] = useState<PipelineCompany[]>([]);
  const [leads, setLeads] = useState<PipelineLead[]>([]);
  const [opportunities, setOpportunities] = useState<PipelineOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCompanies = useCallback(() => {
    pipelineApi.listCompanies()
      .then((r) => setCompanies(Array.isArray(r.data) ? r.data : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load companies"));
  }, []);

  const loadLeads = useCallback(() => {
    pipelineApi.getActiveLeads()
      .then((r) => setLeads(Array.isArray(r.data) ? r.data : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load leads"));
  }, []);

  const loadOpportunities = useCallback(() => {
    pipelineApi.listOpportunities()
      .then((r) => setOpportunities(Array.isArray(r.data) ? r.data : []))
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load opportunities"));
  }, []);

  const loadAll = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      pipelineApi.listCompanies(),
      pipelineApi.getActiveLeads(),
      pipelineApi.listOpportunities(),
    ])
      .then(([companiesRes, leadsRes, oppsRes]) => {
        setCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
        setLeads(Array.isArray(leadsRes.data) ? leadsRes.data : []);
        setOpportunities(Array.isArray(oppsRes.data) ? oppsRes.data : []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const createCompany = useCallback((name: string) => {
    return pipelineApi.createCompany(name).then((r) => {
      if (r.data) {
        setCompanies((prev) => [r.data as PipelineCompany, ...prev]);
        return r.data;
      }
      throw new Error(r.message ?? "Create failed");
    });
  }, []);

  const createLead = useCallback((companyId: string) => {
    return pipelineApi.createLead(companyId).then((r) => {
      if (r.data) {
        loadLeads();
        loadCompanies();
        return r.data;
      }
      throw new Error(r.message ?? "Create failed");
    });
  }, [loadLeads, loadCompanies]);

  const convertLead = useCallback((leadId: string) => {
    return pipelineApi.convertLead(leadId).then((r) => {
      if (r.data) {
        loadAll();
        return r.data;
      }
      throw new Error(r.message ?? "Convert failed");
    });
  }, [loadAll]);

  const markLeadLost = useCallback((leadId: string, reason: string) => {
    return pipelineApi.markLeadLost(leadId, reason).then((r) => {
      if (r.data) {
        loadAll();
        return r.data;
      }
      throw new Error(r.message ?? "Failed");
    });
  }, [loadAll]);

  return {
    companies,
    leads,
    opportunities,
    loading,
    error,
    loadAll,
    loadCompanies,
    loadLeads,
    loadOpportunities,
    createCompany,
    createLead,
    convertLead,
    markLeadLost,
  };
}
