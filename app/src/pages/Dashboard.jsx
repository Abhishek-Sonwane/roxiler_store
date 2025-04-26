import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import axios from "axios";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { Chart } from "react-google-charts";
import { CiSearch } from "react-icons/ci";

const Dashboard = () => {
  const {
    allUsers,
    fetchData,
    allRatingData,
    allStoreData,
    userData,
    raters,
    fetchRaters,
    storeData,
    fetchUserData,
  } = useStateContext();
  const [newUserDialog, setNewUserDialog] = useState(false);
  const [userDialog, setUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const { register, handleSubmit } = useForm();
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState();
  const [newStoreDialog, setNewStoreDialog] = useState(false);

  const {
    register: newRoleRegister,
    handleSubmit: handleRoleSubmit,
    reset,
  } = useForm();

  const { register: newStoreRegister, handleSubmit: handleStoreSubmit } =
    useForm();

  const admin = allUsers?.filter((item) => item.role === "admin");
  const storeOwner = allUsers?.filter((item) => item.role === "storeOwner");
  const user = allUsers?.filter((item) => item.role === "user");

  const handleNewUserCreation = async (data) => {
    // console.log(data);
    try {
      const response = await axios.post(
        "http://localhost:8080/create-account",
        data
      );
      if (response) {
        console.log(response);
        fetchData();
        setNewUserDialog(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewStoreCreation = async (data) => {
    const newStore = {
      owner_id: userData.id,
      store_name: data.name,
      store_address: data.address,
      store_email: data.email,
    };
    // console.log(newStore);
    try {
      const response = await axios.post(
        "http://localhost:8080/create-store",
        newStore
      );
      if (response) {
        console.log(response);
        fetchUserData(userData?.id);
        setNewStoreDialog(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleNewRoleSubmit = async (data) => {
    // console.log(data);
    // console.log(selectedUser);

    const parsedData = { id: selectedUser.id, role: data.role };

    // console.log(parsedData);

    try {
      const response = await axios.put(
        "http://localhost:8080/update-role",
        parsedData
      );
      if (response) {
        // console.log(response.data);
        fetchData();
        setUserDialog(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      reset({ role: selectedUser.role });
    }
    if (userData?.role === "storeOwner") {
      fetchRaters(storeData?.store_id);
    }
    const filtered = allUsers?.filter((user) =>
      [user.name, user.address, user.email].some((field) =>
        field?.toLowerCase().includes(userSearchQuery)
      )
    );

    setFilteredUsers(filtered);
  }, [selectedUser, userData, userSearchQuery]);

  const data = [
    ["User Type", "No. of User"],
    ["System Administrator", admin?.length || 0],
    ["Store Owner", storeOwner?.length || 0],
    ["User", user?.length || 0],
  ];

  const options = {
    title: `Total User : ${allUsers?.length}`,
    backgroundColor: "transparent",
  };

  return (
    <div className="w-10/12 mx-auto grid grid-cols-1 items-center justify-center">
      <h2 className="font-outfit font-bold text-4xl text-purple-600 underline text-shadow text-shadow-lg ">
        Dashboard
      </h2>
      {userData?.role === "admin" ? (
        <div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 py-10 items-center justify-center">
            <div>
              <Chart
                chartType="PieChart"
                data={data}
                options={options}
                width={"100%"}
                height={"400px"}
              />
            </div>

            <div className="font-outfit font-medium text-lg text-center">
              <h2>No. of Users : {allUsers?.length}</h2>
              <h2>No. of Stores : {allStoreData?.length}</h2>
              <h2>No. of Ratings Submitted : {allRatingData?.length}</h2>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-full max-w-7xl justify-between mx-auto">
            <div className="flex w-full max-w-6xl justify-between">
              {" "}
              <h2 className="font-outfit font-medium text-3xl text-black">
                All Users
              </h2>
              <div className="relative flex">
                <input
                  type="text"
                  placeholder="Search Store"
                  onChange={(e) =>
                    setUserSearchQuery(e.target.value.toLowerCase())
                  }
                  className="w-full font-outfit font-light text-lg text-gray-400 border rounded-full px-4 lg:px-8 bg-white min-h-10 focus:shadow shadow-black ring-0 focus:outline-none "
                />
                <CiSearch className="w-7 h-7 absolute top-[20%] right-4 lg:right-8 cursor-pointer " />
              </div>
              <button
                onClick={() => {
                  setNewUserDialog(true);
                }}
                className="w-[180px] bg-blue-500 font-outfit font-medium text-xl text-purple-300 rounded-xl px-4 py-2 cursor-pointer "
              >
                Create User
              </button>
              {newUserDialog && (
                <div className="fixed z-50 min-w-full  h-[100vh] top-[80px] right-0 bg-white/50 flex flex-col gap-6 p-6 items-center rounded-2xl ">
                  <div className="w-11/12 max-w-fit min-h-[400px] mx-auto bg-gray-300 border border-purple-400 rounded-lg p-6 ">
                    <div className="flex justify-end items-end">
                      <IoClose
                        className="w-10 h-10 cursor-pointer"
                        onClick={() => setNewUserDialog(false)}
                      />
                    </div>
                    <div className="mt-4">
                      <form
                        className="w-xl flex flex-col gap-4 font-outfit text-black font-normal text-lg"
                        onSubmit={handleSubmit(handleNewUserCreation)}
                      >
                        <input
                          type="text"
                          name="name"
                          minLength={20}
                          maxLength={60}
                          {...register("name")}
                          placeholder="Name"
                          className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
                        />
                        <input
                          type="text"
                          name="address"
                          maxLength={400}
                          {...register("address")}
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

                        <label htmlFor="role">Role</label>

                        <select
                          name="role"
                          id="role"
                          defaultValue={"user"}
                          {...register("role")}
                          className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4 "
                        >
                          <option value="admin">System Administrator</option>
                          <option value="storeOwner">Store Owner</option>
                          <option value="user" selected={true}>
                            User
                          </option>
                        </select>

                        {}

                        <div className="w-full flex flex-col items-center gap-2">
                          <button
                            className="w-full bg-blue-500 h-12 rounded-full font-outfit text-white hover:text-black cursor-pointer font font-medium text-lg"
                            type="submit"
                          >
                            Create User
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Role
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers &&
                    (userSearchQuery === ""
                      ? allUsers?.map((item) => (
                          <tr
                            className="bg-white border-b mt-1 border-gray-200"
                            key={item.id}
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                            >
                              {item.name}
                            </th>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.address}</td>
                            <td className="px-6 py-4 flex justify-between">
                              <span>{item.role}</span>
                              <button
                                className="bg-blue-500 font-outfit font-medium text-purple-300 text-base p-1 rounded-md"
                                onClick={() => {
                                  setUserDialog(true);
                                  setSelectedUser(item);
                                }}
                              >
                                Change Role
                              </button>
                            </td>
                          </tr>
                        ))
                      : filteredUsers?.map((item) => (
                          <tr
                            className="bg-white border-b mt-1 border-gray-200"
                            key={item.id}
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                            >
                              {item.name}
                            </th>
                            <td className="px-6 py-4">{item.email}</td>
                            <td className="px-6 py-4">{item.address}</td>
                            <td className="px-6 py-4 flex justify-between">
                              <span>{item.role}</span>
                              <button
                                className="bg-blue-500 font-outfit font-medium text-purple-300 text-base p-1 rounded-md"
                                onClick={() => {
                                  setUserDialog(true);
                                  setSelectedUser(item);
                                }}
                              >
                                Change Role
                              </button>
                            </td>
                          </tr>
                        )))}
                </tbody>
              </table>
              {userDialog && (
                <div className="fixed z-50 min-w-full  h-[100vh] top-[80px] right-0 bg-white/50 flex flex-col gap-6 p-6 items-center rounded-2xl ">
                  <div className="w-11/12 max-w-fit min-h-[400px] mx-auto bg-gray-300 border border-purple-400 rounded-lg p-6 ">
                    <div className="flex justify-end items-end">
                      <IoClose
                        className="w-10 h-10 cursor-pointer"
                        onClick={() => {
                          setUserDialog(false);
                          setSelectedUser("");
                        }}
                      />
                    </div>
                    <div className="mt-4">
                      <form
                        className="w-xl flex flex-col gap-4 font-outfit text-black font-normal text-lg"
                        onSubmit={handleRoleSubmit(handleNewRoleSubmit)}
                      >
                        <label htmlFor="role">Role</label>

                        <select
                          name="role"
                          id="role"
                          defaultValue={selectedUser?.role || ""}
                          {...newRoleRegister("role")}
                          className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4 "
                        >
                          {" "}
                          <option value="user">User</option>
                          <option value="admin">System Administrator</option>
                          <option value="storeOwner">Store Owner</option>
                        </select>

                        <div className="w-full flex flex-col items-center gap-2">
                          <button
                            className="w-full bg-blue-500 h-12 rounded-full font-outfit text-white hover:text-black cursor-pointer font font-medium text-lg"
                            type="submit"
                          >
                            Change Role
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          {storeData ? (
            <div className="flex flex-col w-[1000px] mx-auto gap-10 py-10">
              <div>
                <h1 className="font-outfit font-bold text-3xl">
                  Store Information
                </h1>
                <div className="font-outfit font-normal text-lg ml-6 mt-6">
                  <h1>
                    <span className="font-medium text-xl">Store Name</span>{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: {storeData?.store_name}
                  </h1>
                  <h1>
                    <span className="font-medium text-xl"> Store Email</span>{" "}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:{" "}
                    {storeData?.store_email}
                  </h1>
                  <h1>
                    <span className="font-medium text-xl">Store Address</span> :{" "}
                    {storeData?.store_address}
                  </h1>
                  <h1>
                    <span className="font-medium text-xl">
                      Store Avg. Rating
                    </span>{" "}
                    : {storeData?.avg_rating} Stars
                  </h1>
                  <h1>
                    <span className="font-medium text-xl">Total Reviews</span> :{" "}
                    {storeData?.total_reviews} Reviews
                  </h1>
                </div>
              </div>
              <div>
                {raters && (
                  <div className="max-w-[1000px] mx-auto">
                    <h2 className="font-outfit font-medium text-3xl ">
                      All Ratings From Users
                    </h2>
                    <table className="w-full border border-gray-300 rounded-lg overflow-hidden mt-6">
                      <thead className="bg-gray-100 text-left text-lg">
                        <tr className="text-center">
                          <th className="px-4 py-2">Sr. no</th>
                          <th className="px-4 py-2">Name</th>
                          <th className="px-4 py-2">Email</th>
                          <th className="px-4 py-2">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {raters?.map((item, index) => (
                          <tr
                            key={item.id}
                            className={
                              index % 2 === 0
                                ? "bg-white hover:bg-gray-100"
                                : "bg-gray-50 hover:bg-gray-100"
                            }
                          >
                            <td className="px-4 py-2">{index + 1}</td>
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2">{item.email}</td>
                            <td className="px-4 py-2">{item.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <button
                onClick={() => {
                  setNewStoreDialog(true);
                }}
                className="w-[180px] bg-blue-500 font-outfit font-medium text-xl text-purple-300 rounded-xl px-4 py-2 cursor-pointer "
              >
                Create Store
              </button>
              {newStoreDialog && (
                <div className="fixed z-50 min-w-full  h-[100vh] top-[80px] right-0 bg-white/50 flex flex-col gap-6 p-6 items-center rounded-2xl ">
                  <div className="w-11/12 max-w-fit min-h-[400px] mx-auto bg-gray-300 border border-purple-400 rounded-lg p-6 ">
                    <div className="flex justify-end items-end">
                      <IoClose
                        className="w-10 h-10 cursor-pointer"
                        onClick={() => setNewStoreDialog(false)}
                      />
                    </div>
                    <div className="mt-4">
                      <form
                        className="w-xl flex flex-col gap-4 font-outfit text-black font-normal text-lg"
                        onSubmit={handleStoreSubmit(handleNewStoreCreation)}
                      >
                        <input
                          type="text"
                          name="name"
                          {...newStoreRegister("name")}
                          placeholder="Name"
                          className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
                        />
                        <input
                          type="text"
                          name="address"
                          {...newStoreRegister("address")}
                          placeholder="Address"
                          className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
                        />
                        <input
                          type="email"
                          name="email"
                          {...newStoreRegister("email")}
                          placeholder="Email"
                          className="w-full h-16 bg-gray-400 rounded-lg p-2 px-4"
                        />

                        <div className="w-full flex flex-col items-center gap-2">
                          <button
                            className="w-full bg-blue-500 h-12 rounded-full font-outfit text-white hover:text-black cursor-pointer font font-medium text-lg"
                            type="submit"
                          >
                            Create Store
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
