import { Link } from "react-router";

export default function UpgradePrompt({ planName, clientLimit, onUpgradePromptClick }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-amber-800">
          You've reached the client limit for the {planName} plan
        </p>
        <p className="text-xs text-amber-600 mt-0.5">
          Your plan supports up to {clientLimit} clients. Upgrade to add more.
        </p>
      </div>
      <Link
        to="/billing"
        onClick={onUpgradePromptClick}
        className="shrink-0 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        Upgrade plan
      </Link>
    </div>
  );
}
