import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const nav = [
    { to: "/", label: "Home" },
    { to: "/leads", label: "Leads" },
    { to: "/clients", label: "Clients" },
    { to: "/deals", label: "Deals" },
    { to: "/tasks", label: "Tasks" },
    { to: "/employees", label: "Employee" },
    { to: "/pipeline", label: "Sales Pipeline" },
    { to: "/pipeline-engine", label: "Pipeline Engine" },
    { to: "/api-fetcher", label: "API Fetcher" },
    { to: "/scm/purchase-orders", label: "Purchase Orders (SCM)" },
    { to: "/deployment", label: "Deployment" },
    { to: "/pre-sales", label: "Pre-Sales" },
    { to: "/data-ai", label: "Data / AI" },
    { to: "/cloud", label: "Cloud" },
    { to: "/legal", label: "Legal & Compliance" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
          <Link to="/" className="font-semibold text-lg">
            Cachedigitech CRM
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">{user?.email}</span>
            <span className="text-slate-400 text-xs uppercase">{user?.role?.replace("_", " ")}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-300 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-56 bg-white border-r border-slate-200 py-4">
          <nav className="px-3 space-y-0.5">
            {nav.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-sm font-medium ${
                    isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
