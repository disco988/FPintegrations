import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function CreditsBadge() {
  const { currentUser } = useAuth();
  const [webhookCredits, setWebhookCredits] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.email) {
      setLoading(false);
      return;
    }

    let cancelled = false;

   
    fetch(`/api/credits?email=${encodeURIComponent(currentUser.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setWebhookCredits(data.credits || 0);
      })
      .catch(() => {
        if (!cancelled) setWebhookCredits(0);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.email]);

  if (!currentUser) return null;


  const basePoints = currentUser.points || 0;
  const total = basePoints + webhookCredits;

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3">
      <div className="text-xs font-medium text-indigo-500">Your credits</div>
      <div className="text-2xl font-bold text-indigo-900">
        {loading ? "…" : total}
      </div>
      {webhookCredits > 0 && (
        <div className="text-xs text-indigo-600 mt-0.5">
          includes {webhookCredits} referral credits
        </div>
      )}
    </div>
  );
}