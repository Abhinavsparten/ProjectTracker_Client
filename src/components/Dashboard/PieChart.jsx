
/*doughnutchart*/
import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { getallTracker } from "../../service/allapi";

ChartJS.register(ArcElement, Tooltip, Legend);


export function PieChart() {

    
    let pri = [];
    let sec = [];
    let low = [];
    let pieDatas = [];

    const [projects, setProjects] = useState([]);

    // Function to call the API and get all projects
    const getAllTracker = async () => {
        const response = await getallTracker(projects)
        setProjects(response.data)
        console.log(projects);
    }
  
    pri = projects.map(a => a.priority === "primary")

    const countPrimary = pri.filter(value => value === true).length;
    console.log(countPrimary);

    sec = projects.map(a => a.priority === "secondary")

    const countSecondary = sec.filter(value => value === true).length;
    console.log(countSecondary);

    low = projects.map(a => a.priority === "low")

    const countLow = low.filter(value => value === true).length;
    console.log(countLow);

    pieDatas=[countPrimary,countSecondary,countLow]
    console.log(pieDatas);

 
 const data = {
    labels: ["Primary", "Secondary","Low"],
    datasets: [
        {
            label: "Projects in This ",
            data: pieDatas,
            backgroundColor: [

                "lightgreen",
                "gold",
                "#FFCCCB"
            ],
            borderColor: "white",
            borderwidth: 500,
            cutout: "55%"
        }
    ]
};

        // useEffect hook to fetch all projects on component mount
        useEffect(() => {
           
            getAllTracker();
        }, []);
    return(
        <div style={{ width: '100%', height: '300px' }}>
          <Doughnut data={data} />
        </div>
    ) 
}