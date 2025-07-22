import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import {ToastContainer} from 'react-toastify'
import Homepage from './Pages/Homepage';
import AddEvent from './Pages/addEvent';
import SingleEvent from './Pages/SingleEvent'
import UpdateEvent from './Pages/UpdateEvent';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
import SignupForm from './Pages/SignupForm';
import LoginForm from './Pages/LoginForm'
import AttendeeList from './Pages/AttendeeList';
import User from './Pages/User';
import UserFeedback from './Pages/UserFeedbacks';
import SearchPage from './Pages/SearchPage';
//Allowing requests to contain session related data via connect.sid to be sent to the backend 
axios.defaults.withCredentials = true;
function App() {
  return(
    <BrowserRouter>
      <ToastContainer position='top-right' autoClose={3000}/>
    <Routes>
      <Route path='/' element={<Homepage/>}></Route>
      <Route path='/events' element={<AddEvent/>}/>
      <Route path='/events/:id' element={<SingleEvent/>}></Route>
      <Route path='/events/:id/updateDetails' element={<UpdateEvent/>}></Route>
      <Route path='/signup' element={<SignupForm/>}></Route>
      <Route path='/login' element={<LoginForm/>}></Route>
      <Route path='/events/:id/attendees' element={<AttendeeList/>}></Route>
      <Route path="/userDashboard" element={<User/>}/>
      <Route path='/myFeedbacks' element={<UserFeedback/>}></Route>
      <Route path ='/api/searchResults' element={<SearchPage/>}></Route>
    </Routes>
    </BrowserRouter>
  );

}

export default App
