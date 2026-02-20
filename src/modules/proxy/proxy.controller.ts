import type { Request, Response, NextFunction } from "express";

export async function proxyRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { url, method = "GET", headers = {}, body: reqBody } = req.body as {
      url?: string;
      method?: string;
      headers?: Record<string, string>;
      body?: unknown;
    };
    if (!url || typeof url !== "string") {
      res.status(400).json({ success: false, message: "Missing or invalid url" });
      return;
    }
    const allowedMethods = ["GET", "POST", "PATCH", "PUT", "DELETE"];
    const m = (method as string).toUpperCase();
    if (!allowedMethods.includes(m)) {
      res.status(400).json({ success: false, message: "Invalid method" });
      return;
    }
    const fetchHeaders: Record<string, string> = {
      "Accept": "application/json",
      "Content-Type": "application/json",
      ...headers,
    };
    let body: string | undefined;
    if (reqBody !== undefined && reqBody !== null && m !== "GET") {
      body = typeof reqBody === "string" ? reqBody : JSON.stringify(reqBody);
    }
    const response = await fetch(url, {
      method: m,
      headers: fetchHeaders,
      ...(body !== undefined && { body }),
    });
    const responseHeaders: Record<string, string> = {};
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
  } catch (e) {
    next(e);
  }
}
