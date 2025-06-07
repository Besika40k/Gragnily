import React, { createContext, useState, useContext } from "react";

// Create the User Context
const UserContext = createContext();

// Custom hook to use user context
export const useUser = () => {
  return useContext(UserContext);
};

// Default user object
const defaultUser = {
  username: "Guest",
  email: "",
  profile_picture_url:
    "https://wallpapers-clan.com/wp-content/uploads/2022/08/default-pfp-19.jpg",
  about_me: "",
};

// UserProvider component to provide context to the app
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(defaultUser); // Set default user here

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
