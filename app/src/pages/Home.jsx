import React, { useEffect, useState } from "react";
import { useStateContext } from "../context";
import StoreCard from "../_components/StoreCard";
import { IoClose } from "react-icons/io5";
import { FaStore } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { FcRating } from "react-icons/fc";
import { GiPositionMarker } from "react-icons/gi";
import { useForm } from "react-hook-form";
import axios from "axios";

const Home = () => {
  const {
    allStoreData,
    fetchRaters,
    fetchData,
    userData,
    raters,
    fetchAllStoreData,
    searchQuery,
    filteredStoreData,
    setFilteredStoreData,
  } = useStateContext();
  // console.log(allStoreData);
  const { register, handleSubmit } = useForm();
  const [storeDialogBox, setStoreDialogBox] = useState(false);
  const [currStore, setCurrStore] = useState();
  const [editRatingForm, setEditRatingForm] = useState(false);

  useEffect(() => {
    const filtered = allStoreData?.filter((store) =>
      [store.store_name, store.store_address].some((field) =>
        field?.toLowerCase().includes(searchQuery)
      )
    );

    setFilteredStoreData(filtered);
  }, [searchQuery]);

  async function createNewRating(data) {
    const response = await axios.post("http://localhost:8080/new-rating", data);
    if (response) {
      fetchAllStoreData();
      fetchRaters();
      setStoreDialogBox(false);
      fetchData();
    }
  }

  async function editRating(data) {
    const response = await axios.put("http://localhost:8080/edit-rating", data);
    if (response) {
      fetchAllStoreData();
      fetchRaters();
      setStoreDialogBox(false);
      fetchData();
    }
  }

  // console.log(Math.round(currStore?.avg_rating));
  const handleRating = (data) => {
    data.store_id = currStore.store_id;
    data.user_id = userData.id;

    createNewRating(data);
  };

  const handleEditedRating = (data) => {
    data.store_id = currStore.store_id;
    data.user_id = userData.id;
    console.log(data);

    editRating(data);
  };

  // console.log(raters);
  // console.log(userData);

  const isUserCommented = raters?.filter((item) => item?.id === userData?.id);

  return (
    <div className="w-10/12 mx-auto mt-5 relative">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {allStoreData &&
          (searchQuery === ""
            ? allStoreData?.map((item) => (
                <div
                  key={item?.store_id}
                  onClick={() => {
                    fetchRaters(item?.store_id);
                  }}
                >
                  <StoreCard
                    store={item}
                    storeDialogBox={storeDialogBox}
                    setStoreDialogBox={setStoreDialogBox}
                    setCurrStore={setCurrStore}
                  />
                </div>
              ))
            : filteredStoreData?.map((item) => (
                <div
                  key={item?.store_id}
                  onClick={() => {
                    fetchRaters(item?.store_id);
                  }}
                >
                  <StoreCard
                    store={item}
                    storeDialogBox={storeDialogBox}
                    setStoreDialogBox={setStoreDialogBox}
                    setCurrStore={setCurrStore}
                  />
                </div>
              )))}
      </div>
      {storeDialogBox ? (
        <div className="fixed z-50 min-w-full  h-[100vh] top-[80px] right-0 bg-white/50 flex flex-col gap-6 p-6 items-center rounded-2xl ">
          <div className="w-11/12 max-w-xl min-h-[400px] mx-auto bg-gray-300 border border-purple-400 rounded-lg p-2 ">
            <div className="flex justify-end items-end">
              <IoClose
                className="w-10 h-10 cursor-pointer"
                onClick={() => {
                  setStoreDialogBox(false);
                  setEditRatingForm(false);
                }}
              />
            </div>
            <div className="w-full m-2 p-4 ">
              <div className="font-outfit font-medium text-lg flex flex-col gap-3">
                <h1 className="flex items-center gap-2">
                  <FaStore className="w-7 h-7 text-purple-400 bg-black p-1 rounded-full" />{" "}
                  {currStore.store_name}
                </h1>
                <h2 className="flex items-center gap-2">
                  <GiPositionMarker className="w-7 h-7 text-purple-400 bg-black p-1 rounded-full" />{" "}
                  {currStore.store_address}
                </h2>
                <h2 className="flex items-center gap-2">
                  <MdOutlineMail className="w-7 h-7 text-purple-400 bg-black p-1 rounded-full" />{" "}
                  {currStore.store_email}
                </h2>
                <div class=" w-full rounded-lg">
                  <div className="flex items-center gap-2 font-bold text-blue-gray-500">
                    {currStore.avg_rating}
                    <div className="inline-flex items-center">
                      {[...Array(Math.round(currStore?.avg_rating))]?.map(
                        (_, i) => {
                          return (
                            <span key={i}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-6 h-6 text-yellow-700 cursor-pointer"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clip-rule="evenodd"
                                ></path>
                              </svg>
                            </span>
                          );
                        }
                      )}

                      {[...Array(5 - Math.round(currStore?.avg_rating))]?.map(
                        (_, i) => {
                          return (
                            <span key={i}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 cursor-pointer text-blue-gray-500"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                                ></path>
                              </svg>
                            </span>
                          );
                        }
                      )}
                    </div>
                    <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-500">
                      Based on {currStore.total_reviews} Reviews
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {userData && (
              <div className="w-full mx-2 px-4">
                {isUserCommented.length == 0 ? (
                  <div>
                    <h1 className="font-outfit font-normal text-lg">
                      Give Rating
                    </h1>
                    <form onSubmit={handleSubmit(handleRating)}>
                      <input
                        type="number"
                        placeholder="Rating"
                        max={5}
                        min={1}
                        name="rating"
                        {...register("rating")}
                        className="font-outfit font-normal text-shadow-md bg-white text-center border rounded-md pl-2 w-[200px] "
                        required
                      />
                      <button
                        type="submit"
                        className="ml-3 font-outfit font-normal text-base bg-blue-400/50 p-1 px-4 rounded-md hover:bg-blue-400 hover:shadow-md cursor-pointer "
                      >
                        Submit Rating
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center gap-6">
                    <h1 className="font-outfit font-normal text-lg">
                      Your Rating :
                    </h1>
                    {editRatingForm ? (
                      <form onSubmit={handleSubmit(handleEditedRating)}>
                        <input
                          type="number"
                          placeholder={"Enter New Rating"}
                          max={5}
                          min={1}
                          name="rating"
                          {...register("rating")}
                          className="font-outfit font-normal text-shadow-md bg-white text-center border rounded-md pl-2 w-[200px] "
                          required
                        />
                        <button
                          type="submit"
                          className="ml-3 font-outfit font-normal text-base bg-blue-400/50 p-1 px-4 rounded-md hover:bg-blue-400 hover:shadow-md cursor-pointer "
                        >
                          Update Rating
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-6">
                        <h2>{isUserCommented[0]?.rating}</h2>
                        <button
                          className=" font-outfit font-normal text-base bg-blue-400/50 p-1 px-4 rounded-md hover:bg-blue-400 hover:shadow-md cursor-pointer "
                          onClick={() => setEditRatingForm(true)}
                        >
                          Edit Rating
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
