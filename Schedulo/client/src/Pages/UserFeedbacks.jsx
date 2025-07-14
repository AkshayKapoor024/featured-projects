import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import ReviewList from "../components/Feedback/ReviewList"
import { useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
export default function UserFeedback(){
    const navigate = useNavigate()
    useEffect(()=>{
        const checkAuth = async()=>{

            const response =await axios.get('http://localhost:3000/isAuthenticated')
            if(!response.data.email){
                toast.error('Error:Signup to Acess this feature!')
                navigate('/signup')
            }
        }
        checkAuth()
    })
    return(<div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <ReviewList />
        <Footer></Footer>
    </div>
    )
}