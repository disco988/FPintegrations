export default function Input({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full border rounded-lg px-4 py-2.5 text-sm text-gray-900 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          error
            ? "border-red-400 focus:ring-red-400"
            : "border-gray-300"
        }`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
