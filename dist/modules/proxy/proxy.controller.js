"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyRequest = proxyRequest;
async function proxyRequest(req, res, next) {
    try {
        const { url, method = "GET", headers = {}, body: reqBody } = req.body;
        if (!url || typeof url !== "string") {
            res.status(400).json({ success: false, message: "Missing or invalid url" });
            return;
        }
        const allowedMethods = ["GET", "POST", "PATCH", "PUT", "DELETE"];
        const m = method.toUpperCase();
        if (!allowedMethods.includes(m)) {
            res.status(400).json({ success: false, message: "Invalid method" });
            return;
        }
        const fetchHeaders = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...headers,
        };
        let body;
        if (reqBody !== undefined && reqBody !== null && m !== "GET") {
            body = typeof reqBody === "string" ? reqBody : JSON.stringify(reqBody);
        }
        const response = await fetch(url, {
            method: m,
            headers: fetchHeaders,
            ...(body !== undefined && { body }),
        });
        const responseHeaders = {};
        response.headers.forEach((v, k) => {
            responseHeaders[k] = v;
        });
        const data = await response.json().catch(() => null);
        res.status(200).json({
            success: true,
            data: {
                ok: response.ok,
                status: response.status,
                statusText: response.statusText,
                headers: responseHeaders,
                data,
            },
        });
    }
    catch (e) {
        next(e);
    }
}
//# sourceMappingURL=proxy.controller.js.map