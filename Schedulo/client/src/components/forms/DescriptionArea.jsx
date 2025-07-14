export default function DescriptionArea({ label, placeholder ,value,onChange,name}) {
  return (
    <div className="h-20 grid grid-cols-12 gap-2 2xl:h-28 items-center justify-center">
      <label className="text-lg h-28 col-span-4 2xl:col-span-2 2xl:text-xl font-semibold text-gray-700 text-center">{label}</label>
      <div className="col-span-7 2xl:col-span-9">
        <textarea
          required
          minLength={10}
          maxLength={120}
          placeholder={placeholder}
          className=" textarea sm:w-[425px] md: md:w-[450px] lg:w-[550px] xl:w-[700px] textarea-info focus:ring-1 focus:ring-indigo-200 2xl:w-[900px] bg-white validator text-gray-600"
          value={value}
          onChange={onChange}
          name={name}
        ></textarea>
        <div className="validator-hint text-sm text-red-500 mt-1">
          Description must be between 10 and 40 characters
        </div>
      </div>
    </div>
  );
}