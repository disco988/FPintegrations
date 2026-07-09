import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card, { CardHeader, CardBody } from "../components/ui/Card";

function SaveBanner({ show }) {
  if (!show) return null;
  return (
    <span className="text-sm text-green-600 font-medium animate-pulse">✓ Saved</span>
  );
}

function Toggle({ label, sub, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
          checked ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser, updateUser } = useAuth();

  // Profile state
  const [name,   setName]   = useState(currentUser?.name  || "");
  const [email,  setEmail]  = useState(currentUser?.email || "");
  const [firm,   setFirm]   = useState(currentUser?.firm  || "");
  const [profileSaved,  setProfileSaved]  = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);

  // Password state
  const [currentPw, setCurrentPw] = useState("");
  const [newPw,     setNewPw]     = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError,   setPwError]   = useState("");
  const [pwSaved,   setPwSaved]   = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // Notifications state
  const [notifs, setNotifs] = useState({
    weeklyDigest:    true,
    driftAlerts:     true,
    clientActivity:  false,
    productUpdates:  true,
  });
  const [notifSaved, setNotifSaved] = useState(false);

  function flash(setter) {
    setter(true);
    setTimeout(() => setter(false), 2500);
  }

  function handleProfileSave(e) {
    e.preventDefault();
    setProfileLoading(true);
    setTimeout(() => {
      updateUser({ name, email, firm });
      setProfileLoading(false);
      flash(setProfileSaved);
    }, 600);
  }

  function handlePasswordSave(e) {
    e.preventDefault();
    setPwError("");

    const storedUser = JSON.parse(localStorage.getItem("portfolium_user") || "{}");
    if (currentPw !== (storedUser.password || currentUser?.password)) {
      setPwError("Current password is incorrect.");
      return;
    }
    if (newPw.length < 6) {
      setPwError("New password must be at least 6 characters.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }

    setPwLoading(true);
    setTimeout(() => {
      setPwLoading(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      flash(setPwSaved);
    }, 700);
  }

  function handleNotifSave() {
    flash(setNotifSaved);
  }

  const initials = currentUser?.name
    ? currentUser.name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences.</p>
      </div>

      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white text-lg font-bold shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{currentUser?.name}</p>
          <p className="text-sm text-gray-400">{currentUser?.email}</p>
          <p className="text-xs text-gray-400 mt-0.5">Member since {currentUser?.createdAt}</p>
        </div>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Profile information</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
            <Input
              label="Full name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
            />
            <Input
              label="Email address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
            <Input
              label="Firm name"
              type="text"
              value={firm}
              onChange={(e) => setFirm(e.target.value)}
              placeholder="Smith Advisory Group"
              hint="Displayed on reports and in the sidebar."
            />
            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" loading={profileLoading}>Save changes</Button>
              <SaveBanner show={profileSaved} />
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Change password</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
            {pwError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {pwError}
              </div>
            )}
            <Input
              label="Current password"
              type="password"
              required
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <Input
              label="New password"
              type="password"
              required
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
            <Input
              label="Confirm new password"
              type="password"
              required
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              placeholder="Repeat new password"
              autoComplete="new-password"
            />
            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" loading={pwLoading}>Update password</Button>
              <SaveBanner show={pwSaved} />
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-gray-900">Notifications</h2>
        </CardHeader>
        <CardBody className="py-0">
          <div className="divide-y divide-gray-100">
            <Toggle
              label="Weekly digest"
              sub="Summary of portfolio performance every Monday."
              checked={notifs.weeklyDigest}
              onChange={(v) => setNotifs((n) => ({ ...n, weeklyDigest: v }))}
            />
            <Toggle
              label="Drift alerts"
              sub="Notify when a portfolio drifts more than 5% from target."
              checked={notifs.driftAlerts}
              onChange={(v) => setNotifs((n) => ({ ...n, driftAlerts: v }))}
            />
            <Toggle
              label="Client activity"
              sub="Notify when a client logs into their portal."
              checked={notifs.clientActivity}
              onChange={(v) => setNotifs((n) => ({ ...n, clientActivity: v }))}
            />
            <Toggle
              label="Product updates"
              sub="Occasional emails about new Portfolium features."
              checked={notifs.productUpdates}
              onChange={(v) => setNotifs((n) => ({ ...n, productUpdates: v }))}
            />
          </div>
          <div className="flex items-center gap-3 py-4">
            <Button size="sm" onClick={handleNotifSave}>Save preferences</Button>
            <SaveBanner show={notifSaved} />
          </div>
        </CardBody>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200">
        <CardHeader>
          <h2 className="font-semibold text-red-700">Danger zone</h2>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete account</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Permanently remove your account and all client data. This cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => alert("This is a demo — account deletion is disabled.")}
            >
              Delete account
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Export your data</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Download a copy of all your client and portfolio data as JSON.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert("Export — coming soon.")}
            >
              Export data
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
