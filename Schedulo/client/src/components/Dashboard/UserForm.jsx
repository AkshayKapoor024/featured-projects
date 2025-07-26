import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import LargeInput from '../forms/LargeInputs';
import SmallInput from '../forms/SmallInput';
import { useNavigate } from 'react-router-dom';
export default function UserForm({ focus, setFocus }) {
  const navigate = useNavigate();
  const [profilePicFile, setProfilePicFile] = useState(null);
  function handleFileChange(e) {
    setProfilePicFile(e.target.files[0]);
  }


  const [formData, setFormData] = useState({
    username: '',
    email: 'AkshayKapoor@gmail.com',
    fullname: '',
    occupation: '',
    organization: '',
    location: '',
    mobile: '',
    github: '',
    linkedin: '',
    instagram: '',
    bio: '',
    profilepic: ''
  });

  useEffect(() => {
    async function getUserInfo() {
      try {
        const res = await axios.get('https://schedulo-server-pfcu.onrender.com/userDetails');
        console.log(res)
        const data = res.data
        console.log(data)
        setFormData(prev => ({
          ...prev,
          _id: data._id,
          ...data
        }));
      } catch (error) {
        toast.error('Failed to fetch user details');
      }
    }
    getUserInfo();
  }, []);
  function handleFileChange(e) {
    setProfilePicFile(e.target.files[0]);
  }
  function handleChange(e) {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
}
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    console.log(formData)
    try {
      if (!formData._id) {
        toast.error('Missing user ID — unable to update profile');
        return;
      }

      Object.entries(formData).forEach(([key, val]) => {
        if (key !== 'profilepic') formDataToSend.append(key, val);
      });
      if (profilePicFile) formDataToSend.append('image', profilePicFile);

      let response = await axios.post('https://schedulo-server-pfcu.onrender.com/userDashboard/profile/saveDetails', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log(response.data)
      setFocus('dashboard')
      toast.success('Profile updated successfully!');

    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
   <div className="flex-1 flex justify-center h-full w-[90vw] sm:w-[90vw] md:w-[90vw] lg:w-[80vw] xl:w-[70vw] 2xl:w-[56vw] items-center bg-gray-100 rounded-r-2xl">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-r-2xl shadow-xl w-full h-full overflow-y-scroll grid grid-cols-1 auto-rows-min gap-y-4 px-6 py-4" encType="multipart/form-data" 

      >
        <div className="text-2xl 2xl:text-4xl font-bold flex justify-center items-center h-24 text-gray-900">
          Let us know you more !!
        </div>

        {/* Username and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmallInput
            label="Username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            name="username"
          />
          <SmallInput
            label="Email"
            placeholder="Your Email"
            value={formData.email}
            name="email"
            disabled
          />
        </div>

        {/* Name, Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmallInput
            label="Full Name"
            placeholder="Ex - John Doe"
            value={formData.fullname}
            onChange={handleChange}
            name="fullname"
          />
          <SmallInput
            label="Mobile Number"
            placeholder="+91 XXXXXXXXXX"
            value={formData.mobile}
            onChange={handleChange}
            name="mobile"
          />
        </div>

        {/* Occupation, Organization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmallInput
            label="Occupation"
            placeholder="Ex - Student / Developer"
            value={formData.occupation}
            onChange={handleChange}
            name="occupation"
          />
          <SmallInput
            label="Organization"
            placeholder="Ex - ADGIPS"
            value={formData.organization}
            onChange={handleChange}
            name="organization"
          />
        </div>

        {/* Location */}
        <LargeInput
          label="Location"
          placeholder="Ex - Delhi, India"
          value={formData.location}
          onChange={handleChange}
          name="location"
        />

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmallInput
            label="GitHub"
            placeholder="https://github.com/username"
            value={formData.github}
            onChange={handleChange}
            name="github"
          />
          <SmallInput
            label="LinkedIn"
            placeholder="https://linkedin.com/in/username"
            value={formData.linkedin}
            onChange={handleChange}
            name="linkedin"
          />
        </div>

        <LargeInput
          label="Instagram"
          placeholder="https://instagram.com/username"
          value={formData.instagram}
          onChange={handleChange}
          name="instagram"
        />

        {/* Profile Picture */}
        <input type="file" accept="image/*" name="image" onChange={handleFileChange} className='text-gray-900 ring-1 ring-blue-300' />

        {/* Bio */}
        <LargeInput
          label="Bio"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={handleChange}
          name="bio"
        />

        {/* Submit */}
        <div className="flex items-center justify-center h-24">
          <button type="submit" className="2xl:w-[700px] btn btn-outline btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
