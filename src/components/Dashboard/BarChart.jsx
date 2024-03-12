
import React, { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getallTracker } from "../../service/allapi";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);


export function BarChart() {


    let names = [];
    let workdone = [];
    const [projects, setProjects] = useState([]);

    
    // Function to call the API and get all projects
    const getAllProjects = async () => {
        const response = await getallTracker(projects)
        setProjects(response.data)
        console.log(projects);
    }
    names = projects.map(a => a.name);

    workdone = projects.map(a => a.percentage);

    const labels = names;

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: "top",
                display:false
            },
            title: {
                display: true,
                text: "Employee Name",
                position:"bottom"
            }
        }
    };


    const data = {
        labels,
        datasets: [
            {
            label: "Project Done %",
            data: workdone,
            backgroundColor: workdone.map((value) => {
              if (value > 75) {
                return "lightgreen"; // Higher than 75% - green
              } else if (value > 45) {
                return "gold"; // Between 45% and 75% - yellow
              } else {
                return "#FFCCCB"; // Below 45% - light red
              }
            }),
            barPercentage: 0.4,
          },


        ],
    };



    // useEffect hook to fetch all projects on component mount
    useEffect(() => {
     
        getAllProjects();
    }, []);

    return(
        <div style={{ width: '100%', height: '300px' }}>
           <Bar options={options} data={data} />
        </div>
    )
}