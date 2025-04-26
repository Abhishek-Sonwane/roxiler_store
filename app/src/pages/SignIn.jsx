import React from "react";
import { useForm } from "react-hook-form";
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigateTo = useNavigate();
  const { setIsLoggedIn, setUserData } = useStateContext();
  const { register, handleSubmit } = useForm();

  const handleSignIn = async (data) => {
    try {
      const response = await axios.post("http://localhost:8080/log-in", data);
      if (response && response.data) {
        // console.log(response.data);

        localStorage.setItem("token", response.data.token);

        setUserData(response.data.user);
        setIsLoggedIn(true);
        navigateTo("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(userData);

  return (
    <div className="w-1/2 mx-auto min-h-[80vh] flex items-center justify-center ">
      <div className="">
        <form
          className="w-xl flex flex-col gap-4 font-outfit text-black font-normal text-lg"
          onSubmit={handleSubmit(handleSignIn)}
        >
          <input
            type="email"
            name="email"
            {...register("email", { required: "Email is required" })}
            placeholder="Email"
            className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
          />
          <input
            type="password"
            name="password"
            {...register("password", { required: "Password is required" })}
            placeholder="Password"
            className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
          />

          <div className="w-full flex flex-col items-center gap-2">
            <button
              className="w-full bg-blue-500 h-12 rounded-full font-outfit text-white hover:text-black cursor-pointer font font-medium text-lg"
              type="submit"
            >
              Sign In
            </button>
            <a href="/sign-up">
              <h2 className="hover:text-blue-600 cursor-pointer hover:underline font-outfit text-purple-500 text-base">
                Create an Account
              </h2>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
