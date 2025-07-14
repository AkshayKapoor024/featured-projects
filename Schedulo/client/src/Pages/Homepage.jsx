import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';
import Card from '../components/card/Card';
import { toast } from 'react-toastify';


function Homepage() {
  //State variable (Array of events )
  const [events, setEvents] = useState([])
  const fetchEvents = async ()=>{
    await axios.get('http://localhost:3000/events').then((res)=>{
      toast.success("Success : Events fetched successfully")
      setEvents(res.data)
    }).catch((err)=>{
       const message =
    err.response?.data || "Something went wrong. Please try again.";

  toast.error(`Error: ${message}`);
    })
  }
  //Explicitly creating a session id for the frontend
  useEffect(() => {
    axios.get('http://localhost:3000/session-check')
    .then(res => console.log('Session set'))
    .catch(err => console.log('Error:', err));
  }, []);
  //Calls backend to fetch events at every reload or navigation
  
  useEffect(()=>{fetchEvents()},[])
  return (
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className='flex-1 bg-gray-100' style={{ fontFamily: 'Montserrat,sans-serif' }}>
          <h1 className='h-14 p-2 font-bold text-xl text-gray-900 shadow-md flex justify-start items-center 2xl:text-4xl'>Don’t Miss What’s Happening Next!</h1>
          <div className=' flex justify-center items-center gap-x-10 flex-wrap'>
            {
            events.map((object,index)=>{
              return <Card object={object} key={object._id}/>
            })
            }
          </div>
        </div>
        <Footer />
    </div>
  );

}

export default Homepage
