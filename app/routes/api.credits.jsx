import { getCredits } from "../utils/credits.server";

export async function loader({ request }) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  if (!email) {
    return Response.json({ status: 400 });
  }

  const credits = await getCredits(email);
  return Response.json({ email, credits });
}
