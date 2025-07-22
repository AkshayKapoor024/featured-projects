import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyList from "../DetailedCard/EmptyList";
import RsvpList from "./RsvpList";

export default function MyRsvpList({ title }) {
  const { id } = useParams();
  const [list, setList] = useState([{}]);
  const path = `/events/${id}`;

 useEffect(() => {
    const fillList = async () => {
      try {
        const response = await axios.get(`https://schedulo-server-pfcu.onrender.com/userRsvp`);
        console.log(response.data)
        setList(response.data);
      } catch (error) {
        toast.error(`Error: ${error}`);
      }
    };
    fillList();
  }, [id]);

  useEffect(() => {
    console.log(list);
  });

  return (
    <div
      className="flex justify-center items-center text-gray-900 bg-gray-100"
      style={{ fontFamily: "Montserrat,sans-serif" }}
    >
      <div className="flex flex-col bg-white 2xl:w-[950px] 2xl:min-h-[800px] shadow-xl rounded-2xl">
        <h1 className="h-20 p-5 text-4xl font-bold shadow-sm bg-indigo-600 text-white rounded-r-2xl">
          My RSVPs for {title}
        </h1>

        <div className="flex-1 max-h-[700px] overflow-y-auto w-full overflow-x-hidden">
          {list.length === 0 ? (
            <EmptyList path={path} />
          ) : (
            <RsvpList list={list} setList={setList} buttonLabel="Withdraw Presence" />
          )}
        </div>
      </div>
    </div>
  );
}
