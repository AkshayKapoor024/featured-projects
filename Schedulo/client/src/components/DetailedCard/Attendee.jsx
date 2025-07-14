import { Link, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import EmptyList from "./EmptyList"
import List from "./List"
import illustration from "../../assets/HumaaansResearch.png"
export default function Attendee({ title }) {
    const { id } = useParams()
    const [list, setList] = useState([{}])
    const path = `/events/${id}`
    useEffect(() => {
        const fillList = async () => {
            try {
                let response = await axios.get(`http://localhost:3000/events/${id}/attendees`)
                setList(response.data)
            } catch (error) {
                toast.error(`Error: ${error}`)
            }
        }
        fillList()
    }, [id])
    useEffect(()=>{
        console.log(list)
    })
    return <div className="flex flex-1 justify-center items-center text-gray-900 bg-gray-100" style={{ fontFamily: 'Montserrat,sans-serif' }}>
        <div className="flex-1 md:min-h-[750px] lg:min-h-[900px]  xl:min-h-[650px] flex flex-col w-[400px] md:w-[720px] 2xl:w-[1200px] 2xl:min-h-[700px] m-5 shadow-xl rounded-2xl" >
            <h1 className="h-20 p-5 flex 2xl:justify-center items-center text-xl 2xl:text-4xl font-bold shadow-sm bg-indigo-600 text-white rounded-t-2xl">Attendees for {title} event</h1>
            <div className="flex-1 flex justify-center xl:items-start">
                {list.length===0?<EmptyList path={path}/>:<List list={list} id={id} setList={setList}/>}
            </div>
            <div></div>
        </div>
        <div className="hidden xl:block 2xl:min-h-[700px] flex-1 2xl:flex flex-col m-2 rounded-2xl bg-white shadow-xl">
            <div className=" h-24 flex justify-center items-center font-semibold text-3xl text-white bg-indigo-600 rounded-t-2xl">Admin Dashboard</div>
            <div className="2xl:h-[400px]"><img src={illustration} alt="No Image Available" className="h-[400px]"/></div>
            <div className=" flex-1 flex justify-center items-center p-3 text-xl font-semibold text-gray-500">Welcome to admin dashboard , review your event attendee details here , analyze and plan for your event . You can also remove unwanted attendees from RSVP list</div>
        </div>
    </div>
}