import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendMock = vi.fn();

vi.mock("resend", () => ({
  Resend: vi.fn().mockImplementation(function Resend() {
    return { emails: { send: sendMock } };
  }),
}));

const VALID_PAYLOAD = {
  name: "Jane Doe",
  email: "jane@example.com",
  company: "Acme Brands",
  website: "https://acme-brands.com",
  revenueRange: "$50k-$100k/mo",
  helpNeeded: ["PPC", "Listing Optimization & CRO"],
  markets: ["US", "UK"],
  message: "Looking for help scaling our PPC spend.",
};

function makeRequest(body: unknown, init: Partial<RequestInit> = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body);
  return new Request("http://localhost/api/growth-audit", {
    method: "POST",
    headers: { "content-type": "application/json", ...init.headers },
    body: payload,
    ...init,
  });
}

describe("POST /api/growth-audit", () => {
  beforeEach(() => {
    vi.resetModules();
    sendMock.mockReset();
    sendMock.mockResolvedValue({ data: { id: "email_123" }, error: null });
    process.env.RESEND_API_KEY = "test-key";
    process.env.GROWTH_AUDIT_TO_EMAIL = "sales@markidly.com";
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.GROWTH_AUDIT_TO_EMAIL;
    delete process.env.GROWTH_AUDIT_FROM_EMAIL;
  });

  it("accepts a valid request and sends the email", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest(VALID_PAYLOAD));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ ok: true });
    expect(sendMock).toHaveBeenCalledTimes(1);
    const sentArgs = sendMock.mock.calls[0][0];
    expect(sentArgs.to).toBe("sales@markidly.com");
    expect(sentArgs.replyTo).toBe("jane@example.com");
    expect(sentArgs.text).toContain("Jane Doe");
  });

  it("returns 500 when Resend/env vars are not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const { POST } = await import("./route");
    const res = await POST(makeRequest(VALID_PAYLOAD));
    expect(res.status).toBe(500);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 415 for a non-JSON content type", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      makeRequest("name=Jane", { headers: { "content-type": "text/plain" } })
    );
    expect(res.status).toBe(415);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON instead of throwing", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest("{not valid json"));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBeTruthy();
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when required fields are missing", async () => {
    const { POST } = await import("./route");
    const { name: _name, ...rest } = VALID_PAYLOAD;
    const res = await POST(makeRequest(rest));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid email address", async () => {
    const { POST } = await import("./route");
    const res = await POST(makeRequest({ ...VALID_PAYLOAD, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 413 for an oversized body", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      makeRequest({ ...VALID_PAYLOAD, message: "x".repeat(20_000) })
    );
    expect(res.status).toBe(413);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when a field exceeds its length limit", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      makeRequest({ ...VALID_PAYLOAD, company: "x".repeat(500) })
    );
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("returns 400 when helpNeeded/markets are not arrays of strings", async () => {
    const { POST } = await import("./route");
    const res = await POST(
      makeRequest({ ...VALID_PAYLOAD, helpNeeded: "PPC" })
    );
    expect(res.status).toBe(400);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("accepts a request with no optional message", async () => {
    const { POST } = await import("./route");
    const { message: _message, ...rest } = VALID_PAYLOAD;
    const res = await POST(makeRequest(rest));
    expect(res.status).toBe(200);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("returns 502 when Resend reports an error", async () => {
    sendMock.mockResolvedValueOnce({ data: null, error: { message: "upstream failure" } });
    const { POST } = await import("./route");
    const res = await POST(makeRequest(VALID_PAYLOAD));
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(json.error).toBeTruthy();
  });

  it("returns 500 when Resend throws unexpectedly", async () => {
    sendMock.mockRejectedValueOnce(new Error("network down"));
    const { POST } = await import("./route");
    const res = await POST(makeRequest(VALID_PAYLOAD));
    expect(res.status).toBe(500);
  });
});
