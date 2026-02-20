"use strict";
/**
 * HRMS integration - READ ONLY.
 * CRM stores only employee_id. Fetch employee details from HRMS service.
 * Never modify employee data from CRM.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeById = getEmployeeById;
exports.getEmployeesByIds = getEmployeesByIds;
const index_js_1 = require("../config/index.js");
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 min
async function getEmployeeById(employeeId) {
    const cached = cache.get(employeeId);
    if (cached && cached.expires > Date.now())
        return cached.data;
    try {
        const base = index_js_1.config.hrms.serviceUrl.replace(/\/$/, "");
        const res = await fetch(`${base}/api/employees/${employeeId}`, {
            headers: index_js_1.config.hrms.apiKey ? { "X-API-Key": index_js_1.config.hrms.apiKey } : {},
        });
        if (!res.ok)
            return null;
        const data = (await res.json());
        cache.set(employeeId, { data, expires: Date.now() + CACHE_TTL_MS });
        return data;
    }
    catch {
        return null;
    }
}
async function getEmployeesByIds(employeeIds) {
    const uniq = [...new Set(employeeIds)];
    const results = await Promise.all(uniq.map((id) => getEmployeeById(id)));
    const map = new Map();
    results.forEach((emp, i) => {
        if (emp)
            map.set(uniq[i], emp);
    });
    return map;
}
//# sourceMappingURL=hrms.js.map