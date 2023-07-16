import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const userID = useGetUserID();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("https://recipe-app-d9ob.onrender.com/recipes");
        setRecipes(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://recipe-app-d9ob.onrender.com/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchSavedRecipes();
  }, [userID]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filteredResults = performSearch(searchTerm);
      setSearchResults(filteredResults);
    }, 500); // Adjust the delay time as per your needs

    return () => {
      clearTimeout(delayDebounce);
    };
  }, [searchTerm, recipes]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const performSearch = (term) => {
    if (term === '') {
      return recipes;
    } else {
      const regex = new RegExp(term, 'i');
      return recipes.filter((recipe) => regex.test(recipe.name));
    }
  };

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put("https://recipe-app-d9ob.onrender.com/recipes", {
        recipeID,
        userID,
      });
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
  <>
    <div className="container">
      <div>
      <h1> Ours Recipes</h1>
      </div>
      <div className="search">
        <input
          type="search"
          placeholder="Search Recipe..."
          value={searchTerm}
          onChange={handleChange}
        />
      </div>
      
    </div>
    <ul>
    {searchResults.map((recipe) => (
      <div className="cardContain" key={recipe._id}>
        <div className="card">
          <div>
            <h2>{recipe.name}</h2>
            <button
              onClick={() => saveRecipe(recipe._id)}
              disabled={isRecipeSaved(recipe._id)}
            >
              {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
            </button>
          </div>
          <div className="instructions">
            <p>{recipe.instructions}</p>
          </div>
          <img className="recipeImage" src={recipe.imageUrl} alt={recipe.name} />
          <p>Cooking Time: {recipe.cookingTime} minutes</p>
        </div>
      </div>
    ))}
  </ul>
  </>
  );
};
