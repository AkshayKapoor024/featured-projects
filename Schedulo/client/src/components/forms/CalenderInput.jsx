import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function CalendarInput({ date, time, onDateChange, onTimeChange, Datename, Timename }) {
  return (
    <>
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 justify-center items-center">
        {/* Date Picker Section */}
        <div className="flex flex-col items-center justify-center p-4 rounded">
          <label className="text-xl text-center font-semibold text-gray-600 mb-2">Date</label>
          <div className="bg-base-100 border border-base-300 shadow-lg rounded-box p-4 overflow-x-auto">
            <DayPicker
              mode="single"
              selected={date ? new Date(date) : undefined}
              onSelect={onDateChange}
              className="text-gray-100"
              required
            />
            <p className="mt-2 text-sm text-gray-100">
              {date ? `You picked ${new Date(date).toLocaleDateString()}` : 'Please pick a date'}
            </p>
          </div>
        </div>

        {/* Time Input Section */}
        <div className="flex flex-col justify-start 2xl:items-start items-center ">
          <label className="text-xl font-semibold text-gray-600 mb-2">Time</label>
          <input
            type="time"
            name={Timename}
            required
            className="input input-info focus:ring-1 focus:ring-indigo-400 bg-white  text-gray-400 validator"
            value={time}
            onChange={onTimeChange}
            step={60}
          />
          <div className="validator-hint text-sm text-red-500 mt-2">
            Time is required
          </div>
        </div>
      </div>

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={Datename}
        value={date}
      />
    </>
  );
}
