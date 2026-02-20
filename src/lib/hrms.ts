/**
 * HRMS integration - READ ONLY.
 * CRM stores only employee_id. Fetch employee details from HRMS service.
 * Never modify employee data from CRM.
 */

import { config } from "../config/index.js";

export interface HrmsEmployee {
  id: string;
  name: string;
  email: string;
  department?: string;
  role?: string;
}

const cache = new Map<string, { data: HrmsEmployee; expires: number }>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min

export async function getEmployeeById(employeeId: string): Promise<HrmsEmployee | null> {
  const cached = cache.get(employeeId);
  if (cached && cached.expires > Date.now()) return cached.data;

  try {
    const base = config.hrms.serviceUrl.replace(/\/$/, "");
    const res = await fetch(`${base}/api/employees/${employeeId}`, {
      headers: config.hrms.apiKey ? { "X-API-Key": config.hrms.apiKey } : {},
    });
    if (!res.ok) return null;
    const data = (await res.json()) as HrmsEmployee;
    cache.set(employeeId, { data, expires: Date.now() + CACHE_TTL_MS });
    return data;
  } catch {
    return null;
  }
}

export async function getEmployeesByIds(employeeIds: string[]): Promise<Map<string, HrmsEmployee>> {
  const uniq = [...new Set(employeeIds)];
  const results = await Promise.all(uniq.map((id) => getEmployeeById(id)));
  const map = new Map<string, HrmsEmployee>();
  results.forEach((emp, i) => {
    if (emp) map.set(uniq[i]!, emp);
  });
  return map;
}
