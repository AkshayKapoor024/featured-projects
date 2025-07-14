import illustration from '../../assets/TheLittleThingsWorking.png'
import { Link } from 'react-router-dom'
export default function EmptyList({path}) {
    return (
        <div className="2xl:h-[600px] flex flex-col gap-5 relative overflow-hidden mt-2">
            <h1 className="text-3xl flex justify-center items-center font-semibold text-gray-600 z-10">
                Oops !! Your event has no registered users.
            </h1>
            <Link to={path} className=" flex justify-center items-center text-blue-600 underline text-lg">Go back to event page?</Link>
            <div className="flex justify-center items-center w-full overflow-hidden flex-1">
                <img
                    src={illustration}
                    alt="No Image available"
                    className="h-[500px] scale-125 translate-y-[-60px] translate-x-[20px] object-cover"
                />
            </div>
        </div>
    )
}