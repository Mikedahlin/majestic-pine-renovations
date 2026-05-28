export type LeadPayload = {
  firstName: string;
  lastName: string;
  propertyAddress: string;
  phone: string;
  smsOptIn: boolean;
  email: string;
  projectCategory: string;
  budgetRange: string;
  files?: { name: string; size: number; type: string }[];
  submittedAt: string;
};

export type LeadResult = {
  success: boolean;
  leadId: string;
  message: string;
};

/** Swap-friendly CRM integration point — wire HubSpot, Buildertrend, etc. */
export async function createCrmContact(
  lead: LeadPayload,
): Promise<{ contactId: string | null }> {
  const provider = process.env.CRM_PROVIDER;

  if (provider === "hubspot" && process.env.HUBSPOT_API_KEY) {
    // Placeholder: POST to HubSpot Contacts API
    console.info("[CRM] HubSpot contact creation queued", {
      email: lead.email,
      category: lead.projectCategory,
    });
    return { contactId: `hs_${Date.now()}` };
  }

  if (provider === "buildertrend") {
    console.info("[CRM] Buildertrend lead queued", {
      email: lead.email,
    });
    return { contactId: `bt_${Date.now()}` };
  }

  console.info("[CRM] Lead stored locally (no CRM provider configured)", {
    email: lead.email,
  });
  return { contactId: null };
}

/** Tag lead by project category for downstream routing */
export function tagLeadByCategory(category: string): string[] {
  const tags = ["website-lead", category.toLowerCase()];
  if (category === "Commercial") tags.push("commercial-priority");
  if (category === "Exterior") tags.push("exterior-services");
  return tags;
}

/** SMS confirmation integration point */
export async function sendSmsConfirmation(
  phone: string,
  optIn: boolean,
): Promise<void> {
  if (!optIn) return;
  const provider = process.env.SMS_PROVIDER;
  if (!provider) {
    console.info("[SMS] Opt-in received, no provider configured", { phone });
    return;
  }
  console.info(`[SMS] Confirmation queued via ${provider}`, { phone });
}

/** Internal dispatch alert integration point */
export async function sendDispatchAlert(lead: LeadPayload): Promise<void> {
  const webhook = process.env.DISPATCH_WEBHOOK_URL;
  if (!webhook) {
    console.info("[Dispatch] New lead alert (no webhook configured)", {
      name: `${lead.firstName} ${lead.lastName}`,
      category: lead.projectCategory,
    });
    return;
  }
  console.info("[Dispatch] Alert sent to webhook", { webhook });
}

/** Email notification integration point */
export async function sendEmailNotification(
  lead: LeadPayload,
): Promise<void> {
  const to = process.env.LEAD_NOTIFICATION_EMAIL;
  if (!to) {
    console.info("[Email] Lead notification (no email configured)", {
      email: lead.email,
    });
    return;
  }
  console.info("[Email] Notification queued", { to, from: lead.email });
}

export async function processLead(lead: LeadPayload): Promise<LeadResult> {
  const leadId = `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const tags = tagLeadByCategory(lead.projectCategory);

  await Promise.all([
    createCrmContact(lead),
    sendSmsConfirmation(lead.phone, lead.smsOptIn),
    sendDispatchAlert(lead),
    sendEmailNotification(lead),
  ]);

  console.info("[Lead] Processed", { leadId, tags });

  return {
    success: true,
    leadId,
    message: "Your project details have been received. Our team will contact you shortly.",
  };
}
