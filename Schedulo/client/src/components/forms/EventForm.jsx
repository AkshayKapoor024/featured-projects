import { useNavigate } from 'react-router-dom';
import CalendarInput from "./CalenderInput";
import LargeInput from "./LargeInputs";
import SmallInput from "./SmallInput";
import DescriptionArea from "./DescriptionArea";
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import UserSelector from './UserSelector';
import EnumsSelector from './EnumsSelector';

export default function EventForm() {
  const navigate = useNavigate();
  const [host, setHost] = useState(null);
  const [cohosts, setCohosts] = useState([]);
  const [enums, setEnums] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    banner: '',
    date: '',
    time: '12:00',
    venue: '',
    host: '',
    cohosts: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        host: host?._id || null,
        cohosts: cohosts.map(user => user._id),
        enums: enums // ✅ array of tags added here
      };

      const response = await axios.post('http://localhost:3000/events', payload);
      console.log('Data Stored in Backend Successfully:', response.data);
      toast.success("Success: Data stored successfully");
      navigate('/');
    } catch (err) {
      const message = err.response?.data || "Something went wrong. Please try again.";
      toast.error(`Error: ${message}`);
    }
  }

  const handleDateSelect = (date) => {
    setFormData(prev => ({
      ...prev,
      date: date ? date.toLocaleDateString('en-CA') : ''
    }));
  };

  const handleTimeChange = (e) => {
    setFormData(prev => ({ ...prev, time: e.target.value }));
  };

  return (
    <div className="flex-1 flex justify-center items-center bg-gray-100">
      <form
        className="grid grid-cols-1 auto-rows-min bg-white shadow-xl min-h-[800px] w-[1200px] m-5 gap-2"
        onSubmit={handleSubmit}  encType="multipart/form-data"
      >
        <div className="p-2 text-4xl font-bold flex justify-center items-center h-24 text-gray-900">
          Create an Event
        </div>

        <LargeInput label="Title" placeholder="Ex - Blockchain Community Seminar" value={formData.title} onChange={handleChange} name="title" />
        <DescriptionArea label="Description" placeholder="Event Description" value={formData.description} onChange={handleChange} name="description" />

        <div className="grid grid-cols-2 h-24 justify-evenly items-center">
          <SmallInput label="Type" placeholder="Online/Offline/Hybrid" value={formData.type} onChange={handleChange} name="type" />
          <SmallInput type='file' label="Banner" placeholder="Add Image Url" value={formData.banner} onChange={handleChange} name="banner" />
        </div>

        <CalendarInput
          date={formData.date}
          time={formData.time}
          onDateChange={handleDateSelect}
          onTimeChange={handleTimeChange}
          Datename="date"
          Timename="time"
        />

        <LargeInput label="Venue" placeholder="Venue / Location" value={formData.venue} onChange={handleChange} name="venue" />

        <div className="2xl:grid grid-cols-2 gap-4 items-start m-2 ">
          <UserSelector label="Host" type="host" selectedUsers={host} setSelectedUsers={setHost} />
          <UserSelector label="Cohosts" type="cohosts" max={5} selectedUsers={cohosts} setSelectedUsers={setCohosts} />
        </div>

        <EnumsSelector label="Tags / Categories" enums={enums} setEnums={setEnums} max={5} />

        <div className="flex items-center justify-center h-24">
          <button className="2xl:w-[700px] btn btn-outline btn-primary" type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}