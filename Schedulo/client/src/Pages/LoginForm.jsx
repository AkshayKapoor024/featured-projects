import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import Login from "../components/Auth/Login"
export default function LoginForm(){
    return(<div className="flex flex-col min-h-screen">
        <Navbar />
        <Login />
        <Footer />
    </div>
    )
}