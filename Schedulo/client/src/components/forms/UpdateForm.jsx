import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import CalendarInput from './CalenderInput';
import LargeInput from './LargeInputs';
import SmallInput from './SmallInput';
import DescriptionArea from './DescriptionArea';
import UserSelector from './UserSelector';
import EnumsSelector from './EnumsSelector'; // ✅ NEW

export default function UpdateForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [bannerFile, setBannerFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    banner: '',
    date: '',
    time: '12:00',
    venue: ''
  });

  const [host, setHost] = useState(null);
  const [cohosts, setCohosts] = useState([]);
  const [enums, setEnums] = useState([]); // ✅ NEW

  useEffect(() => {
    async function getOldData() {
      try {
        const res = await axios.get(`http://localhost:3000/events/${id}`);
        const event = res.data;
        const userRes = await axios.get('http://localhost:3000/isAuthenticated');
        const userId = userRes.data._id;

        if (event.owner !== userId) {
          toast.error("You're not authorized to edit this event.");
          navigate(`/events/${id}`);
          return;
        }

        setFormData({
          title: event.title || '',
          description: event.description || '',
          type: event.type || '',
          banner: event.banner || '',
          date: event.date || '',
          time: event.time || '12:00',
          venue: event.venue || ''
        });

        setEnums(event.enums || []); // ✅ Prefill tags
        setHost(event.host || null);
        setCohosts(event.cohosts || []);
      } catch (err) {
        toast.error(err.response?.data || "Something went wrong.");
      }
    }

    getOldData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  function handleFileChange(e) {
    setBannerFile(e.target.files[0]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
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
      if (bannerFile) payload.append('image', bannerFile);


      await axios.put(`http://localhost:3000/events/${id}/updateDetails`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Success: Event updated');
      navigate(`/events/${id}`);
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("You are not allowed to modify this event.");
        navigate(`/events/${id}`);
      } else {
        toast.error(error.response?.data || "Something went wrong.");
      }
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
        onSubmit={handleSubmit}
        className="grid grid-cols-1 auto-rows-min bg-white shadow-xl min-h-[800px] w-[1200px] m-5 gap-2" encType="multipart/form-data"
      >
        <div className="p-2 text-2xl 2xl:text-4xl font-bold flex justify-center items-center h-24 text-gray-900">
          Update your event details
        </div>

        <LargeInput label="Title" placeholder="Ex - Blockchain Community Seminar" value={formData.title} onChange={handleChange} name="title" />
        <DescriptionArea label="Description" placeholder="Event Description" value={formData.description} onChange={handleChange} name="description" />

        <div className="grid grid-cols-2 gap-4 items-start px-4">
          <SmallInput label="Type" placeholder="Online/Offline/Hybrid" value={formData.type} onChange={handleChange} name="type" />
          <input type="file" accept="image/*" name="image" onChange={handleFileChange} />
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

        <div className="2xl:grid grid-cols-2 gap-4 items-start px-4">
          <UserSelector label="Host" type="host" selectedUsers={host} setSelectedUsers={setHost} />
          <UserSelector label="Cohosts" type="cohosts" max={5} selectedUsers={cohosts} setSelectedUsers={setCohosts} />
        </div>

        <EnumsSelector label="Tags / Categories" enums={enums} setEnums={setEnums} max={5} /> {/* ✅ NEW */}

        <div className="flex items-center justify-center h-24">
          <button type="submit" className="2xl:w-[700px] btn btn-outline btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}