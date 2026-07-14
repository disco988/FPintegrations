import { createContext, useContext, useMemo } from "react";
import { useAuth } from "./AuthContext";
import { PLANS } from "../data/plans";
import { MOCK_CLIENTS } from "../data/mockClients";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { currentUser } = useAuth();

  const value = useMemo(() => {
    if (!currentUser) {
      return { plan: null, clients: [], clientCount: 0, atLimit: false, points: 0 };
    }

    const plan = PLANS.find((p) => p.id === currentUser.planId) || PLANS[0];
    const clients = MOCK_CLIENTS.filter((c) =>
      (currentUser.clients || []).includes(c.id)
    );
    const clientCount = clients.length;
    const atLimit = plan.clientLimit !== null && clientCount >= plan.clientLimit;
    const points = currentUser.points ?? 0;

    return { plan, clients, clientCount, atLimit, points };
  }, [currentUser]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used inside SubscriptionProvider");
  return ctx;
}
