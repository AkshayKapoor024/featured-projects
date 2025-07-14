import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Attendee from "../components/DetailedCard/Attendee"

export default function AttendeeList(){
    return <div className="flex flex-col min-h-screen">
        <Navbar></Navbar>
        <Attendee />
        <Footer></Footer>
    </div>
}