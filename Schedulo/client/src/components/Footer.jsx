import { Link } from "react-router-dom"
export default function Footer() {
    return (
        <div className=" z-50 h-52 bg-indigo-400 text-gray-100 2xl:h-48 flex flex-col gap-y-1" style={{ fontFamily: 'Montserrat,sans-serif' }}>
            <div className="text-2xl text-center 2xl:text-4xl font-semibold mt-2 flex justify-center items-center gap-2"><img width="48" height="48" src="https://img.icons8.com/external-others-phat-plus/48/external-calender-cyber-monday-color-line-others-phat-plus.png" alt="external-calender-cyber-monday-color-line-others-phat-plus"/>Schedulo</div>
            <div className="text-center text-l font-medium">Making Your Event Management Easy!!</div>
            <div>
                <div className="text-center mb-2">Contact Us at our socials</div>
                <div className="flex gap-x-10 justify-center items-center">
                    <div className="hover:cursor-pointer w-10 h-10 rounded-3xl flex justify-center items-center hover:bg-gray-700 "><i className="fa-brands fa-instagram text-2xl" ></i></div>
                    <div className="hover:cursor-pointer w-10 h-10 rounded-3xl flex justify-center items-center hover:bg-gray-700 "><i class="fa-brands fa-facebook text-2xl"></i></div>
                    <div className="hover:cursor-pointer w-10 h-10 rounded-3xl flex justify-center items-center hover:bg-gray-700 "><i class="fa-brands fa-x-twitter text-2xl"></i></div>
                    <div className="hover:cursor-pointer w-10 h-10 rounded-3xl flex justify-center items-center hover:bg-gray-700 "><i class="fa-brands fa-linkedin-in text-2xl"></i></div>
                </div>
            </div>
            <div className="text-sm flex gap-x-8 justify-center items-center">
                <Link to="/terms" className="hover:underline text-center">Terms And Conditions</Link>
                <Link to="/privacy" className="hover:underline text-center">Privacy Policy</Link>
                <Link to="/faq" className="hover:underline text-center">Frequently asked Questions</Link>
            </div>
        </div>
    )
}