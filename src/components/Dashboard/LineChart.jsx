import React, { useEffect, useState } from "react";
import { getallProjects } from "../../service/allapi";
import { Line } from "react-chartjs-2";
import {
  Chart as Chartjs,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { dateFormat } from "./dateFormat";

Chartjs.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export function LineChart() {
  const [projects, setProjects] = useState([]);

  const getAllProjects = async () => {
    try {
      const response = await getallProjects();
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  if (projects.length === 0) {
    return null;
  }

  const sortedProjects = projects.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  const startDateData = sortedProjects.map(
    (project) => new Date(project.startDate)
  );
  const endDateData = sortedProjects.map(
    (project) => new Date(project.endDate)
  );
  const projectNames = sortedProjects.map((project) => project.projectName);

  const currentDate = new Date();

  const lineChartData = {
    labels: sortedProjects.map((project) => dateFormat(project.endDate)),
    datasets: [
      // {
      //   label: "Start Date",
      //   data: startDateData,
      //   fill: false,
      //   borderColor: "#00cc66", // Green color for start date
      //   tension: 0.1,
      // },
      {
        label: "End Date",
        data: endDateData,
        fill: false,
        borderColor: endDateData.some((date) => date < currentDate)
          ? "#FFCCCB"
          : "gold", // Red color for approaching deadline
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Projects and End Dates",
        position: "bottom",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            const index = tooltipItems[0].dataIndex;
            return `Project: ${projectNames[index]}`;
          },
          label: (tooltipItem) => {
            const datasetLabel = tooltipItem.dataset.label;
            const date = new Date(tooltipItem.parsed.x);

            // Get the corresponding project index from the x-axis label
            const index = sortedProjects.findIndex(
              (project) => dateFormat(project.endDate) === tooltipItem.label
            );

            // Extract project details
            const projectName = projectNames[index];
            const startDate = dateFormat(sortedProjects[index].startDate);
            const endDate = dateFormat(sortedProjects[index].endDate);

            // Display project details in the tooltip
            return ` (${projectName} - End: ${endDate})`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "category",
        position: "bottom",
      },
      y: {
        type: "category",
        labels: projectNames,
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <Line options={options} data={lineChartData} />
    </div>
  );
  
}
