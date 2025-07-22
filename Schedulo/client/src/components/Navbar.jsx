import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [input , SetInput] = useState('')
  const navigate = useNavigate();
  const [user,setUser] = useState({})
  useEffect(() => {
    axios
      .get('https://schedulo-server-pfcu.onrender.com/isAuthenticated', { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.email) {
          setIsAuthenticated(true);
          setUser(res.data)
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);
  const handleLogout = async () => {
    try {
      await axios.get('https://schedulo-server-pfcu.onrender.com/logout', { withCredentials: true });
      setIsAuthenticated(false);
      toast.success('User logged out!!');
      navigate('/temp-route');
      setTimeout(() => navigate('/'), 0);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  const handleInputChange = (e)=>{
    const field = e.target.name
    const value = e.target.value
    SetInput(value)
  }
  const handleInput = async ()=>{
      navigate(`/api/searchResults?q=${input}`,{state:input})
  }
  return (
    <div className="relative z-30">
      <div
        className="h-20 flex gap-x-5 shadow-md bg-indigo-400 text-gray-100 px-4"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        <Link
          to="/"
          className="text-2xl flex items-center justify-center w-52 2xl:text-4xl font-semibold gap-2 px-5"
        >
          <img width="48" height="48" src="https://img.icons8.com/external-others-phat-plus/64/external-calender-cyber-monday-color-line-others-phat-plus.png" alt="external-calender-cyber-monday-color-line-others-phat-plus"/>Schedulo
        </Link>

        <div className="hidden sm:flex items-center justify-start flex-1 gap-x-3 text-l font-medium">
          <Link to="/events" className="h-20 w-28 flex justify-center items-center">
            Create Event
          </Link>
          <Link to="/myFeedbacks" className="h-20 w-32 flex justify-center items-center" >
            Your feedback
          </Link>
          <div className='ml-10 bg-gray-100 w-[50vw] h-[6vh] rounded-2xl flex '>
            <input className='text-gray-400 w-[90%] rounded-l-2xl flex items-center p-5 text-base text-left 'placeholder='Search something here (Events , specific locations , users , fields etc. and many more)' value={input} onChange={handleInputChange}/>
            <div className='bg-indigo-600 w-[10%] rounded-r-2xl flex justify-center items-center hover:cursor-pointer btn h-full' onClick={handleInput}><img width="48" height="48" src="https://img.icons8.com/color/48/search--v1.png" alt="search--v1"/></div>
          </div>
        </div>

        {/* Desktop Right Nav */}
        <div className="hidden sm:flex items-center justify-center w-72 gap-x-4 text-xl font-semibold">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/userDashboard')}
              className="h-16 w-16 rounded-full bg-white text-indigo-600 flex justify-center items-center font-bold shadow-md hover:scale-105 transition"
            >
              <img src={user.profilepic} alt="No Image Available" className=' object-cover h-16 w-16 rounded-full'/>
            </button>
          ) : (
            <>
              <Link to="/login" className="h-20 w-28 flex justify-center items-center">
                Login
              </Link>
              <Link to="/signup" className="h-20 w-28 flex justify-center items-center">
                Sign-Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="sm:hidden flex items-center ml-auto pr-4 text-2xl">
          <button onClick={() => setIsOpen(!isOpen)}>
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="sm:hidden absolute right-4 top-20 bg-white text-gray-900 shadow-lg rounded-md z-10 w-48 transition-all duration-300 overflow-hidden font-semibold">
          <Link
            to="/events"
            className="block px-4 py-2 hover:bg-indigo-200 transition"
            onClick={() => setIsOpen(false)}
          >
            Create Event
          </Link>
          <Link
            to="/myFeedbacks"
            className="block px-4 py-2 hover:bg-indigo-200 transition"
            onClick={() => setIsOpen(false)}
          >
            Your feedback
          </Link>
          {isAuthenticated ? (
            <Link
              to="/userDashboard"
              className="block px-4 py-2 hover:bg-indigo-200 transition"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="block px-4 py-2 hover:bg-indigo-200 transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="block px-4 py-2 hover:bg-indigo-200 transition"
                onClick={() => setIsOpen(false)}
              >
                Sign-Up
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
