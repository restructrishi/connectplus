import { apiFetcher } from "./fetcher";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

/** Internal: all API requests go through the fetcher (endpoint + headers). */
async function request<T>(path: string, options: { method?: string; headers?: Record<string, string>; body?: unknown } = {}): Promise<ApiResponse<T>> {
  return apiFetcher<ApiResponse<T>>(path, {
    method: (options.method as "GET" | "POST" | "PATCH" | "PUT") || "GET",
    headers: options.headers,
    body: options.body,
  });
}

export const api = {
  get: <T>(path: string, headers?: Record<string, string>) =>
    request<T>(path, { method: "GET", headers }),
  post: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: "POST", body, headers }),
  patch: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: "PATCH", body, headers }),
  put: <T>(path: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(path, { method: "PUT", body, headers }),
};

// Auth
export async function login(email: string, password: string) {
  const r = await api.post<{ token: string; user: { id: string; email: string; role: string } }>(
    "/auth/login",
    { email, password }
  );
  if (r.data?.token) localStorage.setItem("crm_token", r.data.token);
  return r;
}

export async function getProfile() {
  return api.get<{ id: string; employeeId: string; email: string; role: string }>("/auth/profile");
}

// CRM
export async function getDashboard() {
  return api.get<{
    totalLeads: number;
    leadsByStatus: Record<string, number>;
    totalClients: number;
    dealsWonThisMonth: number;
    revenueThisMonth: number;
    totalRevenue: number;
    teamPerformance: { employeeId: string | null; leadCount: number }[];
  }>("/dashboard");
}

/** Zoho-style home dashboard: KPIs (this/last month), lead user-wise, stage-wise funnel */
export async function getHomeDashboard() {
  return api.get<{
    leadCountThisMonth: number;
    leadCountLastMonth: number;
    opportunityCountThisMonth: number;
    opportunityCountLastMonth: number;
    quoteCountThisMonth: number;
    quoteCountLastMonth: number;
    contactCountThisMonth: number;
    contactCountLastMonth: number;
    leadCountUserWise: { assignedTo: string | null; recordCount: number }[];
    leadCountStageWise: { stage: string; count: number }[];
  }>("/dashboard/home");
}

export async function getLeads(params?: { page?: number; pageSize?: number; status?: string; assignedTo?: string }) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  if (params?.status) q.set("status", params.status);
  if (params?.assignedTo) q.set("assignedTo", params.assignedTo);
  const query = q.toString();
  return api.get<{
    items: LeadListItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>(`/leads${query ? `?${query}` : ""}`);
}

export interface LeadListItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  status: string;
  assignedTo?: string | null;
  industry?: string | null;
  expectedClosureDate?: string | null;
  expectedBusinessAmount?: number | null;
  details?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  hasDeal: boolean;
}

export async function getLead(id: string) {
  return api.get<LeadDetail>(`/leads/${id}`);
}

export interface LeadDetail extends LeadListItem {
  activities?: unknown[];
}

export async function createLead(body: CreateLeadBody) {
  return api.post("/leads", body);
}

export interface CreateLeadBody {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source?: string;
  status?: string;
  assignedTo?: string;
  industry?: string;
  expectedClosureDate?: string;
  expectedBusinessAmount?: number;
  details?: Record<string, unknown>;
}

export async function updateLead(id: string, body: Partial<CreateLeadBody> & Record<string, unknown>) {
  return api.patch(`/leads/${id}`, body);
}

export async function convertLeadToClient(id: string) {
  return api.post(`/leads/${id}/convert-to-client`);
}

export async function getClients(params?: { page?: number; pageSize?: number }) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  const query = q.toString();
  return api.get<{ items: unknown[]; total: number; page: number; pageSize: number; totalPages: number }>(
    `/clients${query ? `?${query}` : ""}`
  );
}

export async function createClient(body: {
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  industry?: string;
  assignedTo?: string;
}) {
  return api.post("/clients", body);
}

export async function getDeals(params?: { page?: number; pageSize?: number; clientId?: string; stage?: string }) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  if (params?.clientId) q.set("clientId", params.clientId);
  if (params?.stage) q.set("stage", params.stage);
  const query = q.toString();
  return api.get<{ items: unknown[]; total: number; page: number; pageSize: number; totalPages: number }>(
    `/deals${query ? `?${query}` : ""}`
  );
}

export async function createDeal(body: {
  clientId: string;
  value: number;
  stage?: string;
  expectedClosureDate?: string;
}) {
  return api.post("/deals", body);
}

// CRM (org-scoped) – Contacts & Deals – linked to Pre-Sales, Deployment, SCM
export interface CrmContactListItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
}
export async function getCrmContacts() {
  return api.get<CrmContactListItem[]>("/crm-contacts");
}
export async function createCrmContact(body: {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phone?: string;
}) {
  return api.post<CrmContactListItem>("/crm-contacts", body);
}

export type CrmDealStage =
  | "LEAD_GENERATION"
  | "QUALIFICATION"
  | "PRE_SALES_HANDOVER"
  | "REQUIREMENT_ANALYSIS"
  | "SOLUTION_DESIGN"
  | "SYSTEM_DESIGN"
  | "TECHNOLOGY_STACK"
  | "BOQ_PREPARATION"
  | "POC"
  | "PROPOSAL_GENERATION"
  | "NEGOTIATION"
  | "AGREEMENT_PHASE"
  | "CLOSED_WON"
  | "CLOSED_LOST";
export interface CrmDealListItem {
  id: string;
  dealName: string;
  dealValue: number;
  stage: CrmDealStage;
  expectedCloseDate?: string | null;
  contactId: string;
  contact?: { id: string; firstName: string; lastName: string; companyName: string };
}
export async function getCrmDeals(params?: { stage?: string }) {
  const q = params?.stage ? `?stage=${encodeURIComponent(params.stage)}` : "";
  return api.get<CrmDealListItem[]>(`/crm-deals${q}`);
}
export async function getCrmDeal(id: string) {
  return api.get<CrmDealDetail>(`/crm-deals/${id}`);
}
export async function createCrmDeal(body: {
  dealName: string;
  dealValue: number;
  contactId: string;
  stage?: string;
  expectedCloseDate?: string;
}) {
  return api.post<CrmDealListItem>("/crm-deals", body);
}

export interface CrmDealDetail extends CrmDealListItem {
  contact: CrmContactListItem & { phone?: string; companyName: string };
  preSales?: { id: string; handoverDate: string } | null;
  deployments?: { id: string; status: string; createdAt: string }[];
  purchaseOrders?: { id: string; poNumber: string; status: string }[];
}

export async function createPreSales(body: { dealId: string; handoverDate: string; handoverNotes?: string }) {
  return api.post<PreSalesListItem>("/pre-sales", body);
}

export async function getTasks(params?: { page?: number; pageSize?: number; status?: string }) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  if (params?.status) q.set("status", params.status);
  const query = q.toString();
  return api.get<{ items: unknown[]; total: number; page: number; pageSize: number; totalPages: number }>(
    `/tasks${query ? `?${query}` : ""}`
  );
}

export async function createTask(body: {
  title: string;
  assignedTo: string;
  description?: string;
  dueDate?: string;
  status?: string;
}) {
  return api.post("/tasks", body);
}

export async function updateTask(id: string, body: Record<string, unknown>) {
  return api.patch(`/tasks/${id}`, body);
}

// Re-export functional fetcher (endpoint + headers)
// Sales Lifecycle
export async function getLifecycleDashboard() {
  return api.get<{
    totalCompanies: number;
    openLeads: number;
    totalOpportunities: number;
    dealsByStage: Record<string, number>;
    approvalPendingCount: number;
    lostDealsCount: number;
    revenueForecast: number;
    conversionRatio: number;
  }>("/lifecycle/dashboard");
}

export async function listLifecycleCompanies(params?: { page?: number; pageSize?: number; status?: string }) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  if (params?.status) q.set("status", params.status);
  const query = q.toString();
  return api.get<{ items: unknown[]; total: number; page: number; pageSize: number; totalPages: number }>(
    `/lifecycle/companies${query ? `?${query}` : ""}`
  );
}

export async function createLifecycleCompany(name: string) {
  return api.post("/lifecycle/companies", { name });
}

export async function listLifecycleLeads(params?: { page?: number; pageSize?: number; companyId?: string; status?: string }) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  if (params?.companyId) q.set("companyId", params.companyId);
  if (params?.status) q.set("status", params.status);
  const query = q.toString();
  return api.get<{ items: unknown[]; total: number; page: number; pageSize: number; totalPages: number }>(
    `/lifecycle/leads${query ? `?${query}` : ""}`
  );
}

export async function createLifecycleLead(body: { name: string; companyId: string; contactInfo?: string; assignedTo?: string }) {
  return api.post("/lifecycle/leads", body);
}

export async function listLifecycleOpportunities(params?: { page?: number; pageSize?: number; companyId?: string; stage?: string }) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.pageSize) q.set("pageSize", String(params.pageSize));
  if (params?.companyId) q.set("companyId", params.companyId);
  if (params?.stage) q.set("stage", params.stage);
  const query = q.toString();
  return api.get<{ items: unknown[]; total: number; page: number; pageSize: number; totalPages: number }>(
    `/lifecycle/opportunities${query ? `?${query}` : ""}`
  );
}

export async function createLifecycleOpportunity(body: {
  name: string;
  companyId: string;
  leadId?: string;
  estimatedValue?: number;
  assignedSalesPerson: string;
  probability?: number;
  expectedClosureDate?: string;
}) {
  return api.post("/lifecycle/opportunities", body);
}

export async function getLifecycleOpportunity(id: string) {
  return api.get(`/lifecycle/opportunities/${id}`);
}

export async function getLifecyclePipeline(opportunityId: string) {
  return api.get<{
    opportunityId: string;
    opportunityName: string;
    companyName: string;
    currentStage: string;
    isLocked: boolean;
    estimatedValue: number;
    marginPercent: number | null;
    marginIndicator: "green" | "yellow" | "red" | "none";
    riskScore: number;
    stages: {
      stageName: string;
      orderIndex: number;
      status: "PENDING" | "ACTIVE" | "APPROVED" | "REJECTED" | "LOCKED";
      isLocked: boolean;
      canExecute: boolean;
      approvedBy?: string;
      approvedAt?: string;
      durationSeconds?: number;
      slaHoursPending?: number;
    }[];
    approvalSlaHours?: number;
    timeline: { action: string; userId: string; createdAt: string; comment?: string; stageTo?: string }[];
  }>(`/lifecycle/opportunities/${opportunityId}/pipeline`);
}

export async function lifecycleTransitionStage(opportunityId: string, body: { stage: string; reason?: string; lostReason?: string }) {
  return api.post(`/lifecycle/opportunities/${opportunityId}/transition`, body);
}

export async function listLifecyclePendingApprovals() {
  return api.get<{ id: string; opportunityId: string; ovfId: string; requestedAt: string; opportunity?: { name: string } }[]>(
    "/lifecycle/approvals/pending"
  );
}

export async function lifecycleApprovalDecide(approvalId: string, body: { status: "APPROVED" | "REJECTED"; comments?: string }) {
  return api.post(`/lifecycle/approvals/${approvalId}/decide`, body);
}

// Synced employees (from API Fetcher)
export async function syncEmployeesToDb(employees: Record<string, unknown>[]) {
  return api.post<{ count: number }>("/employees/sync", { data: employees });
}

export async function listSyncedEmployees() {
  return api.get<{ id: string; employeeCode?: string; firstName?: string; lastName?: string; email?: string; designation?: string; employmentType?: string; dateOfJoining?: string; departmentName?: string; syncedAt: string }[]>(
    "/employees/synced"
  );
}

// SCM (Zoho-style) – Purchase Orders
export type POStatus =
  | "CLIENT_PO_RECEIVED"
  | "PO_SENT_TO_DISTRIBUTOR"
  | "DISTRIBUTOR_DELIVERED"
  | "WAREHOUSE_TO_CUSTOMER"
  | "DOCUMENTS_COMPLETED"
  | "INVOICE_SENT_TO_ACCOUNTS"
  | "INVOICE_SENT_TO_CUSTOMER"
  | "COMPLETED";

export interface PurchaseOrderListItem {
  id: string;
  poNumber: string;
  status: POStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  dealId: string | null;
  createdAt: string;
  deal?: { id: string; dealName?: string; contactId?: string | null } | null;
  createdBy?: { id: string; email: string; firstName: string | null; lastName: string | null };
  items?: { id: string; quantity: number; unitPrice: number; totalPrice: number; product?: { name: string; sku: string } }[];
  // Workflow fields (detail)
  clientPOReceivedAt?: string | null;
  poSentToDistributorAt?: string | null;
  distributorDeliveredAt?: string | null;
  warehouseToCustomerAt?: string | null;
  timeCalculation?: Record<string, unknown>;
  mipMrnDocuments?: { name?: string; url?: string }[];
  scmInvoiceSent?: boolean;
  scmInvoiceSentAt?: string | null;
  accountsInvoiceSent?: boolean;
  accountsInvoiceSentAt?: string | null;
  scmInvoiceFile?: string | null;
  customerInvoiceFile?: string | null;
}

export async function getScmPurchaseOrders(params?: { status?: POStatus; dealId?: string }) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.dealId) q.set("dealId", params.dealId);
  const query = q.toString();
  return api.get<PurchaseOrderListItem[]>(`/scm/purchase-orders${query ? `?${query}` : ""}`);
}

export async function getScmPurchaseOrder(id: string) {
  return api.get<PurchaseOrderListItem>(`/scm/purchase-orders/${id}`);
}

export async function createScmPurchaseOrder(body: {
  dealId?: string;
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  currency?: string;
  items?: { productId: string; quantity: number; unitPrice: number }[];
}) {
  return api.post<PurchaseOrderListItem>("/scm/purchase-orders", body);
}

export async function updateScmPurchaseOrderStatus(id: string, status: POStatus, extra?: Record<string, unknown>) {
  return api.put<PurchaseOrderListItem>(`/scm/purchase-orders/${id}/status`, { status, ...extra });
}

export async function updateScmPurchaseOrder(id: string, body: Record<string, unknown>) {
  return api.patch<PurchaseOrderListItem>(`/scm/purchase-orders/${id}`, body);
}

export async function handoffScmPoToDeployment(poId: string) {
  return api.post<DeploymentListItem>(`/scm/purchase-orders/${poId}/handoff-to-deployment`);
}

// Deployment
export async function getDeployments(params?: { status?: string; dealId?: string }) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  if (params?.dealId) q.set("dealId", params.dealId);
  const query = q.toString();
  return api.get<DeploymentListItem[]>(`/deployment${query ? `?${query}` : ""}`);
}
export async function getDeployment(id: string) {
  return api.get<DeploymentListItem>(`/deployment/${id}`);
}
export async function createDeployment(body: { dealId: string; contactId: string }) {
  return api.post<DeploymentListItem>("/deployment", body);
}
export async function updateDeployment(id: string, body: Record<string, unknown>) {
  return api.patch<DeploymentListItem>(`/deployment/${id}`, body);
}
export interface DeploymentListItem {
  id: string;
  dealId: string;
  contactId: string;
  status: string;
  createdAt: string;
  kickOffMeeting?: Record<string, unknown>;
  siteSurvey?: Record<string, unknown>;
  deal?: { id: string; dealName: string; stage: string };
  contact?: { id: string; firstName: string; lastName: string; companyName: string };
}

// Pre-Sales
export async function getPreSalesList(params?: { dealId?: string }) {
  const q = new URLSearchParams();
  if (params?.dealId) q.set("dealId", params.dealId);
  const query = q.toString();
  return api.get<PreSalesListItem[]>(`/pre-sales${query ? `?${query}` : ""}`);
}
export async function getPreSales(id: string) {
  return api.get<PreSalesListItem>(`/pre-sales/${id}`);
}
export async function updatePreSales(id: string, body: Record<string, unknown>) {
  return api.patch<PreSalesListItem>(`/pre-sales/${id}`, body);
}
export interface PreSalesListItem {
  id: string;
  dealId: string;
  handoverDate: string;
  handoverNotes?: string | null;
  proposalGenerated: boolean;
  requirementAnalysis?: Record<string, unknown>;
  solutionDesign?: Record<string, unknown>;
  boq?: Record<string, unknown>;
  createdAt: string;
  deal?: { id: string; dealName: string; stage: string; dealValue: number };
  createdBy?: { id: string; email: string; firstName: string | null; lastName: string | null };
}

// Data/AI – Projects
export async function getDataAiProjects(params?: { status?: string }) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  const query = q.toString();
  return api.get<DataAiProjectListItem[]>(`/data-ai/projects${query ? `?${query}` : ""}`);
}
export async function getDataAiProject(id: string) {
  return api.get<DataAiProjectListItem>(`/data-ai/projects/${id}`);
}
export interface DataAiProjectListItem {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  tlId: string;
  createdAt: string;
  tl?: { id: string; email: string; firstName: string | null; lastName: string | null };
  _count?: { tasks: number };
}

// Cloud – Projects
export async function getCloudProjects(params?: { status?: string }) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  const query = q.toString();
  return api.get<CloudProjectListItem[]>(`/cloud/projects${query ? `?${query}` : ""}`);
}
export async function getCloudProject(id: string) {
  return api.get<CloudProjectListItem>(`/cloud/projects/${id}`);
}
export interface CloudProjectListItem {
  id: string;
  name: string;
  description?: string | null;
  status: string;
  tlId: string;
  createdAt: string;
  tl?: { id: string; email: string; firstName: string | null; lastName: string | null };
}

// Legal – Agreements & Policies
export async function getLegalAgreements(params?: { dealId?: string }) {
  const q = new URLSearchParams();
  if (params?.dealId) q.set("dealId", params.dealId);
  const query = q.toString();
  return api.get<AgreementListItem[]>(`/legal/agreements${query ? `?${query}` : ""}`);
}
export async function getLegalAgreement(id: string) {
  return api.get<AgreementListItem>(`/legal/agreements/${id}`);
}
export interface AgreementListItem {
  id: string;
  agreementNumber: string;
  agreementType: string;
  dealId?: string | null;
  sentToClient: boolean;
  signed: boolean;
  createdAt: string;
  deal?: { id: string; dealName: string } | null;
  contact?: { id: string; firstName: string; lastName: string; companyName: string } | null;
}
export async function getLegalPolicies(params?: { status?: string }) {
  const q = new URLSearchParams();
  if (params?.status) q.set("status", params.status);
  const query = q.toString();
  return api.get<PolicyListItem[]>(`/legal/policies${query ? `?${query}` : ""}`);
}
export async function getLegalPolicy(id: string) {
  return api.get<PolicyListItem>(`/legal/policies/${id}`);
}
export interface PolicyListItem {
  id: string;
  policyNumber: string;
  title: string;
  status: string;
  createdAt: string;
  createdBy?: { id: string; email: string; firstName: string | null; lastName: string | null };
}

export {
  apiFetcher,
  fetcherGet,
  fetcherPost,
  type FetcherConfig,
  type FetcherOptions,
} from "./fetcher";
