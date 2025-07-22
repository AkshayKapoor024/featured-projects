import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
export function PopUpForm({ statevar, user, handlestate, eventid , isRegistered , setRegistered}) {
    // 🧠 Controlled form data
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        info: '',
        status: '' // Can be 'Interested', 'Sure', or 'Not Sure'
    });
    useEffect(() => {
        if (user?.email && user?.username) {
            setFormData(prev => ({
                ...prev,
                email: user.email,
                username: user.username
            }));
        }
    }, [user])
    // 📥 Handles all input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 🚀 Handle form submission
    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const endpoint = `https://schedulo-server-pfcu.onrender.com/events/${eventid}/rsvp/${user._id}`;
    console.log(`At submit button ${isRegistered}`)
    if (!isRegistered) {
        console.log(formData)
      await axios.post(endpoint, formData);
      toast.success('Registered for event Successfully!!');
    } else {
      await axios.put(endpoint, formData);
      toast.success('Updated event details Successfully!!');
    }

    handlestate(false);
    setRegistered(true);
  } catch (error) {
    console.error('RSVP error:', error);
    toast.error('Failed to register for the event!');
    handlestate(false);
  }
};
    const handleClick = () => {
        handlestate(false)
    }
    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-2 w-full h-full">
            {/* Email */}
            <div className=" 2xl:w-full 2xl:h-32 flex flex-col items-center">
                <label
                    htmlFor="email"
                    className="h-10 w-full text-xl lg:h-20 lg:text-3xl 2xl:w-[700px] 2xl:text-left flex p-4 2xl:text-2xl font-semibold items-center"
                >
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    placeholder="Please provide your email"
                    required
                    onChange={handleChange}
                    className="min-w-[300px] md:w-[550px] lg:h-16 lg:w-[800px] xl:w-[1050px] lg:text-xl 2xl:w-[700px] 2xl:h-16 ring-1 ring-gray-500 rounded-md p-2"
                />
            </div>

            {/* Username */}
            <div className="w-full 2xl:h-32 flex flex-col items-center">
                <label
                    htmlFor="username"
                    className="h-10 w-full text-xl lg:h-20 lg:text-3xl 2xl:w-[700px] flex p-2 2xl:text-2xl font-semibold items-center"
                >
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    placeholder="Ex- Dean Ambrose"
                    required
                    onChange={handleChange}
                    className="min-w-[300px] md:w-[550px] lg:w-[800px]  lg:h-16 lg:text-xl xl:w-[1050px] 2xl:w-[700px] 2xl:h-16 ring-1 ring-gray-500 rounded-md p-2"
                />
            </div>

            {/* Additional Info */}
            <div className="w-full 2xl:h-32 flex flex-col items-center">
                <label
                    htmlFor="info"
                    className="h-10 w-full text-xl lg:h-20 lg:text-3xl 2xl:w-[700px] flex p-2 2xl:text-2xl font-semibold items-center"
                >
                    Additional Info
                </label>
                <input
                    type="text"
                    id="info"
                    name="info"
                    value={formData.info}
                    placeholder="Ex- 100+ people gathering etc. (Optional)"
                    onChange={handleChange}
                    className="min-w-[300px] md:w-[550px] lg:w-[800px] lg:h-16 lg:text-xl xl:w-[1050px] 2xl:w-[700px] 2xl:h-16 ring-1 ring-gray-500 rounded-md p-2"
                />
            </div>

            {/* Status Selection */}
            <h1 className=" text-center text-xl p-3 2xl:p-0 2xl:text-left 2xl:w-[700px] 2xl:h-16 2xl:text-2xl font-bold flex items-end text-gray-900">Let Us Know You’re Coming (or thinking about it 👀)</h1>
            <div className=" 2xl:w-full flex justify-center items-center mx-2 gap-5 2xl:gap-12 2xl:h-32">
                {['Interested 😎', 'Sure 👌', 'NotSure 🙂‍↕️'].map((labelText, idx) => {
                    const id = `status${idx + 1}`;
                    const value = labelText.split(' ')[0]; // Extract value without emoji

                    return (
                        <div key={id} className="flex flex-col items-center">
                            <input
                                type="radio"
                                id={id}
                                name="status"
                                value={value}
                                className="peer hidden"
                                onChange={handleChange}
                                checked={formData.status === value}
                            />
                            <label
                                htmlFor={id}
                                className="w-[100px] md:w-[150px] lg:w-[250px] xl:w-[300px] lg:text-2xl lg:mb-5 2xl:w-[200px] h-12 lg:h-20 2xl:h-16 flex justify-center items-center ring-2 ring-indigo-600 rounded-3xl font-semibold cursor-pointer
                  text-base 2xl:text-2xl text-center
                  peer-checked:bg-indigo-600 peer-checked:text-white transition duration-200"
                            >
                                {labelText}
                            </label>
                        </div>
                    );
                })}
            </div>

            {/* Submit Button */}
            <div className="  h-20 2xl:w-full 2xl:h-32 flex justify-center items-center gap-5 lg:mb-5">
                <button type="button" className="w-[100px] md:w-64 md:text-lg lg:text-2xl lg:w-[300px] xl:w-[450px] lg:h-20 btn btn-error 2xl:w-[300px]" onClick={handleClick}>
                    Cancel
                </button>
                <button type="submit" className="w-[100px] md:w-64 md:text-lg lg:text-2xl lg:w-[300px] xl:w-[450px] lg:h-20 btn btn-success 2xl:w-[300px]">
                    {isRegistered==false?'Confirm':'Update'}
                </button>
            </div>
        </form>
    );
}
