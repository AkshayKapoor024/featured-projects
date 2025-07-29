import { useState } from 'react';

/**
 * EnumsSelector – A simple tag input system with max 5 values
 * Adds entered text into an array, shows removable list
 */
export default function EnumsSelector({ max = 5, enums, setEnums, label }) {
  const [tag, setTag] = useState('');
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (enums.includes(trimmed)) {
      setError('Tag already exists');
    } else if (enums.length >= max) {
      setError(`Maximum ${max} tags allowed`);
    } else {
      setEnums(prev => [...prev, trimmed]);
      setTag('');
      setError('');
    }
  };

  const handleRemove = (tagToRemove) => {
    setEnums(prev => prev.filter(t => t !== tagToRemove));
  };

  return (
    <div className="w-full flex flex-col items-center">
      <label className="text-xl font-semibold pb-1 text-gray-600">{label}</label>

      {/* Input and Add Button */}
      <div className="flex gap-2 w-[300px] md:w-[600px] lg:w-[800px] xl:w-[1000px] 2xl:w-[400px] ">
        <input
          type="text"
          placeholder="Add tag (e.g. Blockchain)"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="input input-bordered md:w-[500px] lg:w-[750px] xl:w-[910px] 2xl:w-[200px] 2xl:flex-1 bg-white ring-1 ring-gray-300 text-gray-600 focus:ring-1 focus:ring-gray-600"
        />
        <button type="button" onClick={handleAdd} className="btn btn-primary">
          Add
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {/* Selected Tags */}
      {enums.length > 0 && (
        <div className="mt-3 w-[350px] 2xl:w-[400px] lg:w-[800px] xl:w-[1000px] md:w-[600px] space-y-2">
          {enums.map((tag, index) => (
            <div key={index} className="flex justify-between items-center p-2 text-gray-600 font-semibold rounded bg-gray-50 shadow-sm">
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemove(tag)}
                className="btn btn-xs btn-error"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
