import { addCredits } from "../utils/credits.server";

const REFERRAL_SIGNUP_REWARD = 75;

export async function action({ request }) {
  const payload = await request.json();
  console.log(JSON.stringify(payload));

  const eventType = payload.event_type;
  const data = payload.data;

  try {
    switch (eventType) {
      case "referral.created": {
        const email = data.email;
        await addCredits(email, REFERRAL_SIGNUP_REWARD);
        console.log("points granted");

        return Response.json({ status: 200 });
      }

      case "commission.created": {
        const promoterEmail = data.promoter_campaign.promoter.email;
        const amount = data.amount;
        await addCredits(promoterEmail, amount);
        console.log("points granted");

        return Response.json({ status: 200 });
      }

      default:
        console.log("different event");
        return Response.json({ status: 200 });
    }
  } catch (err) {
    console.error("error", err);
    return Response.json({ status: 400 });
  }
}
