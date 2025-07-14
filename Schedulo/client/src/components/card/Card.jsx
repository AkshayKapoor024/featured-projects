import { Link } from "react-router-dom"
export default function Card({ object }) {
    console.log(object.description)
    const SinglePath = `/events/${object._id}`
    return (
        <div className=" w-[375px] h-[525px] my-5 container 2xl:h-[520px] 2xl:w-[800px] shadow-xl flex justify-center">
            <div className="w-[320px] 2xl:w-full h-[300px]"> <img
                src={object.banner}
                alt="No Image Available"
                className="w-full h-full object-cover"
            />
                <div className=" p-2 text-xl font-semibold text-gray-900">{object.title}</div>
                <div className="text-sm font-medium flex gap-x-2">
                    <span className=" w-24 flex items-center justify-center h-10 rounded-2xl text-gray-600">{object.type}</span>
                    <span className=" w-24 flex items-center justify-center h-10 rounded-2xl text-gray-600">{object.date.slice(4)}</span>
                    <span className=" w-24 flex items-center justify-center h-10 rounded-2xl text-gray-600">{object.time}</span>
                </div>
                <div className=" p-2 text-sm font-medium text-gray-600 h-16">{object.description}</div>
                <div className=" p-3 text-md font-medium font flex justify-between">
                    <div className=" flex 2xl:gap-10 text-indigo-600">
                  { (object.enums || []).map((element, index) => (
                        <div className="m-1 w-28 bg-blue-100 text-sm 2xl:w-32 2xl:h-10 flex justify-center items-center rounded-2xl shadow-md " key={index}>
                            {element}
                        </div>
                        ))
                    }
                    </div>
                    <Link to={SinglePath} className="h-10 min-w-20 text-[10px] flex justify-center items-center bg-blue-600 2xl:w-32 2xl:h-10  rounded-3xl text-gray-100 shadow-md 2xl:text-base">View Details</Link>
                </div>
            </div>
        </div>
    )
}