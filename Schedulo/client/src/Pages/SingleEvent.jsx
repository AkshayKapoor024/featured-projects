import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import DetailedCard from "../components/DetailedCard/Detailed-Card"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
export default function SingleEvent() {
  const { id } = useParams()
  let [eventData, setEventData] = useState(null)
  const navigate = useNavigate()
  useEffect(() => {

    async function findEvent() {
      try {
        const res = await axios.get(`http://localhost:3000/events/${id}`)
        console.log(`Single event fetched successfully`)
        setEventData(res.data)
      } catch (err) { console.log(err.message) }
    }
    findEvent()

  }, [id])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/isAuthenticated`);
        if (!res.data?.email) {
          toast.error('Error: Signup to access this feature');
          navigate('/signup');
        }
      } catch (err) {
        console.error(err);
        toast.error('Auth check failed.');
        navigate('/signup');
      }
    };
    checkAuth();
  }, [navigate]);

  if (!eventData) {
    return <div className="text-center text-2xl p-10">Loading event details…</div>;
  }
  return (

    <div className="flex flex-col min-h-screen " style={{ fontFamily: 'Montserrat,sans-serif' }}>
      <Navbar />
      <DetailedCard obj={eventData} setEventData={setEventData}/>
      <Footer />
    </div>
  )
}