import { useEffect, useState } from "react"
import LeftPane from "./LeftPane"
import RightPane from "./RightPane"
import axios from 'axios'
import EmptyPane from "./EmptyPane"
export default function ReviewList() {
    const [user, setUser] = useState({})
    const [reviews, setReviews] = useState([])
    useEffect(() => {
        const findUser = async () => {
            const response = await axios.get('https://schedulo-server-pfcu.onrender.com/isAuthenticated')
            setUser(response.data)
        }
        findUser()

    }, [])
    useEffect(() => {
        if (user.email) {

            const findReviews = async () => {
                const response = await axios.get(`https://schedulo-server-pfcu.onrender.com/users/${user._id}/reviews/YourReviews`)
                console.log(response)
                setReviews(response.data);
            }
            findReviews()
        }
    }, [user])
    useEffect(()=>{
        console.log(reviews)
    },[reviews])
    return (
  <div
    className="2xl:flex-1
      sm:min-h-[650px]
      md:flex-1
      grid
      grid-cols-1
      md:grid-cols-5
      xl:grid-cols-5
      gap-5
      px-3
      py-5
      w-full
      overflow-hidden
    "
    style={{ fontFamily: 'Montserrat, sans-serif' }}
  >
    {/* Left Pane */}
    {reviews.length === 0 ? (
      <div className="bg-white w-full md:col-span-3 xl:cols-span-3  rounded-2xl flex flex-col gap-2 shadow-2xl min-h-[500px] xl:min-h-[800px]">
        <EmptyPane />
      </div>
    ) : (
      <div className="bg-white w-full  col-span-3 rounded-2xl flex flex-col gap-2 shadow-2xl min-h-[500px] xl:min-h-[800px] ">
        <LeftPane reviews={reviews} />
      </div>
    )}

    {/* Right Pane — hidden on smaller screens */}
    <div className="bg-white hidden md:col-span-2 md:block 2xl:block w-full xl:col-span-2 rounded-2xl shadow-2xl min-h-[500px] xl:min-h-[800px]">
      <RightPane />
    </div>
  </div>
);

}
