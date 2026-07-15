import { useAuth } from "../context/AuthContext";

// "Refer a friend and get 75 credits" — links the logged-in user to the
// FirstPromoter promoter signup page, passing their email as cust_id so the
// fulfilment_pending webhook can later match the reward back to this user.
//
// Replace PROMOTER_PAGE_URL with your real promoter page link from
// FirstPromoter -> Campaigns section.
const PROMOTER_PAGE_URL = "https://dawid-fp.firstpromoter.com";

export default function ReferFriend() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;

  // Prefill promoter signup + pass cust_id (we use email as the stable key).
  const params = new URLSearchParams({
    email: currentUser.email,
    cust_id: currentUser.email, // must match the key the webhook rewards
  });
  if (currentUser.name) params.set("first_name", currentUser.name);

  const referralUrl = `${PROMOTER_PAGE_URL}?${params.toString()}`;

  return (
    <a
      href={referralUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
    >
      Refer a friend and get 75 credits
    </a>
  );
}
