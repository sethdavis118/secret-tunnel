import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  // TODO: signup
  const signup = async (username) => {
    try {
      // If the API doesn't work, add a url parameter. Possible consdense username and password into one parameter.
      const result = await fetch(API + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: "password",
        }),
      });
      const tempToken = await result.json();
      setToken(tempToken.token);
      setLocation("TABLET");
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: authenticate
  const authenticate = async () => {
    // Should I pass token in here instead?
    try {
      if (token === undefined) {
        throw new Error("No token provided");
      }
      await fetch(API + "/authenticate", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setLocation("TUNNEL");
    } catch (error) {
      console.error(error);
    }
  };

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
