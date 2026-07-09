import { useState } from "react";
import { useAuth } from "../context/AuthContext";


export default function Account() {
  const { currentUser, updateUser } = useAuth();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSaved, setPwSaved] = useState(false);

  function handleProfileSave(e) {
    e.preventDefault();
    updateUser({ name, email });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  }

  function handlePasswordSave(e) {
    e.preventDefault();
    setPwError("");
    if (currentPw !== currentUser.password) {
      setPwError("Current password is incorrect.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("New passwords do not match.");
      return;
    }
    updateUser({ password: newPw });
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 3000);
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account settings</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your profile and security.
        </p>
      </div>

      {/* Profile */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Profile</h2>
        <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700"
            >
              Save changes
            </button>
            {profileSaved && (
              <span className="text-sm text-green-600">Saved!</span>
            )}
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-5">Change password</h2>
        <form onSubmit={handlePasswordSave} className="flex flex-col gap-4">
          {pwError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {pwError}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current password
            </label>
            <input
              type="password"
              required
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPw}
              onChange={(e) => setNewPw(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              required
              value={confirmPw}
              onChange={(e) => setConfirmPw(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700"
            >
              Update password
            </button>
            {pwSaved && (
              <span className="text-sm text-green-600">Password updated!</span>
            )}
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-200 rounded-xl p-6">
        <h2 className="font-semibold text-red-700 mb-2">Danger zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, there is no going back.
        </p>
        <button
          className="border border-red-300 text-red-600 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50"
          onClick={() =>
            alert("Dummy version of Saas, account deletion is not implemented")
          }
        >
          Delete account
        </button>
      </div>
    </div>
  );
}
