import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RsvpList({ list, setList }) {
    const [openCard, setOpenCard] = useState(null);

    const handleClick = (index) => {
        setOpenCard((prev) => (prev === index ? null : index));
    };
    console.log(list)
    const handleRemove = async (userid,eventid) => {
        console.log(userid,eventid)
        try {
            await axios.delete(`https://schedulo-server-pfcu.onrender.com/events/${eventid}/rsvp/${userid}`);
            const newList = await axios.get(`https://schedulo-server-pfcu.onrender.com/userRsvp`);
            setList(newList.data);
            toast.success("RSVP removed successfully!");
        } catch (error) {
            toast.error("Failed to remove RSVP");
            console.error(error);
        }
    };

    const normal =
        "bg-indigo-100 opacity-100 scale-100 transition-all duration-500 ease-in-out transform origin-top flex flex-col justify-center";
    const hidden =
        "bg-indigo-100 opacity-0 scale-95 pointer-events-none max-h-0 overflow-hidden transition-all duration-500 ease-in-out transform origin-top flex flex-col justify-center";

    return (
          <div className="w-full">
            {list.map((element, index) => (
                <div key={index} className="m-2 h-[50vh]">
                    <div className="bg-indigo-50 w-full 2xl:h-16 flex rounded-xl shadow-md">
                        <button
                            className="h-full w-24 flex justify-center items-center"
                            type="button"
                            onClick={() => handleClick(index)}
                        >
                            {openCard === index ? (
                                <i className="fa-solid fa-up-long text-4xl text-indigo-600 w-full h-full flex items-center justify-center" />
                            ) : (
                                <i className="fa-solid fa-caret-down text-4xl text-indigo-600 w-full h-full flex items-center justify-center" />
                            )}
                        </button>
                        <div className="2xl:w-[1000px] rounded-xl flex p-2 justify-between">
                            <div className="2xl:w-96 flex font-bold lg:mx-2 text-gray-600 justify-center items-center text-sm md:text-base lg:text-lg xl:text-xl">
                                Username - {element.username}
                            </div>
                            <div className="2xl:w-96 flex font-bold lg:mx-2 text-gray-600 justify-center items-center text-sm md:text-base lg:text-lg xl:text-xl">
                                Registered At -{" "}
                                {element.timestamp
                                    ? element.timestamp.slice(0, 10)
                                    : "Loading..."}
                            </div>
                            <div className=" flex font-bold lg:mx-2 text-gray-600 justify-center items-center text-sm md:text-base 2xl:text-left lg:text-lg  xl:text-base">
                                Status - {element.status} 👌
                            </div>
                        </div>
                    </div>

                    <div className={openCard === index ? normal : hidden}>
                        <div className="py-4 px-2">
                            <div className="w-full flex flex-col lg:flex-row gap-4 items-start justify-center">
                                <div className="text-2xl min-w-96 font-bold text-gray-600">
                                    Additional Info:
                                </div>
                                <div className="flex-1 text-xl font-semibold text-gray-600 break-words">
                                    {element.info || "No extra details provided."}
                                </div>
                                <button
                                    className="btn btn-error text-base h-12 m-2 self-center lg:self-auto"
                                    onClick={() => handleRemove(element.userid,element.eventid)}
                                >
                                    Withdraw Event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
