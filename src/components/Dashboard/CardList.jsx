import React, { useEffect, useState } from "react";
import { FaBook, FaBookReader, FaUsers, FaUserPlus } from "react-icons/fa";
import { GrProjects } from "react-icons/gr";
import { MdGroups2 } from "react-icons/md";
import { Card } from "./Card";
import { getallEmployees, getallProjects, getallTracker } from "../../service/allapi";

export function CardList() {
    //state
  const [projects, setProjects] = useState([]);
  const [employees , setEmployees] = useState([]);
  const [trackers, setTrackers]   = useState([]);
  const [trackerEmp , setTrackerEmp] = useState(0);
  const [empTotal , setEmpTotal] = useState(0);
  const [totalLength, setTotalLength] = useState(0);
  const [clients,setClients] = useState(0);

  // Function to call the API and get all projects
  const getAllProjects = async () => {
    try {
      const response = await getallProjects();
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  //Function to call the Api and get all employees 
  const getAllEmployees = async()=>{
    try {
        const response = await getallEmployees();
        setEmployees(response.data);
        
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
  }

  const getAllTracker = async () => {
    try {
        const response = await getallTracker();
        setTrackers(response.data);
        
    } catch (error) {
        console.error("Error fetching trackers:", error);
    }
  }

  useEffect(() => {
    // This effect will run whenever the total.length changes
    console.log("Total length changed:", totalLength);
    //get all projects
    getAllProjects();
    // Get all employees
    getAllEmployees()
    //get all trackers
    getAllTracker()
  }, [totalLength,empTotal,trackerEmp]);

  useEffect(() => {
    // Update totalLength whenever projects change
    let total = projects.map(project => project.projectName);
    let client = projects.map(project => project.clientName);
    setClients(client.length);
    setTotalLength(total.length);

    //calculate total employees in our organization
    let totalemp = employees.map(employee => employee.name)
    setEmpTotal(totalemp.length);

    //get total tracker employees
    let trackerEmp = trackers.map(emp => emp.name)
    setTrackerEmp(trackerEmp.length);
  }, [projects,employees,trackers]);

  const cardData = [
    {
      title: "Total Projects",
      count: totalLength,
      colors: "success",
      icon: <GrProjects style={{ color: "#450c36" }} />,
    },
    {
      title: "Total Employees",
      count: empTotal,
      colors: "warning",
      icon: <MdGroups2 style={{ color: "#450c36" }} />,
    },
    {
      title: "Total Clients",
      count: clients,
      colors: "info",
      icon: <FaUsers style={{ color: "#450c36" }} />,
    },
    {
      title: "Tracker Employees",
      count: trackerEmp,
      colors: "primary",
      icon: <FaUserPlus style={{ color: "#450c36" }} />,
    },
  ];

  return (
    <div className="row">
      {cardData.map((dt, index) => (
        <Card key={index} data={dt} />
      ))}
    </div>
  );
}
