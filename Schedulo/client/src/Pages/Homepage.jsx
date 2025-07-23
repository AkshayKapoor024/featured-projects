import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/card/Card';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Homepage() {
  const [events, setEvents] = useState([]);

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
  const trySession = async () => {
    try {
      await axios.post(
        'https://schedulo-server-pfcu.onrender.com/session-check',
        { init: true },
        { withCredentials: true }
      );
      setTimeout(() => {
        console.log(
          document.cookie.includes('connect.sid')
            ? 'Session cookie created'
            : 'Cookie not stored yet'
        );
      }, 50);
    } catch (e) {
      console.error('session-check failed', e);
    }
  };

  trySession();   // ← actually call it!
}, []);

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
