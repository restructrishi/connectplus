import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Layout } from "./components/Layout";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Leads } from "./pages/Leads";
import { Clients } from "./pages/Clients";
import { Deals } from "./pages/Deals";
import { DealDetail } from "./pages/DealDetail";
import { Tasks } from "./pages/Tasks";
import { ApiFetcher } from "./pages/ApiFetcher";
import { OpportunityPipeline } from "./pages/OpportunityPipeline";
import { Employees } from "./pages/Employees";
import { PipelineModule } from "./modules/pipeline/index";
import { PurchaseOrderList } from "./modules/scm/pages/PurchaseOrderList";
import { PurchaseOrderDetail } from "./modules/scm/pages/PurchaseOrderDetail";
import { CreatePurchaseOrder } from "./modules/scm/pages/CreatePurchaseOrder";
import { DeploymentList } from "./modules/deployment/pages/DeploymentList";
import { DeploymentDetail } from "./modules/deployment/pages/DeploymentDetail";
import { PreSalesList } from "./modules/preSales/pages/PreSalesList";
import { PreSalesDetail } from "./modules/preSales/pages/PreSalesDetail";
import { DataAiProjectList } from "./modules/dataAi/pages/ProjectList";
import { DataAiProjectDetail } from "./modules/dataAi/pages/ProjectDetail";
import { CloudProjectList } from "./modules/cloud/pages/CloudProjectList";
import { CloudProjectDetail } from "./modules/cloud/pages/CloudProjectDetail";
import { LegalList } from "./modules/legal/pages/LegalList";
import { AgreementDetail } from "./modules/legal/pages/AgreementDetail";
import { PolicyDetail } from "./modules/legal/pages/PolicyDetail";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="leads" element={<Leads />} />
        <Route path="clients" element={<Clients />} />
        <Route path="deals" element={<Deals />} />
        <Route path="deals/:id" element={<DealDetail />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="employees" element={<Employees />} />
        <Route path="pipeline" element={<PipelineModule />} />
        <Route path="sales-pipeline" element={<Navigate to="/pipeline" replace />} />
        <Route path="pipeline-engine" element={<OpportunityPipeline />} />
        <Route path="api-fetcher" element={<ApiFetcher />} />
        <Route path="scm/purchase-orders" element={<PurchaseOrderList />} />
        <Route path="scm/purchase-orders/new" element={<CreatePurchaseOrder />} />
        <Route path="scm/purchase-orders/:id" element={<PurchaseOrderDetail />} />
        <Route path="deployment" element={<DeploymentList />} />
        <Route path="deployment/:id" element={<DeploymentDetail />} />
        <Route path="pre-sales" element={<PreSalesList />} />
        <Route path="pre-sales/:id" element={<PreSalesDetail />} />
        <Route path="data-ai" element={<DataAiProjectList />} />
        <Route path="data-ai/projects/:id" element={<DataAiProjectDetail />} />
        <Route path="cloud" element={<CloudProjectList />} />
        <Route path="cloud/projects/:id" element={<CloudProjectDetail />} />
        <Route path="legal" element={<LegalList />} />
        <Route path="legal/agreements/:id" element={<AgreementDetail />} />
        <Route path="legal/policies/:id" element={<PolicyDetail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
