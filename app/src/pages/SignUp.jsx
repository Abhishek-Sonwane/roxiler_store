import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStateContext } from "../context";

const SignUp = () => {
  const { setUserData, setIsLoggedIn } = useStateContext();
  const { register, handleSubmit } = useForm();

  const navigateTo = useNavigate();

  const handleSignUp = async (data) => {
    // console.log(data);
    data.role = "user";

    try {
      const response = await axios.post(
        "http://localhost:8080/create-account",
        data
      );
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
  return (
    <div className="w-1/2 mx-auto min-h-[80vh] flex items-center justify-center ">
      <div className="">
        <form
          className="w-xl flex flex-col gap-4 font-outfit text-black font-normal text-lg"
          onSubmit={handleSubmit(handleSignUp)}
        >
          <input
            type="text"
            name="name"
            {...register("name")}
            placeholder="Name"
            minLength={20}
            maxLength={60}
            className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
          />
          <input
            type="text"
            name="address"
            {...register("address")}
            maxLength={400}
            placeholder="Address"
            className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
          />
          <input
            type="email"
            name="email"
            {...register("email")}
            placeholder="Email"
            className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
          />
          <input
            type="password"
            name="password"
            {...register("password")}
            placeholder="Password"
            className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
          />

          <div className="w-full flex flex-col items-center gap-2">
            <button
              className="w-full bg-blue-500 h-12 rounded-full font-outfit text-white hover:text-black cursor-pointer font font-medium text-lg"
              type="submit"
            >
              Sign Up
            </button>

            <h2 className=" font-outfit font-light  text-base">
              Already have an account?{" "}
              <a
                href="/sign-in"
                className="hover:text-blue-600 cursor-pointer hover:underline text-purple-500"
              >
                Log In
              </a>
            </h2>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
