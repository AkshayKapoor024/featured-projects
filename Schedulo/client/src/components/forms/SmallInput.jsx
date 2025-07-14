export default function SmallInput({ type = 'text', label, placeholder , value , onChange , name}) {
  const pattern = type === 'email' ? '[^@\\s]+@[^@\\s]+\\.[^@\\s]+' : undefined;

  return (
    <div className="grid grid-cols-7 items-center gap-2 h-24">
      <label className="col-span-3 2xl:col-span-3 text-center text-xl font-semibold text-gray-600">{label}</label>
      <div className="flex mx-2 items-center col-span-5 2xl:mx-0 2xl:col-span-3 ">
        <input
          type={type}
          required
          pattern={pattern}
          placeholder={placeholder}
          className="input input-info focus:ring-1 focus:ring-indigo-200 bg-white w-[150px] sm:w-[600px] 2xl:w-[700px] validator  text-gray-600"
          value={value}
          onChange={onChange}
          name={name}
        />
        <div className="validator-hint text-sm text-red-500 mt-1">
          {type === 'email'
            ? 'Must be a valid email (e.g. name@example.com)'
            : 'This field is required'}
        </div>
      </div>
    </div>
  );
}