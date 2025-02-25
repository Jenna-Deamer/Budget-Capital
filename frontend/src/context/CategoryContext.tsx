import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const CategoryContext = createContext(null);


export const useCategories = () => useContext(CategoryContext);