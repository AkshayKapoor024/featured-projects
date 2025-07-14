import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Signup from "../components/Auth/Signup"
export default function SignupForm(){
    return(<div className="flex flex-col min-h-screen">
        <Navbar />
        <Signup />
        <Footer />
    </div>
    )
}