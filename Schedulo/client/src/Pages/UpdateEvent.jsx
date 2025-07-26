import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import UpdateForm from "../components/forms/UpdateForm"
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
export default function UpdateEvent() {
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

    <div className="flex flex-col min-h-screen " style={{ fontFamily: 'Montserrat,sans-serif' }}>
      <Navbar />
      {<UpdateForm />}
      <Footer />
    </div>
  )
}
