import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from 'framer-motion';
import Loader from "../components/LoadingState";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Card from "../components/card/Card";
import EmptyList from "../components/EmptyList";

export default function SearchPage() {
  const [loading, setLoading] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false); // tracks empty state
  const location = useLocation();
  const input = location.state || '';
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const findEvents = async () => {
      setLoading(true);
      setIsEmpty(false); // reset if re-search

      try {
        const response = await axios.get(
          `http://localhost:3000/api/searchResults?inputQuery=${input}`
        );

        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          setEvents(response.data);
          toast.success("Events fetched successfully!");
        } else {
          setEvents([]);
          setIsEmpty(true);
        }
      } catch (error) {
        toast.error("Cannot find events for search");
        setIsEmpty(true);
      } finally {
        setLoading(false);
      }
    };

    findEvents();
  }, [input]);

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <Navbar />
      <div className="flex-1">
        {loading ? (
          <Loader loading={loading} setLoading={setLoading} />
        ) : isEmpty ? (
          <EmptyList />
        ) : (
          <>
            <motion.h1
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="text-md h-14 p-2 font-bold xl:text-xl text-gray-900 shadow-md flex justify-start items-center 2xl:text-4xl"
            >
              {`Search Results for "${input}"`}
            </motion.h1>

            <div className="flex justify-center items-center gap-x-10 flex-wrap px-4 py-6">
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
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}