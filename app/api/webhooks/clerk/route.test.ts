import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { createServiceClient } from "@/lib/supabase";
import { captureEvent } from "@/lib/posthog-server";
import { notifyAdminNewRegistration, sendWelcomeEmail } from "@/lib/email";
import { sendMetaEvent } from "@/lib/meta-capi";
import { POST } from "./route";

const { verifyMock } = vi.hoisted(() => ({ verifyMock: vi.fn() }));

vi.mock("svix", () => ({
  Webhook: class WebhookMock {
    constructor(secret: string) {
      void secret;
    }
    verify(...args: unknown[]) {
      return verifyMock(...args);
    }
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/posthog-server", () => ({
  captureEvent: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  notifyAdminNewRegistration: vi.fn(),
  sendWelcomeEmail: vi.fn(),
}));

vi.mock("@/lib/meta-capi", () => ({
  sendMetaEvent: vi.fn(),
}));

function userCreatedPayload() {
  return {
    type: "user.created",
    data: {
      id: "user_clerk_new",
      email_addresses: [
        { id: "em_1", email_address: "new@example.com" },
        { id: "em_2", email_address: "other@example.com" },
      ],
      primary_email_address_id: "em_1",
      first_name: "New",
      last_name: "User",
      unsafe_metadata: {},
    },
  };
}

describe("POST /api/webhooks/clerk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifyMock.mockReset();
    vi.stubEnv("CLERK_WEBHOOK_SECRET", "whsec_test_clerk");
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://aiwithmichal.com");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 500 when CLERK_WEBHOOK_SECRET is not set", async () => {
    vi.stubEnv("CLERK_WEBHOOK_SECRET", "");

    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": "id",
        "svix-timestamp": "t",
        "svix-signature": "sig",
      },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it("returns 400 when svix headers missing", async () => {
    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain("Missing");
    expect(verifyMock).not.toHaveBeenCalled();
  });

  it("returns 400 when signature verification fails", async () => {
    verifyMock.mockImplementation(() => {
      throw new Error("bad sig");
    });

    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": "id",
        "svix-timestamp": "1",
        "svix-signature": "v1,x",
      },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for user.created without resolvable primary email", async () => {
    verifyMock.mockReturnValue({
      type: "user.created",
      data: {
        id: "u1",
        email_addresses: [{ id: "wrong", email_address: "a@b.com" }],
        primary_email_address_id: "missing",
        first_name: null,
        last_name: null,
      },
    });

    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": "id",
        "svix-timestamp": "1",
        "svix-signature": "v1,x",
      },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when registrations upsert fails", async () => {
    verifyMock.mockReturnValue(userCreatedPayload());

    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({
        upsert: vi.fn(async () => ({ error: { message: "db" } })),
      })),
    } as never);

    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": "id",
        "svix-timestamp": "1",
        "svix-signature": "v1,x",
      },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });

  it("returns received true after user.created happy path", async () => {
    verifyMock.mockReturnValue(userCreatedPayload());

    const upsert = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({ upsert })),
    } as never);

    const updateUser = vi.fn(async () => {});
    vi.mocked(clerkClient).mockResolvedValue({
      users: { updateUser },
    } as never);

    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": "id",
        "svix-timestamp": "1",
        "svix-signature": "v1,x",
      },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ received: true });

    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        clerk_user_id: "user_clerk_new",
        email: "new@example.com",
      }),
      { onConflict: "clerk_user_id" }
    );
    expect(captureEvent).toHaveBeenCalled();
    expect(sendMetaEvent).toHaveBeenCalled();
    expect(sendWelcomeEmail).not.toHaveBeenCalled();
    expect(notifyAdminNewRegistration).toHaveBeenCalled();
  });

  it("stores interested_in_product from unsafe_metadata and updates Clerk publicMetadata", async () => {
    const payload = userCreatedPayload();
    (payload.data as { unsafe_metadata?: Record<string, string> }).unsafe_metadata = {
      interested_in_product: "workshop:2026-04-23-sourcing-automation",
    };
    verifyMock.mockReturnValue(payload);

    const upsert = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({ upsert })),
    } as never);

    const updateUser = vi.fn(async () => {});
    vi.mocked(clerkClient).mockResolvedValue({
      users: { updateUser },
    } as never);

    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": "id",
        "svix-timestamp": "1",
        "svix-signature": "v1,x",
      },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        interested_in_product: "workshop:2026-04-23-sourcing-automation",
      }),
      { onConflict: "clerk_user_id" }
    );
    expect(updateUser).toHaveBeenCalledWith("user_clerk_new", {
      publicMetadata: { interested_in_product: "workshop:2026-04-23-sourcing-automation" },
    });
    expect(sendWelcomeEmail).toHaveBeenCalledWith({
      toEmail: "new@example.com",
      toName: "New User",
      workshop: expect.objectContaining({
        slug: "2026-04-23-sourcing-automation",
        title: "Sourcing Automation for Recruiters (90-min online workshop)",
        displayDate: "April 23, 2026",
        displayTime: "4:00 PM – 5:30 PM CET",
      }),
    });
  });

  it("does not send welcome email for mentoring signups", async () => {
    const payload = userCreatedPayload();
    (payload.data as { unsafe_metadata?: Record<string, string> }).unsafe_metadata = {
      interested_in_product: "mentoring:group-a",
    };
    verifyMock.mockReturnValue(payload);

    const upsert = vi.fn(async () => ({ error: null }));
    vi.mocked(createServiceClient).mockReturnValue({
      from: vi.fn(() => ({ upsert })),
    } as never);

    const updateUser = vi.fn(async () => {});
    vi.mocked(clerkClient).mockResolvedValue({
      users: { updateUser },
    } as never);

    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": "id",
        "svix-timestamp": "1",
        "svix-signature": "v1,x",
      },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(sendWelcomeEmail).not.toHaveBeenCalled();
  });

  it("returns received true for non-user.created events without touching registrations", async () => {
    verifyMock.mockReturnValue({ type: "session.created" });

    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
      headers: {
        "svix-id": "id",
        "svix-timestamp": "1",
        "svix-signature": "v1,x",
      },
      body: "{}",
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(createServiceClient).not.toHaveBeenCalled();
  });
});
