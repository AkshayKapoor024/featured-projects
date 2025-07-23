import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Profile from "../components/Dashboard/Profile";
import UserForm from "../components/Dashboard/UserForm";
import MyRsvp from "../components/Dashboard/MyRsvp";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function User() {
  const [focus, setFocus] = useState(null); // Determined after user info check
  const navigate = useNavigate();

  const handleClick = (e) => {
    setFocus(e.target.id);
  };

  const handleLogout = () => {
    const trylogout = async () => {
      try {
        await axios.get('https://schedulo-server-pfcu.onrender.com/logout');
        navigate('/');
        toast.success('User Logged out Successfully!');
      } catch (error) {
        toast.error('Error logging out user!');
      }
    };
    trylogout();
  };

  useEffect(() => {
    const verifyProfile = async () => {
      try {
        const res = await axios.get('https://schedulo-server-pfcu.onrender.com/isAuthenticated',{
  withCredentials: true,
});
        const data = res.data;

        const requiredFields = [
          'bio', 'fullname', 'github', 'instagram', 'linkedin',
          'location', 'mobile', 'occupation', 'organization', 'profilepic'
        ];

        const isComplete = requiredFields.every(field =>
          data[field] && data[field].trim() !== ''
        );

        setFocus(isComplete ? 'dashboard' : 'edit');

      } catch (error) {
        console.error('Error verifying profile:', error);
        toast.error('Unable to verify user info');
        setFocus('edit');
      }
    };

    verifyProfile();
  }, []);

  return (
    <div className="flex 2xl:flex-row justify-center items-center min-h-screen rounded-2xl bg-indigo-100" style={{ fontFamily: 'Montserrat,sans-serif' }}>
      <motion.div
        initial={{ y: 50, scale: 0.9, opacity: 0 }}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="rounded-2xl lg:w-[80vw] xl:w-[80vw] 2xl:w-[73vw] xl:h-[90vh] flex flex-col xl:flex-row 2xl:flex-row justify-center items-center shadow-2xl m-5"
      >
        <div className="bg-indigo-600 justify-center items-center h-full w-[90vw] lg:w-[80vw] rounded-2xl xl:w-[20vw] 2xl:w-[20vw] xl:rounded-l-2xl flex xl:flex-col gap-5 lg:px-2 2xl:p-3">
          <Link to="/" className="ml-2 text-md md:text-2xl flex items-center h-24 rounded-t-2xl justify-center 2xl:items-start 2xl:text-4xl font-semibold gap-2">
            <i className="fa-solid fa-calendar-week"></i> Schedulo
          </Link>

          <div className="md:flex md:justify-center md:items-center lg:gap-2 xl:block xl:gap-0 ">
            <motion.div
              whileTap={{ scale: 1.1 }}
              className={` text-sm md:text-xl md:text-center flex items-center h-16 justify-center xl:text-2xl font-semibold gap-2 cursor-pointer ${focus === 'dashboard' ? 'bg-indigo-500' : 'active:bg-indigo-400'}`}
              onClick={handleClick}
              id="dashboard"
            >
              🥸 Dashboard
            </motion.div>
            <motion.div
              whileTap={{ scale: 1.1 }}
              className={`text-sm md:text-xl md:text-center flex items-center h-16 justify-center 2xl:text-2xl font-semibold gap-2 cursor-pointer ${focus === 'rsvp' ? 'bg-indigo-500' : 'active:bg-indigo-400'}`}
              onClick={handleClick}
              id="rsvp"
            >
              🗓️ My RSVP's
            </motion.div>
            <motion.div
              whileTap={{ scale: 1.1 }}
              className={`text-sm md:text-xl flex md:text-center items-center h-16 justify-center 2xl:text-2xl font-semibold gap-2 cursor-pointer ${focus === 'edit' ? 'bg-indigo-500' : 'active:bg-indigo-400'}`}
              onClick={handleClick}
              id="edit"
            >
              ✏️ Edit Profile
            </motion.div>
          </div>

          <div className="flex-1 flex items-end p-5">
            <motion.div
              whileTap={{ scale: 1.1 }}
              className=" text-sm md:text-xl flex text-center items-center h-16 justify-center 2xl:text-2xl font-semibold gap-2 cursor-pointer active:bg-indigo-400 focus:bg-indigo-500"
              onClick={handleLogout}
            >
              🙂‍↕️Logout from Schedulo
            </motion.div>
          </div>
        </div>

        {focus === 'dashboard' && <Profile />}
        {focus === 'edit' && <UserForm focus={focus} setFocus={setFocus}/>}
        {focus === 'rsvp' && <MyRsvp />}
      </motion.div>
    </div>
  );
}
