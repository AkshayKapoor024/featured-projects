import '../../../public/rating.css'

import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { PopUpForm } from "./PopUpForm";
import CountdownTimer from "./Countdown";
import CountUp from "./Animation";
import { useEffect } from "react";
import { set } from "mongoose";
import Rating from './GiveRating';
export default function DetailedCard({ obj, setEventData }) {
    const navigate = useNavigate()
    console.log(obj.date + " " + obj.time)
    const handleUpdate = (e) => {
        const checkAuth = async () => {
            const response = await axios.get('http://localhost:3000/isAuthenticated')
            let userid = response.data._id
            let ownerid = obj.owner.toString()
            if (userid === ownerid) {
                const path = `/events/${obj._id}/updateDetails`
                navigate(path)
            } else {
                toast.error(`Error : You are not authorized to modify this document`)
                navigate(`/events/${obj._id}`)
            }
        }
        checkAuth()
    }
    const [isRegistered, setRegistered] = useState(false)

    const [clicked, setClick] = useState(false)
    const [user, setUser] = useState({ email: "", username: "", _id: "" })
    const handleDelete = async (e) => {
        const checkAuth = async () => {
            const resp = await axios.get('http://localhost:3000/isAuthenticated')
            let userid = resp.data._id
            let ownerid = obj.owner.toString()
            if (userid === ownerid) {
                const path = `http://localhost:3000/events/${obj._id}`
                try {
                    const response = await axios.delete(path)
                    console.log('Event deleted successfully!!')
                    toast.success("Success :Event Deleted Successfully!!")
                    navigate('/')
                } catch (err) {
                    const message =
                        err.response?.data || "Something went wrong. Please try again.";

                    toast.error(`Error: ${message}`);

                }
            } else {
                toast.error(`Error : You are not authorized to modify this document`)
                navigate(`/events/${obj._id}`)
            }
        }
        checkAuth()
    }
    const handleRegister = (e) => {
        let userdetails = undefined
        const getdata = async () => {
            userdetails = await axios.get('http://localhost:3000/isAuthenticated')
            setUser((prev) => ({ email: userdetails.data.email, username: userdetails.data.username, _id: userdetails.data._id }))
        }
        getdata()
        setClick(true)
    }
    const handleAttendee = (e) => {
        const checkAuth = async () => {
            const resp = await axios.get('http://localhost:3000/isAuthenticated')
            let userid = resp.data._id
            let ownerid = obj.owner.toString()
            if (userid === ownerid) {
                toast.success('Admin dashboard accessed')
                navigate(`/events/${obj._id}/attendees`)
            } else {
                toast.error('You are not authorized to access this section!')
            }
        }
        checkAuth()
    }
    const withdrawRegisteration = async (e) => {
        try {
            let userdetails = undefined
            userdetails = await axios.get('http://localhost:3000/isAuthenticated')
            setUser((prev) => ({ email: userdetails.data.email, username: userdetails.data.username, _id: userdetails.data._id }))
            await axios.delete(`http://localhost:3000/events/${obj._id}/rsvp/${userdetails.data._id}`)
            toast.error(`Withdraw participation successful`)
            setRegistered(false)
        } catch (error) {
            toast.error(`Erro: ${error.message}`)
        }
    }
    const handleDeleteReview = (reviewid, authorid) => {
        try {
            const deleteReview = async () => {
                let ourUser = await axios.get(`http://localhost:3000/isAuthenticated`)
                console.log(ourUser)
                if (ourUser.data._id.toString() === authorid.toString()) {
                    await axios.delete(`http://localhost:3000/events/${obj._id}/deleteReview/${reviewid}`)
                    let response = await axios.get(`http://localhost:3000/events/${obj._id}`)
                    setEventData(response.data)
                    toast.success(`review Deleted successfully`)
                } else {
                    toast.error('You are not authorized to delete this review!')
                    return
                }
            }
            deleteReview()
        }catch(err){
            toast.error(`Error : ${error.message}`)
        }
    }
    useEffect(() => {
  const findRegistered = async () => {
    try {
      const { data: userdetails } = await axios.get('http://localhost:3000/isAuthenticated');

      setUser({
        email: userdetails.email,
        username: userdetails.username,
        _id: userdetails._id,
      });

      // ✅ Check if user's ID is present in any RSVP entry
      const isUserRegistered = obj.rsvps?.some(rsvp => rsvp.userid === userdetails._id);
      setRegistered(isUserRegistered);
    } catch (err) {
      console.error('Registration check failed:', err);
      setRegistered(false);
    }
  };

  findRegistered();
}, [obj._id]);
    return (
        <div className="">
            <div className="z-20 relative flex-1 bg-gray-100 flex justify-center items-center">
                <div className=" justify-center w-auto  shadow-xl text-gray-600 2xl:w-[1400px] 2xl:min-h-[1400px] m-5">
                    <div className=" h-[550px]">
                        <img src={obj.banner} alt="No Image Available" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-xl h-20 flex justify-between sm:text-3xl items-center p-5 2xl:text-4xl font-bold text-gray-900">
                        <div>{obj.title}</div>
                        <CountdownTimer eventTime={obj.time} eventDate={obj.date} ></CountdownTimer>
                    </div>
                    <div className="h-20 flex justify-evenly items-center ">
                        <div className=" text-sm h-32 sm:text-lg 2xl:w-54 2xl:h-16 2xl:text-xl font-semibold flex justify-center items-center"><i className="fa-solid fa-calendar-days 2xl:text-4xl text-indigo-600 m-5" ></i>{obj.date}</div>
                        <div className=" text-sm h-32 sm:text-lg 2xl:w-54 2xl:h-16 2xl:text-xl font-semibold flex justify-center items-center"><i className="fa-solid fa-clock 2xl:text-4xl text-indigo-600 m-5" ></i>{obj.time}</div>
                        <div className="text-sm sm:text-lg 2xl:w-96 h-16 2xl:text-xl font-semibold flex justify-center items-center"><i className="fa-solid fa-location-dot 2xl:text-4xl text-indigo-600 m-5" ></i>{obj.venue}</div>
                    </div>
                    <div className="text-2xl h-16 2xl:h-20 sm:text-3xl flex justify-start items-center p-5 2xl:text-3xl font-bold text-gray-900">Description</div>
                    <div className=" text-md h-auto sm:text-lg 2xl:min-h-30 2xl:h-auto flex justify-start items-start p-5 font-medium 2xl:text-lg">{obj.description}</div>
                    <div className="flex flex-col justify-start 2xl:min-h-[500px] items-center 2xl:items-start 2xl:flex-row 2xl:h-74">
                        <div className=" w-[350px] sm:w-full 2xl:min-w-[700px] 2xl:h-[500px] flex-col justify-evenly">
                            <div className="flex flex-col 2xl:flex-row justify-center items-center">

                                <div className=" w-full 2xl:w-auto flex flex-col items-center justify-center">
                                    <div className="text-xl h-16 sm:text-3xl flex justify-start items-center p-2 2xl:text-2xl font-semibold underline text-gray-600">Host of the event</div>
                                    <div className="text-base font-medium sm:text-xl"><i className="text-indigo-600 fa-solid fa-user-tie text-3xl m-3"></i>{obj.host}</div>
                                </div>
                                <div className="flex flex-col items-center">

                                    <div className="underline text-lg h-16 sm:text-2xl flex justify-start items-center p-5 2xl:text-2xl font-semibold text-gray-600">Co-Host(s) of the event</div>
                                    {(obj?.cohosts?.length > 0) ? (
                                        obj.cohosts.map((elem, idx) => (
                                            <div key={idx} className="text-lg font-medium">
                                                <i className="text-indigo-600 fa-solid fa-user-tie text-3xl m-3"></i>
                                                {elem}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-lg font-medium text-gray-500 italic">
                                            This event has no co-hosts.
                                        </div>
                                    )}


                                </div>
                            </div>
                            <div className=" flex flex-col justify-center items-center 2xl:h-[375px]">
                                <div className="w-[300px] md:w-[400px] lg:w-[550px] 2xl:w-[600px] btn btn-l m-2 btn-success text-lg" onClick={handleUpdate}>Update Event</div>
                                <div className=" w-[300px] md:w-[400px] lg:w-[550px] 2xl:w-[600px] btn btn-l  m-2 btn-error text-lg" onClick={handleDelete}>Delete Event</div>
                                <div className="w-[300px] md:w-[400px] lg:w-[550px] 2xl:w-[600px] btn btn-l  m-2 btn-info text-lg" onClick={handleAttendee}>See Attendees</div>
                                <div className="w-full flex-1 2xl:flex">
                                    <div className=" 2xl:w-88">
                                        <h1 className="text-xl md:text-2xl h-12 2xl:text-2xl flex justify-center items-center font-bold">Users Interested</h1>
                                        <div className='flex justify-center items-center gap-2 text-2xl font-semibold'>
                                        <CountUp target={100} />People
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <h1 className="h-12 text-xl md:text-2xl 2xl:text-2xl flex justify-center items-center font-bold">Users already registered</h1>
                                        <div className="flex justify-center items-center gap-2 text-2xl font-semibold">
                                            <CountUp target={100} />People
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-xl sm:text-3xl 2xl:min-w-[700px] h-16 p-2 2xl:text-3xl font-semibold text-center">Tags related to events</div>
                            <div className=" flex-col flex 2xl:flex-row 2xl:h-24 justify-center m-1 items-center gap-5">
                                {(obj?.enums?.length > 0) ? (
                                    obj.enums.map((elem, idx) => (
                                        <div key={idx} className="h-12 w-52 sm:w-[300px] sm:text-xl 2xl:h-16 flex justify-center items-center 2xl:w-48 rounded-4xl bg-blue-100 2xl:text-base font-medium text-blue-600">
                                            {elem}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-lg font-medium text-gray-500 italic">
                                        This event has no tags included.
                                    </div>
                                )}


                            </div>
                            <div className="flex flex-col m-3 gap-5 justify-center items-center h-32">
                                {isRegistered == false ? <div className="h-16 min-w-74 flex justify-center items-center btn btn-primary text-xl 2xl:w-[400px]" onClick={handleRegister}>Register here</div> : <div className="h-16 min-w-74 flex justify-center items-center btn btn-primary text-xl" onClick={handleRegister}>Update registeration</div>}
                                {isRegistered == true ? <div className="btn btn-error btn-wide 2xl:h-16 2xl:text-xl 2xl:w-[400px] " onClick={withdrawRegisteration}>Withdraw registeration</div> : null}
                            </div>
                        </div>
                    </div>
                    <hr className="mx-5 text-gray-950" />
                   
                        <div className="flex flex-col">
                        <Rating obj={obj} setEventData={setEventData} />
                        <hr className='stroke-gray-950 m-5' />
                        
                        {obj.reviews.length>0?<h1 className="text-xl h-16 flex justify-center items-center 2xl:text-4xl font-bold underline mt-5">Get a sneak - peek by Attendees!!</h1>:null}
                        {
                        obj.reviews.length>0?
                        <div className=" min-h-96">
                            {
                                obj.reviews.map((element) => {
                                    
                                    return (
                                        <div className="my-6 text-gray-900 min-h-40 2xl:my-2 mx-5 shadow-xl">
                                            <h1 className=" h-16 flex p-3 text-2xl font-semibold text-white bg-[#FFB300] items-center">{element.author.username}</h1>
                                            <div className="h-auto">
                                                <div className="text-3xl h-16 flex flex-col 2xl:flex-row justify-between p-5 items-center">
                                                    <p class="starability-result" data-rating={element.rating}>
                                                        Rated: 3 stars
                                                    </p>
                                                    <div className="text-base md:text-xl 2xl:text-xl font-semibold">Posted At - {element.createdAt.slice(0,10)}🥸</div>
                                                </div>
                                                <div className=" flex flex-col md:text-xl 2xl:flex-row justify-between items-center gap-5 p-5 font-semibold">
                                                    <div>{element.comment}</div>
                                                    <div className="text-base  2xl:h-16 2xl:text-xl font-semibold btn-error btn btn-wide" onClick={()=>{handleDeleteReview(element._id , element.author._id)}}>Delete review</div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                        </div>:null                                
                            }
                    </div>

                </div>
            </div>

            <div className={`transition-all duration-500 top-[1600px] left-[25px] md:left-[90px] absolute 2xl:top-[800px] 2xl:left-[400px] shadow-xl z-50 ${clicked ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none '}`}
            >
                <div className="bg-white w-[375px] md:w-[600px] lg:w-[850px] xl:w-[1100px] 2xl:h-[850px] 2xl:w-[900px] text-gray-900">
                    <h1 className="text-xl h-24 md:text-3xl 2xl:text-4xl flex justify-center items-center font-bold shadow-md bg-indigo-600 text-white">
                        Would you like to join this event?
                    </h1>
                    <PopUpForm statevar={clicked} user={user} handlestate={setClick} eventid={obj._id} isRegistered={isRegistered} setRegistered={setRegistered} />
                </div>
            </div>

        </div>
    )
}