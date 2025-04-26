import React from "react";
import logo from "/logo.svg";
import { CiSearch } from "react-icons/ci";
import { FaSignOutAlt } from "react-icons/fa";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { useState } from "react";
import { useStateContext } from "../context";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, userData, setUserData, setSearchQuery } =
    useStateContext();
  const [userProfileOpen, setUserProfileOpen] = useState(false);

  const navigateTo = useNavigate();

  // console.log(userData);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserData(null);
    setIsLoggedIn(false);
    navigateTo("/");
  };

  return (
    <div className="w-full px-10 xl:px-20 grid grid-cols-3 bg-gray-300 min-h-20 justify-center items-center">
      <div className="flex">
        <a href="/" className="">
          <img src={logo} alt="image" />
        </a>
      </div>
      <div className="relative">
        <input
          type="text"
          placeholder="Search Store"
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          className="w-full font-outfit font-light text-lg text-gray-400 border rounded-full px-4 lg:px-8 bg-white min-h-12 focus:shadow shadow-black ring-0 focus:outline-none "
        />
        <CiSearch className="w-7 h-7 absolute top-[20%] right-4 lg:right-8 cursor-pointer " />
      </div>
      <div className="flex items-center justify-end">
        {isLoggedIn && userData ? (
          <div className="flex gap-4 ">
            <a
              href="/profile"
              className="bg-black p-3 rounded-full relative cursor-pointer"
              onClick={() => setUserProfileOpen(!userProfileOpen)}
            >
              <FaRegUser className="w-7 h-7 text-purple-500" />
            </a>
            {userData?.role && userData?.role === "user" ? (
              ""
            ) : (
              <a
                href="/dashboard"
                className="bg-black p-3 rounded-full relative cursor-pointer"
              >
                <MdOutlineSpaceDashboard className="w-7 h-7 text-purple-500" />
              </a>
            )}
            <div
              className="bg-black p-3 rounded-full cursor-pointer"
              onClick={() => handleLogout()}
            >
              <FaSignOutAlt className="w-7 h-7 text-purple-500" />
            </div>
          </div>
        ) : (
          <div className="flex gap-6">
            <a href="/sign-in">
              <button className="font-outfit font-light text-lg text-black bg-purple-500 rounded-xl p-3 px-8 cursor-pointer hover:shadow shadow-black ">
                Sign In
              </button>
            </a>
            <a href="/sign-up">
              <button className="font-outfit font-light text-lg text-black bg-purple-500 rounded-xl p-3 px-8 cursor-pointer hover:shadow shadow-black ">
                Sign Up
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
