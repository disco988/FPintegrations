// Read-only endpoint: given ?email=... returns that user's webhook credits.
// The client (dashboard) calls this after reading the logged-in user from
// localStorage, since the server can't see localStorage itself.
//
// GET /api/credits?email=user@x.com  ->  { email, credits }

import { getCredits } from "../utils/credits.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return Response.json({ error: "missing email" }, { status: 400 });
  }

  const credits = await getCredits(email);
  return Response.json({ email, credits });
}
