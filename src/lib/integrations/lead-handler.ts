export type LeadPayload = {
  firstName: string;
  lastName: string;
  propertyAddress: string;
  phone: string;
  smsOptIn: boolean;
  email: string;
  projectCategory: string;
  budgetRange: string;
  projectDetails: string;
  files?: {
    name: string;
    size: number;
    type: string;
    content: string;
  }[];
  submittedAt: string;
};

export type LeadResult = {
  success: boolean;
  leadId: string;
  message: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendDispatchAlert(lead: LeadPayload): Promise<boolean> {
  const webhook = process.env.DISPATCH_WEBHOOK_URL;
  if (!webhook) return false;

  const response = await fetch(webhook, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "majesticpinerenovations.com",
      ...lead,
      files: lead.files?.map(({ name, size, type }) => ({ name, size, type })),
    }),
  });

  if (!response.ok) {
    throw new Error(`Lead webhook failed with status ${response.status}`);
  }
  return true;
}

function hubSpotProperties(lead: LeadPayload): Record<string, string> {
  const properties: Record<string, string> = {
    email: lead.email,
    firstname: lead.firstName,
    lastname: lead.lastName,
    phone: lead.phone,
    address: lead.propertyAddress,
    lifecyclestage: "lead",
    hs_lead_status: "NEW",
  };

  const optionalMappings = [
    [process.env.HUBSPOT_PROJECT_CATEGORY_PROPERTY, lead.projectCategory],
    [process.env.HUBSPOT_BUDGET_PROPERTY, lead.budgetRange],
    [process.env.HUBSPOT_PROJECT_DETAILS_PROPERTY, lead.projectDetails],
  ] as const;

  for (const [propertyName, value] of optionalMappings) {
    if (propertyName) properties[propertyName] = value;
  }

  return properties;
}

async function hubSpotRequest(
  path: string,
  token: string,
  init: RequestInit,
): Promise<Response> {
  return fetch(`https://api.hubapi.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
  });
}

async function sendToHubSpot(lead: LeadPayload): Promise<boolean> {
  const token = process.env.HUBSPOT_API_KEY ?? process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return false;

  const properties = hubSpotProperties(lead);
  const createResponse = await hubSpotRequest(
    "/crm/v3/objects/contacts",
    token,
    {
      method: "POST",
      body: JSON.stringify({ properties }),
    },
  );

  if (createResponse.ok) return true;

  if (createResponse.status === 409) {
    const searchResponse = await hubSpotRequest(
      "/crm/v3/objects/contacts/search",
      token,
      {
        method: "POST",
        body: JSON.stringify({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: "email",
                  operator: "EQ",
                  value: lead.email,
                },
              ],
            },
          ],
          properties: ["email"],
          limit: 1,
        }),
      },
    );

    if (!searchResponse.ok) {
      throw new Error(
        `HubSpot contact lookup failed with status ${searchResponse.status}`,
      );
    }

    const searchResult = (await searchResponse.json()) as {
      results?: { id: string }[];
    };
    const contactId = searchResult.results?.[0]?.id;

    if (contactId) {
      const updateResponse = await hubSpotRequest(
        `/crm/v3/objects/contacts/${contactId}`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify({ properties }),
        },
      );

      if (updateResponse.ok) return true;
      throw new Error(
        `HubSpot contact update failed with status ${updateResponse.status}`,
      );
    }
  }

  const details = await createResponse.text().catch(() => "");
  throw new Error(
    `HubSpot contact delivery failed with status ${createResponse.status}: ${details.slice(0, 200)}`,
  );
}

async function sendEmailNotification(lead: LeadPayload): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.LEAD_NOTIFICATION_EMAIL ??
    "majesticpinerenovations@gmail.com";
  const from =
    process.env.RESEND_FROM_EMAIL ??
    "Majestic Pine Website <onboarding@resend.dev>";

  if (!apiKey) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: lead.email,
      subject: `New ${lead.projectCategory} inquiry from ${lead.firstName} ${lead.lastName}`,
      html: `
        <h1>New website project inquiry</h1>
        <p><strong>Name:</strong> ${escapeHtml(`${lead.firstName} ${lead.lastName}`)}</p>
        <p><strong>Property:</strong> ${escapeHtml(lead.propertyAddress)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
        <p><strong>Category:</strong> ${escapeHtml(lead.projectCategory)}</p>
        <p><strong>Budget:</strong> ${escapeHtml(lead.budgetRange)}</p>
        <p><strong>Project details:</strong></p>
        <p>${escapeHtml(lead.projectDetails).replaceAll("\n", "<br />")}</p>
      `,
      attachments: lead.files?.map((file) => ({
        filename: file.name,
        content: file.content,
      })),
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(
      `Lead email failed with status ${response.status}: ${details.slice(0, 200)}`,
    );
  }
  return true;
}

async function saveToLocal(lead: LeadPayload): Promise<boolean> {
  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const dir = path.join(process.cwd(), "data", "leads");
    await fs.mkdir(dir, { recursive: true });
    const filename = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.json`;
    await fs.writeFile(path.join(dir, filename), JSON.stringify(lead, null, 2));
    return true;
  } catch {
    return false;
  }
}

export async function processLead(lead: LeadPayload): Promise<LeadResult> {
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const results = await Promise.allSettled([
    saveToLocal(lead),
    sendToHubSpot(lead),
    sendEmailNotification(lead),
    sendDispatchAlert(lead),
  ]);

  const anySucceeded = results.some(
    (r) => r.status === "fulfilled" && r.value === true,
  );

  if (!anySucceeded) {
    console.warn("[processLead] No delivery method succeeded. Logging lead data:");
    console.warn(JSON.stringify(lead, null, 2));
  }

  return {
    success: true,
    leadId,
    message: "Your project details have been received. Our team will contact you shortly.",
  };
}
