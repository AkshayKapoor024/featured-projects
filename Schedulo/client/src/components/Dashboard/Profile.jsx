import { useEffect, useState } from 'react';
import profile from '../../assets/OpenPeepsAvatar.png';
import CountUp from '../DetailedCard/Animation';
import axios from 'axios';

export default function Profile() {
  const [details, setDetails] = useState({
    bio: '',
    createdAt: '',
    email: '',
    fullname: '',
    github: '',
    instagram: '',
    linkedin: '',
    location: '',
    mobile: '',
    occupation: '',
    organization: '',
    profilepic: '',
    username: '',
    __v: 0,
    _id: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await axios.get('https://schedulo-server-pfcu.onrender.com/isAuthenticated',{
  withCredentials: true,
});
        setDetails(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };
    fetchData();
  }, []);

  return (
   <div className="text-gray-900 bg-white h-full flex flex-col w-[90vw] sm:w-[90vw] md:w-[90vw] lg:w-[80vw] p-5 xl:w-[65vw] 2xl:w-[56vw] rounded-b-2xl md:rounded-r-2xl ">
      <div className="min-h-[10vh] md:min-h-[52] rounded-r-2xl flex justify-center items-center gap-5">
        <div className="bg-green-300 h-[5vh] w-[30vw] md:h-[7vh] md:w-[12vw] lg:h-[60px] lg:w-[60px] xl:w-[80px] xl:h-[80px]  rounded-full flex justify-center items-center overflow-hidden">
          <img
            src={details.profilepic}
            alt="Profile"
            className="object-cover"
          />
        </div>
        <div className="h-32 w-[700px] flex flex-col">
          <div className="h-12 p-2 flex items-center text-3xl font-bold my-2">
            {(details.username || '').trim()
              ? details.username
              : <span className="text-red-500 italic font-semibold">Oops! Empty field</span>}
          </div>
          <div className="flex-1 p-2 text-base font-medium text-gray-600">
            {(details.bio || '').trim()
              ? details.bio
              : <span className="text-red-500 italic font-semibold">Oops! Empty field</span>}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 rounded-r-2xl">
        <h1 className="h-16  p-5 items-center text-2xl md:text-4xl font-bold shadow-md">Personal Details</h1>
        <div className="flex-1 flex flex-col rounded-r-2xl">
          <div className="min-h-36 flex flex-col md:flex-row ">
            <div className="flex min-h-36 flex-col justify-center 2xl:w-96">
              <div className="min-h-12 flex justify-start p-2 items-center text-gray-600 font-medium">
                <span className="font-semibold">😎Full Name - &nbsp;</span>
                {(details.fullname || '').trim()
                  ? details.fullname
                  : <span className="text-red-500 font-semibold italic">Oops! Empty field</span>}
              </div>
              <div className="min-h-12 flex justify-start p-2 items-center text-gray-600 font-medium">
                <span className="font-semibold">📱Mobile Number - &nbsp;</span>
                {(details.mobile || '').trim()
                  ? details.mobile
                  : <span className="text-red-500 font-semibold italic">Oops! Empty field</span>}
              </div>
              <div className="min-h-12 flex justify-start p-2 items-center text-gray-600 text-sm font-medium">
                <span className="text-base font-semibold">✉️Email - &nbsp;</span>
                {(details.email || '').trim()
                  ? details.email
                  : <span className="text-red-500 font-semibold italic">Oops! Empty field</span>}
              </div>
            </div>

            <div className="flex min-h-36 flex-col justify-center flex-1">
              <div className="min-h-12 flex justify-start p-2 items-center text-gray-600 font-medium">
                <span className="font-semibold">📌Location - &nbsp;</span>
                {(details.location || '').trim()
                  ? details.location
                  : <span className="text-red-500 font-semibold italic">Oops! Empty field</span>}
              </div>
              <div className="min-h-12 flex justify-start p-2 items-center text-gray-600 font-medium">
                <span className="font-semibold">🤵Occupation - &nbsp;</span>
                {(details.occupation || '').trim()
                  ? details.occupation
                  : <span className="text-red-500 font-semibold italic">Oops! Empty field</span>}
              </div>
              <div className="min-h-12 flex justify-start p-2 items-center text-gray-600 font-medium text-sm">
                <span className="text-base font-semibold">🏢Organization - &nbsp;</span>
                {(details.organization || '').trim()
                  ? details.organization
                  : <span className="text-red-500 font-semibold italic">Oops! Empty field</span>}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h1 className="h-16 flex p-5 items-center text-2xl md:text-4xl font-bold shadow-md">My Activity</h1>
            <div className="flex flex-col">
              <div className="h-auto flex flex-col md:flex-row flex-1 w-full">
                <div className="flex flex-col flex-1 min-h-40 justify-start">
                  <h1 className="h-16 flex items-center justify-center text-2xl font-semibold text-gray-700">
                    Events Attended
                  </h1>
                  <div className="flex-1 flex justify-center items-center text-5xl font-bold text-indigo-500">
                    <CountUp target={42} title={'Events'} />
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-h-40 justify-start">
                  <h1 className="h-16 flex items-center justify-center text-2xl font-semibold text-gray-700">
                    Events Hosted
                  </h1>
                  <div className="flex-1 flex justify-center items-center text-5xl font-bold text-indigo-500">
                    <CountUp target={12} title={'Events'} />
                  </div>
                </div>
                <div className="flex flex-col flex-1 min-h-52 justify-center items-center">
                  <h1 className="h-16 flex items-center justify-center text-2xl w-full font-semibold text-gray-700">
                    Social Links
                  </h1>
                  <div className="flex-1 flex flex-col w-full justify-center items-center md:items-start p-2 gap-2 text-blue-600 underline cursor-pointer text-lg">
                    <div className="flex justify-center items-center gap-2">
                      <i className="fa-brands fa-linkedin text-xl text-blue-950"></i>
                      <span className="text-base">
                        {(details.linkedin || '').trim()
                          ? details.linkedin
                          : <span className="text-red-500 font-semibold italic">Oops! Empty field</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-brands fa-github text-xl text-black"></i>
                      <span className="text-base">
                        {(details.github || '').trim()
                          ? details.github
                          : <span className="text-red-500 font-semibold italic">Oops! Empty field</span>}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fa-brands fa-instagram text-xl text-pink-600"></i>
                      <span className="text-base">
                        {(details.instagram || '').trim()
                          ? details.instagram
                          : <span className="text-red-500 font-semibold italic">Oops! Empty field</span>}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="italic min-h-24 flex-1 p-2 flex justify-center items-end text-2xl text-gray-600 font-bold">
                "Your journey through events, one RSVP at a time."
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
