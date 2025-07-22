import { useEffect } from "react";
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import EventForm from "../components/forms/EventForm"
import { useNavigate } from "react-router-dom";
 import { toast } from "react-toastify";
 import axios from "axios";
export default function AddEvent(){
    const navigate = useNavigate()
    useEffect(() => {
      const checkAuth = async () => {
    try {
      const res = await axios.get(`https://schedulo-server-pfcu.onrender.com/isAuthenticated`,{
  withCredentials: true,
});
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
    return (
        
        <div className="flex flex-col min-h-screen " style={{fontFamily:'Montserrat,sans-serif'}}>
            <Navbar />
            <EventForm />
            <Footer />
        </div>
    )
}
