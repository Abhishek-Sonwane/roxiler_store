import React, { useState } from "react";
import { useStateContext } from "../context";
import { IoClose } from "react-icons/io5";
import { useForm } from "react-hook-form";
import axios from "axios";

const Profile = () => {
  const { userData, storeData } = useStateContext();
  const [passwordChangeDialogBox, setPasswordChangeDialogBox] = useState(false);
  const { register, handleSubmit } = useForm();

  const handlePasswordChange = async (data) => {
    data.id = userData.id;
    // console.log(data);
    try {
      const response = await axios.put(
        "http://localhost:8080/update-password",
        data
      );
      if (response) {
        // console.log(response.data);
        setPasswordChangeDialogBox(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-1/2 min-h-[80vh] bg-purple-300 mx-auto flex items-center justify-center">
      <div className="min-w-[520px]  bg-black rounded-xl flex flex-col gap-6 p-6">
        <div className="grid grid-cols-2 font-outfit font-medium text-purple-200 text-lg gap-4 ">
          <div className="ml-auto flex flex-col gap-4">
            <div>
              <h1 className="flex justify-between">
                Name <span className="ml-4">:</span>{" "}
              </h1>
            </div>
            <div>
              <h1 className="flex justify-between">
                Address <span className="ml-4">:</span>{" "}
              </h1>
            </div>
            <div>
              <h1 className="flex justify-between">
                Email <span className="ml-4">:</span>{" "}
              </h1>
            </div>
            <div>
              <h1 className="flex justify-between">
                Role <span className="ml-4">:</span>{" "}
              </h1>
            </div>
            {storeData?.avg_rating && (
              <>
                <div>
                  <h1 className="flex justify-between">
                    Store Name <span className="ml-4">:</span>{" "}
                  </h1>
                </div>
                <div>
                  <h1 className="flex justify-between">
                    Store Average Rating <span className="ml-4">:</span>{" "}
                  </h1>
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <div className="">
              <h2>{userData?.name}</h2>
            </div>
            <div className="">
              <h2>{userData?.address}</h2>
            </div>
            <div className="">
              <h2>{userData?.email}</h2>
            </div>
            <div className="">
              <h2>{userData?.role}</h2>
            </div>
            {storeData?.avg_rating && (
              <>
                <div>
                  <h1 className="">{storeData?.store_name}</h1>
                </div>
                <div>
                  <h1 className="">
                    {storeData?.avg_rating} stars Based On{" "}
                    {storeData?.total_reviews} Reviews
                  </h1>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="relative flex items-center justify-center ">
          <button
            className="cursor-pointer bg-blue-500 rounded-lg px-6 py-2 font-outfit font-medium text-purple-200 text-lg"
            onClick={() => setPasswordChangeDialogBox(true)}
          >
            Change Password
          </button>
          {passwordChangeDialogBox ? (
            <div className="w-96 h-96 -bottom-[200%] absolute bg-white font-outfit">
              <div className="w-full h-full flex flex-col gap-4 justify-between py-10 px-5 ">
                <div className="font-medium text-3xl flex justify-between px-4 ">
                  <h2 className="text-purple-400">Change Password</h2>
                  <IoClose
                    className="w-10 h-10 cursor-pointer"
                    onClick={() => {
                      setPasswordChangeDialogBox(false);
                    }}
                  />
                </div>
                <div className="h-full mt-6">
                  <form
                    className="flex flex-col gap-4"
                    onSubmit={handleSubmit(handlePasswordChange)}
                  >
                    <input
                      type="text"
                      name="oldPassword"
                      {...register("oldPassword", {
                        required: "Old Password is Required",
                      })}
                      placeholder="Old Password"
                      className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
                    />
                    <input
                      type="text"
                      name="newPassword"
                      {...register("newPassword", {
                        required: "New Password is Required",
                      })}
                      placeholder="New Password"
                      className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
                    />
                    <button className="cursor-pointer bg-blue-500 rounded-lg px-6 py-2 font-outfit font-medium text-purple-200 text-lg">
                      Change Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
