import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/card/Card';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
function Homepage() {
  const [events, setEvents] = useState([]);
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
 const query = useQuery();
  const calendarStatus = query.get('calendar');
  
  const fetchEvents = async () => {
    await axios.get('https://schedulo-server-pfcu.onrender.com/events')
      .then((res) => {
        toast.success("Success : Events fetched successfully");
        setEvents(res.data);
      })
      .catch((err) => {
        const message = err.response?.data || "Something went wrong. Please try again.";
        toast.error(`Error: ${message}`);
      });
  };

useEffect(() => {
  const timer = setTimeout(() => {
    axios
      .get('https://schedulo-server-pfcu.onrender.com/session-check', {
        withCredentials: true
      })
      .then(res => {
        console.log('✔️ Session touched:', res.data);
      })
      .catch(() => {
        console.warn('❌ No session – redirect or prompt login');
      });
  }, 300); // Wait 300ms for cookie to attach

  return () => clearTimeout(timer);
}, []);

 useEffect(() => {
    if (calendarStatus === 'success') {
      toast.success('Calendar Integration successfull!')
      // Show toast or modal
    }else if(calendarStatus==='failure'){
      toast.error('Calendar Integration failed try again!')
    }
  }, [calendarStatus]);


  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className='flex-1 bg-gray-100' style={{ fontFamily: 'Montserrat,sans-serif' }}>
        <motion.h1
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='h-14 p-2 font-bold text-xl text-gray-900 shadow-md flex justify-start items-center 2xl:text-4xl'
        >
          Don’t Miss What’s Happening Next!
        </motion.h1>

        <div className='flex justify-center items-center gap-x-10 flex-wrap'>
          {events.map((object, index) => (
            <motion.div
              key={object._id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1, type: 'spring' }}
            >
              <Card object={object} />
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Homepage;
