import type { LeadPayload } from "./lead-handler";

const HUBSPOT_API_BASE = "https://api.hubapi.com";
const HUBSPOT_FORMS_BASE = "https://api.hsforms.com";

type HubSpotResult = {
  contactId: string | null;
};

function getAccessToken(): string | undefined {
  return process.env.HUBSPOT_ACCESS_TOKEN ?? process.env.HUBSPOT_API_KEY;
}

function buildLeadMessage(lead: LeadPayload): string {
  const lines = [
    `Project category: ${lead.projectCategory}`,
    `Budget range: ${lead.budgetRange}`,
    `SMS opt-in: ${lead.smsOptIn ? "Yes" : "No"}`,
    `Submitted: ${lead.submittedAt}`,
  ];

  if (lead.files?.length) {
    lines.push(
      `Files (${lead.files.length}): ${lead.files.map((file) => file.name).join(", ")}`,
    );
  }

  return lines.join("\n");
}

async function submitHubSpotForm(lead: LeadPayload): Promise<HubSpotResult> {
  const portalId = process.env.HUBSPOT_PORTAL_ID;
  const formId = process.env.HUBSPOT_FORM_ID;

  if (!portalId || !formId) {
    return { contactId: null };
  }

  const fields = [
    { name: "firstname", value: lead.firstName },
    { name: "lastname", value: lead.lastName },
    { name: "email", value: lead.email },
    { name: "phone", value: lead.phone },
    { name: "address", value: lead.propertyAddress },
    { name: "message", value: buildLeadMessage(lead) },
  ];

  const response = await fetch(
    `${HUBSPOT_FORMS_BASE}/submissions/v3/integration/submit/${portalId}/${formId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields,
        context: {
          pageUri: process.env.NEXT_PUBLIC_SITE_URL ?? undefined,
          pageName: "Majestic Pine Renovations — Project Details Form",
        },
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HubSpot form submission failed (${response.status}): ${body}`);
  }

  return { contactId: `hs_form_${Date.now()}` };
}

async function findContactIdByEmail(
  accessToken: string,
  email: string,
): Promise<string | null> {
  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts/search`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filterGroups: [
        {
          filters: [
            {
              propertyName: "email",
              operator: "EQ",
              value: email,
            },
          ],
        },
      ],
      properties: ["email"],
      limit: 1,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HubSpot contact search failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { results?: { id: string }[] };
  return data.results?.[0]?.id ?? null;
}

async function upsertHubSpotContact(
  accessToken: string,
  lead: LeadPayload,
): Promise<string> {
  const properties = {
    email: lead.email,
    firstname: lead.firstName,
    lastname: lead.lastName,
    phone: lead.phone,
    address: lead.propertyAddress,
    hs_lead_status: "NEW",
    lifecyclestage: "lead",
  };

  const existingId = await findContactIdByEmail(accessToken, lead.email);

  if (existingId) {
    const response = await fetch(
      `${HUBSPOT_API_BASE}/crm/v3/objects/contacts/${existingId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ properties }),
      },
    );

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HubSpot contact update failed (${response.status}): ${body}`);
    }

    return existingId;
  }

  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/contacts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ properties }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HubSpot contact create failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { id: string };
  return data.id;
}

async function createHubSpotNote(
  accessToken: string,
  contactId: string,
  lead: LeadPayload,
): Promise<void> {
  const response = await fetch(`${HUBSPOT_API_BASE}/crm/v3/objects/notes`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        hs_timestamp: lead.submittedAt,
        hs_note_body: buildLeadMessage(lead),
      },
      associations: [
        {
          to: { id: contactId },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 202,
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HubSpot note create failed (${response.status}): ${body}`);
  }
}

export async function syncLeadToHubSpot(lead: LeadPayload): Promise<HubSpotResult> {
  const accessToken = getAccessToken();
  const hasFormConfig =
    Boolean(process.env.HUBSPOT_PORTAL_ID) && Boolean(process.env.HUBSPOT_FORM_ID);

  if (hasFormConfig) {
    const formResult = await submitHubSpotForm(lead);

    if (accessToken) {
      try {
        const contactId = await upsertHubSpotContact(accessToken, lead);
        await createHubSpotNote(accessToken, contactId, lead);
        return { contactId };
      } catch (error) {
        console.warn("[HubSpot] CRM sync after form submit failed:", error);
      }
    }

    return formResult;
  }

  if (!accessToken) {
    throw new Error(
      "HubSpot is not configured. Set HUBSPOT_ACCESS_TOKEN (or HUBSPOT_API_KEY), or HUBSPOT_PORTAL_ID + HUBSPOT_FORM_ID.",
    );
  }

  const contactId = await upsertHubSpotContact(accessToken, lead);
  await createHubSpotNote(accessToken, contactId, lead);

  return { contactId };
}
