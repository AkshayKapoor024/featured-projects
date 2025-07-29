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
  const [bannerFile, setBannerFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
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

  const handleFileChange = (e) => {
    setBannerFile(e.target.files[0]);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('type', formData.type);
    payload.append('venue', formData.venue);
    payload.append('date', formData.date);
    payload.append('time', formData.time);
    payload.append('host', host?._id || '');
    payload.append('cohosts', JSON.stringify(cohosts.map(user => user._id)));
    payload.append('enums', JSON.stringify(enums));
    console.log('Banner file selected:', bannerFile);
    if (bannerFile) payload.append('image', bannerFile);

    try {
      const response = await axios.post('https://schedulo-server-pfcu.onrender.com/events', payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Success: Data stored successfully");
      navigate('/');
    } catch (err) {
      const message = err.response?.data || "Something went wrong. Please try again.";
      toast.error(`Error: ${message}`);
    }
  }

  const handleDateSelect = (date) => {
    setFormData(prev => ({ ...prev, date: date ? date.toLocaleDateString('en-CA') : '' }));
  };

  const handleTimeChange = (e) => {
    setFormData(prev => ({ ...prev, time: e.target.value }));
  };

  return (
    <div className="flex-1 flex justify-center items-center bg-gray-100">
      <form onSubmit={handleSubmit} encType="multipart/form-data"
        className="grid grid-cols-1 auto-rows-min bg-white shadow-xl min-h-[800px] w-[1200px] m-5 gap-2">
        <div className="p-2 text-4xl font-bold flex justify-center items-center h-24 text-gray-900">
          Create an Event
        </div>

        <LargeInput label="Title" placeholder="Ex - Blockchain Community Seminar" value={formData.title} onChange={handleChange} name="title" />
        <DescriptionArea label="Description" placeholder="Event Description" value={formData.description} onChange={handleChange} name="description" />

        <div className="grid grid-cols-2 h-24 justify-evenly items-center px-4 mb-5">
          <SmallInput label="Type" placeholder="Online/Offline/Hybrid" value={formData.type} onChange={handleChange} name="type" />
          <input type="file" accept="image/*" name="image" onChange={handleFileChange} className='text-gray-600 ring-1 ring-blue-300 w-[80vw] relative right-[40vw] top-[16vw] md:relative md:top-[0vh] md:left-[10vw] md:w-[30vw] 2xl:w-[20vw]'/>
        </div>

        <CalendarInput date={formData.date} time={formData.time} onDateChange={handleDateSelect} onTimeChange={handleTimeChange} />

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
