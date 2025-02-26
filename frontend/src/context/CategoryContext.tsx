import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const CategoryContext = createContext(null);

export const useCategories = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
    const [categories, setCategories] = useState([]);
    const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
    
    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const token = localStorage.getItem("jwtToken");
                const response = await axios.get(`${API_URL}/category/categories`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories: ", error);
            }
        };
        fetchCategories();
    }, [API_URL]);

    return (
        <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
            {children}
        </CategoryContext.Provider>
    );
};