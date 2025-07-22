import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [login, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://schedulo-server-pfcu.onrender.com/login", login);
      toast.success("User Login successful!!");
      navigate("/");
    } catch (err) {
      const message = err.response?.data || "Something went wrong. Please try again.";
      toast.error(`Error: ${message}`);
    }
  };

  return (
    <div
      className=" flex-1 flex flex-col justify-center items-center bg-gray-100 "
      style={{ fontFamily: "Montserrat,sans-serif" }}
    >
      <div className=" 2xl:w-[900px] 2xl:h-24 flex justify-center items-center m-2" >
        <a href="http://localhost:3000/auth/google" className="">
          <button className="text-xl md:w-[650px] btn btn-outline flex items-center justify-center gap-4 h-16 2xl:w-[700px] px-6 2xl:text-3xl font-bold text-gray-600 hover:text-gray-100">
            <span className=" inline-block w-16 h-[50px]">
              {/* Google SVG icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="w-full h-full" fill="none">
                <defs>
                  <radialGradient id="prefix__b" cx="1.479" cy="12.788" fx="1.479" fy="12.788" r="9.655" gradientTransform="matrix(.8032 0 0 1.0842 2.459 -.293)" gradientUnits="userSpaceOnUse">
                    <stop offset=".368" stopColor="#ffcf09" />
                    <stop offset=".718" stopColor="#ffcf09" stopOpacity=".7" />
                    <stop offset="1" stopColor="#ffcf09" stopOpacity="0" />
                  </radialGradient>
                  <radialGradient id="prefix__c" cx="14.295" cy="23.291" fx="14.295" fy="23.291" r="11.878" gradientTransform="matrix(1.3272 0 0 1.0073 -3.434 -.672)" gradientUnits="userSpaceOnUse">
                    <stop offset=".383" stopColor="#34a853" />
                    <stop offset=".706" stopColor="#34a853" stopOpacity=".7" />
                    <stop offset="1" stopColor="#34a853" stopOpacity="0" />
                  </radialGradient>
                  <linearGradient id="prefix__d" x1="23.558" y1="6.286" x2="12.148" y2="20.299" gradientUnits="userSpaceOnUse">
                    <stop offset=".671" stopColor="#4285f4" />
                    <stop offset=".885" stopColor="#4285f4" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="prefix__a">
                    <path d="M22.36 10H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53h-.013l.013-.01c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09c.87-2.6 3.3-4.53 6.16-4.53 1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07 1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93v.01C3.99 20.53 7.7 23 12 23c2.97 0 5.46-.98 7.28-2.66 2.08-1.92 3.28-4.74 3.28-8.09 0-.78-.07-1.53-.2-2.25z" fill="none" />
                  </clipPath>
                </defs>
                <path d="M22.36 10H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53h-.013l.013-.01c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09c.87-2.6 3.3-4.53 6.16-4.53 1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07 1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93v.01C3.99 20.53 7.7 23 12 23c2.97 0 5.46-.98 7.28-2.66 2.08-1.92 3.28-4.74 3.28-8.09 0-.78-.07-1.53-.2-2.25z" fill="#fc4c53" />
                <g clipPath="url(#prefix__a)">
                  <ellipse cx="3.646" cy="13.572" rx="7.755" ry="10.469" fill="url(#prefix__b)" />
                  <ellipse cx="15.538" cy="22.789" rx="15.765" ry="11.965" transform="rotate(-7.12 15.539 22.789)" fill="url(#prefix__c)" />
                  <path fill="url(#prefix__d)" d="M11.105 8.28l.491 5.596.623 3.747 7.362 6.848 8.607-15.897-17.083-.294z" />
                </g>
              </svg>
            </span>
            Continue with Google
          </button>
        </a>
      </div>
      <form
        className="m-5 xl:m-5 lg:m-2 bg-white min-w-[325px] h-[400px] md:w-[700px] lg:w-[900px] lg:h-[600px] text-gray-900 2xl:w-[900px] 2xl:h-[500px] shadow-2xl flex flex-col "
        onSubmit={handleSubmit}
      >
        <h1 className="min-h-20 text-3xl shadow-md lg:h-28 lg:text-[50px] 2xl:h-24 flex justify-center items-center 2xl:text-[50px] font-bold bg-indigo-500 text-gray-100">
          Login to Schedulo
        </h1>
        <div className="flex flex-col">

          {/* Email */}
          <div className=" w-full 2xl:h-32 flex flex-col justify-center items-center ">
            <label
              htmlFor="email"
              className=" h-10 w-full text-xl lg:h-20 lg:text-3xl 2xl:w-[700px] 2xl:text-left flex p-4 2xl:text-2xl font-semibold items-center"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={login.email}
              placeholder="Please provide your email"
              required
              onChange={handleChange}
              className="min-w-[300px]  md:w-[650px] lg:h-16 lg:w-[850px] lg:text-2xl 2xl:w-[700px] 2xl:h-16 ring-1 ring-gray-500 rounded-md p-2 validator"
            />
            <div className="validator-hint text-sm text-red-500 mt-1">
              Enter a valid email address
            </div>
          </div>

          {/* Password */}
          <div className="w-full 2xl:h-32 flex flex-col justify-center items-center">
            <label
              htmlFor="password"
              className="h-10 w-full text-xl  lg:h-20 lg:text-3xl 2xl:w-[700px] flex p-2 2xl:text-2xl font-semibold justify-start items-center"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={login.password}
              placeholder="Enter your password here"
              required
              onChange={handleChange}
              className="min-w-[300px] md:w-[650px] lg:w-[850px] lg:h-16 lg:text-2xl 2xl:w-[700px] 2xl:h-16 ring-1 ring-gray-500 rounded-md p-2 validator"
            />
            <div className="validator-hint text-sm text-red-500 mt-1">
              Please enter a valid password
            </div>
          </div>

          {/* Submit Button */}
          <div className="h-20 w-full 2xl:h-32 flex flex-col justify-center items-center ">
            <button type="submit" className="mt-4 w-[300px] md:w-96 md:text-lg lg:text-2xl lg:w-[500px] lg:h-20 btn btn-primary 2xl:w-[600px] ">
              Submit
            </button>
            <h1 className="2xl:text-xl m-2">Don't have an account ? <a href="/signup" className="text-blue-500 underline">Sign-Up</a></h1>
          </div>
        </div>
      </form>
    </div>
  );
}
