import React, { useEffect, useState } from "react";
import { createContext } from "react";
import { jobsData } from "../assets/assets";
export const AppContext = createContext()

export const AppProvider = (props) => {

    const [serachFilter,setSerachFilter] = useState({
        title:"",
        location:"",

    })

    const [isSerached,setIsSerached] = useState(false)


    const [jobs,setJobs] = useState([])

// function to featch job date

   const fetchJobs = async () =>{
    setJobs(jobsData)

   }

   useEffect(()=>{
    fetchJobs()

   },[])

    const value = {
        setSerachFilter,serachFilter,isSerached,setIsSerached,jobs,setJobs

    }

    return (<AppContext.Provider value={value}>
        {props.children}

    </AppContext.Provider>)
}