

import { addCredits } from "../utils/credits.server";

const REFERRAL_SIGNUP_REWARD = 75;

export async function action({ request }) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const payload = await request.json();
  console.log("FP webhook received:", JSON.stringify(payload, null, 2));

  const eventType = payload?.event_type;
  const data = payload?.data || {};

  try {
    switch (eventType) {
      // A referred user signed up -> reward the REFERRAL.
      case "referral.created": {
        const email = data?.email;
        if (!email) {
          return Response.json({ ok: true, skipped: "no_referral_email" });
        }
        const total = await addCredits(email, REFERRAL_SIGNUP_REWARD);
        console.log(`referral.created: +${REFERRAL_SIGNUP_REWARD} to referral ${email} (total ${total})`);
        return Response.json({ ok: true, referral: email, total });
      }

      // A commission was earned -> reward the PROMOTER.
      case "commission.created": {
        if (data.status !== "approved") {
          return Response.json({ ok: true, skipped: "not_approved" });
        }
        const promoterEmail = data?.promoter_campaign?.promoter?.email;
        const amount = data?.amount || 0;
        if (!promoterEmail || amount <= 0) {
          return Response.json({ ok: true, skipped: "no_promoter_or_amount" });
        }
        const total = await addCredits(promoterEmail, amount);
        console.log(`commission.created: +${amount} to promoter ${promoterEmail} (total ${total})`);
        return Response.json({ ok: true, promoter: promoterEmail, total });
      }

      default:
        console.log("Unhandled FP event:", eventType);
        return Response.json({ ok: true, ignored: eventType });
    }
  } catch (err) {
    console.error("Error handling FP webhook:", err);
    return Response.json({ error: "Internal error" }, { status: 500 });
  }
}