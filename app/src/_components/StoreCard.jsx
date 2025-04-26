import React from "react";
import { FaStore } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import { GiPositionMarker } from "react-icons/gi";

const StoreCard = ({
  store,
  setCurrStore,
  storeDialogBox,
  setStoreDialogBox,
}) => {
  return (
    <>
      <div
        className="w-full bg-gray-300 m-2 p-4 border border-purple-500/30 rounded-lg cursor-pointer relative"
        onClick={() => {
          setStoreDialogBox(!storeDialogBox);
          setCurrStore(store);
        }}
      >
        <div className="font-outfit font-medium text-lg flex flex-col gap-3">
          <h1 className="flex items-center gap-2">
            <FaStore className="w-7 h-7 text-purple-400 bg-black p-1 rounded-full" />{" "}
            {store.store_name}
          </h1>
          <h2 className="flex items-center gap-2">
            <GiPositionMarker className="w-7 h-7 text-purple-400 bg-black p-1 rounded-full" />{" "}
            {store.store_address}
          </h2>
          <h2 className="flex items-center gap-2">
            <MdOutlineMail className="w-7 h-7 text-purple-400 bg-black p-1 rounded-full" />{" "}
            {store.store_email}
          </h2>
          <div className=" w-full rounded-lg">
            <div className="flex items-center gap-2 font-bold text-blue-gray-500">
              {store.avg_rating}
              <div className="inline-flex items-center">
                {[...Array(Math.round(store?.avg_rating))]?.map((_, i) => {
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
                })}

                {[...Array(5 - Math.round(store?.avg_rating))]?.map((_, i) => {
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
                })}
              </div>
              <p className="block font-sans text-base antialiased font-medium leading-relaxed text-blue-gray-500">
                Based on {store.total_reviews} Reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoreCard;
