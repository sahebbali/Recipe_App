import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.clear();
    navigate("/auth");
  };
  return (
    <div className="navbar">
      <Link className="navitem" to="/">Home</Link>
      <Link className="navitem" to="/create-recipe">Create Recipe</Link>
      <Link className="navitem" to="/saved-recipes">Saved Recipes</Link>
      {!cookies.access_token ? (
        <Link to="/auth">Login/Register</Link>
      ) : (
        <button  className='btn' onClick={logout}> Logout </button>
      )}
    </div>
  );
};
