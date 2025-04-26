import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [userData, setUserData] = useState();
  const [allUsers, setAllUsers] = useState();
  const [allStoreData, setAllStoreData] = useState();
  const [allRatingData, setAllRatingData] = useState();
  const [raters, setRaters] = useState([]);
  const [storeData, setStoreData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredStoreData, setFilteredStoreData] = useState();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // console.log(userData);

  useEffect(() => {
    fetchData();
    fetchAllStoreData();
    fetchAllRatingData();
    if (searchQuery == "") {
      setFilteredStoreData(allStoreData);
    }

    const token = localStorage.getItem("token");
    // console.log(token);

    if (token) {
      setIsLoggedIn(true);
      // Optionally fetch user details if needed
      const decoded = jwtDecode(token);
      // console.log(decoded);
      const id = decoded.id;
      fetchUserData(id);
    }
  }, []);

  async function fetchData() {
    const response = await axios.get(`http://localhost:8080/users`);
    if (response) {
      // console.log(response.data);

      setAllUsers(response.data);
      fetchAllStoreData();
      fetchAllRatingData();
    }
  }

  async function fetchUserData(id) {
    const response = await axios.post(`http://localhost:8080/get-user/${id}`);
    if (response) {
      // console.log(response.data);

      setUserData(response.data);

      if (response?.data?.role === "storeOwner") {
        fetchStoreData(response?.data?.id);
      }
      setIsLoggedIn(true);
    }
  }

  async function fetchAllStoreData() {
    updateStoreData();
    const response = await axios.get("http://localhost:8080/all-stores");
    if (response) {
      setAllStoreData(response.data);
    }
  }

  async function fetchAllRatingData() {
    updateStoreData();
    const response = await axios.get("http://localhost:8080/all-ratings");
    if (response) {
      setAllRatingData(response.data);
    }
  }

  async function fetchRaters(storeId) {
    updateStoreData();
    try {
      const res = await axios.get(
        `http://localhost:8080/store/${storeId}/ratings`
      );

      setRaters(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchStoreData(userId) {
    const response = await axios.get(
      `http://localhost:8080/get-store-data/${userId}`
    );
    if (response) {
      setStoreData(response.data[0]);
    }
  }

  async function updateStoreData() {
    await axios.get("http://localhost:8080/update-store-info");
  }

  return (
    <StateContext.Provider
      value={{
        userData,
        setUserData,
        allUsers,
        setAllUsers,
        isLoggedIn,
        setIsLoggedIn,
        allStoreData,
        fetchData,
        allRatingData,
        raters,
        setRaters,
        fetchRaters,
        storeData,
        updateStoreData,
        fetchAllStoreData,
        setSearchQuery,
        searchQuery,
        filteredStoreData,
        setFilteredStoreData,
        fetchStoreData,
        fetchUserData,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
