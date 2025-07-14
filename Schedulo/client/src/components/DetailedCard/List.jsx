import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function List({ list, id, setList }) {
    const [openCard, setOpenCard] = useState(null);

    const handleClick = (index) => {
        setOpenCard((prev) => (prev === index ? null : index));
    };
    console.log(list)
    const handleRemove = async (userid) => {
        try {
            await axios.delete(`http://localhost:3000/events/${id}/rsvp/${userid._id}`);
            const newList = await axios.get(`http://localhost:3000/events/${id}/attendees`);
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
        <div className="m-2 2xl:w-full 2xl:min-h-[600px]">
            {list.map((element, index) => (
                <div key={index} className="m-2 flex flex-col justify-center items-center">
                    <div className="bg-indigo-50 w-[375px] md:w-[700px] lg:w-[950px] 2xl:w-full 2xl:h-16 flex justify-center items-center rounded-xl shadow-md">
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
                        <div className="2xl:w-[1000px] rounded-xl flex p-3 2xl:p-2 justify-evenly">
                            <div className="2xl:w-96 flex font-bold text-gray-600 justify-center items-center 2xl:text-xl">
                                Username - {element.username}
                            </div>
                            <div className="2xl:w-96 flex font-bold text-gray-600 justify-center items-center 2xl:text-xl">
                                Registered At -{" "}
                                {element.timestamp
                                    ? element.timestamp.slice(0, 10)
                                    : "Loading..."}
                            </div>
                            <div className="2xl:w-96 flex font-bold text-gray-600 justify-center items-center 2xl:text-xl">
                                Status - {element.status} 👌
                            </div>
                        </div>
                    </div>

                    <div className={openCard === index ? normal : hidden}>
                        <div className="py-4 px-2">
                            <div className="w-[350px] md:w-[700px] lg:w-[950px] xl:w-full 2xl:w-full flex flex-col lg:flex-row 2xl: gap-4 items-start justify-center">
                                <div className=" text-lg 2xl:text-2xl 2xl:min-w-96 font-bold text-gray-600">
                                    Additional Info:
                                </div>
                                <div className="flex-1 2xl:text-xl font-semibold text-gray-600 break-words">
                                    {element.info || "No extra details provided."}
                                </div>
                                <button
                                    className="btn btn-error text-base h-12 m-2 self-center lg:self-auto"
                                    onClick={() => handleRemove(element.userid)}
                                >
                                    Remove from event
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}