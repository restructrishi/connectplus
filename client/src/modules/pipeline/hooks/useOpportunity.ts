import { useState, useEffect, useCallback } from "react";
import { pipelineApi } from "../services/pipelineApi";
import type { PipelineOpportunity } from "../types/pipeline.types";

export function useOpportunity(id: string | null) {
  const [opportunity, setOpportunity] = useState<PipelineOpportunity | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!id) {
      setOpportunity(null);
      return;
    }
    setLoading(true);
    setError(null);
    pipelineApi.getOpportunity(id)
      .then((r) => setOpportunity(r.data ?? null))
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setOpportunity(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = useCallback((status: string) => {
    if (!id) return Promise.reject(new Error("No id"));
    return pipelineApi.updateOpportunityStatus(id, status).then((r) => {
      if (r.data) setOpportunity(r.data);
      return r.data;
    });
  }, [id]);

  const updateAttachments = useCallback((attachments: object) => {
    if (!id) return Promise.reject(new Error("No id"));
    return pipelineApi.updateOpportunityAttachments(id, attachments).then((r) => {
      if (r.data) setOpportunity(r.data);
      return r.data;
    });
  }, [id]);

  const updateTechnical = useCallback((technicalDetails: object) => {
    if (!id) return Promise.reject(new Error("No id"));
    return pipelineApi.updateOpportunityTechnical(id, technicalDetails).then((r) => {
      if (r.data) setOpportunity(r.data);
      return r.data;
    });
  }, [id]);

  const updateOvf = useCallback((ovfDetails: object) => {
    if (!id) return Promise.reject(new Error("No id"));
    return pipelineApi.updateOpportunityOvf(id, ovfDetails).then((r) => {
      if (r.data) setOpportunity(r.data);
      return r.data;
    });
  }, [id]);

  const markLost = useCallback((reason: string) => {
    if (!id) return Promise.reject(new Error("No id"));
    return pipelineApi.markOpportunityLost(id, reason).then((r) => {
      if (r.data) setOpportunity(r.data);
      return r.data;
    });
  }, [id]);

  return {
    opportunity,
    loading,
    error,
    load,
    updateStatus,
    updateAttachments,
    updateTechnical,
    updateOvf,
    markLost,
  };
}
