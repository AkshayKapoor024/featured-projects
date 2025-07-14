export default function LargeInput({ type = 'text', label, placeholder ,value, onChange,name}) {
  return (
    <div className="grid grid-cols-12 gap-4 h-24 items-center justify-center">
      <label className="col-span-4 2xl:col-span-2 min-h-16 text-xl font-semibold text-gray-700 text-center ">{label}</label>
      <div className="col-span-7 2xl:col-span-9">
        <input
          type={type}
          required
          maxLength={50}
          placeholder={placeholder}
          className="input input-info focus:ring-1 focus:ring-indigo-200 w-full bg-white validator  text-gray-600"
          value={value}
          onChange={onChange}
          name={name}
        />
        <div className="validator-hint text-sm text-red-500 mt-1">
          {type === 'email'
            ? 'Enter a valid email address (must include @)'
            : 'This field is required (max 50 characters)'}
        </div>
      </div>
    </div>
  );
}