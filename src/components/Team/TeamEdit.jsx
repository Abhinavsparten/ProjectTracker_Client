// TeamForm.js

import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addTracker, getSingleEmployee, getallEmployees, getallProjects, updateTracker } from "../../service/allapi";

const initialTeamState = {
  name: "",
  employeeCode: "",
  techStack: "",
  project: "",
  percentage: "",
  priority: "",
};



const TeamEdit = ({ shows, handleClose,team,updateTeamInState}) => {
    

  const [teamData, setTeamData] = useState(initialTeamState);
  const [errors, setErrors] = useState({});

  const [empcode, setEmpcode] = useState('');

  

  const handleinput = async (e) => {
    const { name, value } = e.target;
    const response = await getSingleEmployee(value);
    setEmpcode(response.data);
  };

  useEffect(() => {
    if(team){
        setTeamData(team);
        
    }else
    {
        setTeamData(initialTeamState)
    }
},[team])
console.log(teamData);



  const handleChange = (e) => {

    const { name, value } = e.target;


    // Validate each field as the user types
    let errorMessage = "";
    switch (name) {
      case "name":
  
        errorMessage = value.trim() === "" ? "Name is required" : !/^[a-zA-Z\s]+$/.test(value) ? "Name must be a string without numeric characters" : "";
        break;
      // case "employeeCode":
      //   errorMessage = value.trim() === "" ? "Employee Code is required" : !/^\d+$/.test(value) ? "Employee Code must contain only numerical values" : "";
      //   break;
      case "techStack":
        errorMessage = value.trim() === "" ? "Tech Stack is required" : "";
        break;
      case "project":
        errorMessage = value.trim() === "" ? "Project is required" : "";
        break;
      case "percentage":
        errorMessage = value === "" ? "Allocated Percentage is required" : isNaN(value) || +value < 0 || +value > 100 ? "Please enter a valid percentage (0-100)" : "";
        break;
      case "priority":
        errorMessage = value.trim() === "" ? "Priority is required"  : "";
        break;
      default:
        errorMessage = "";
    }
console.log(teamData);
    setTeamData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate each field
    Object.keys(teamData).forEach((name) => {
      switch (name) {
        case "name":
          newErrors.name = teamData.name.trim() === "" ? "Name is required" : !/^[a-zA-Z\s]+$/.test(teamData.name) ? "Name must be a string without numeric characters" : "";
          break;
        // case "employeeCode":
          // newErrors.employeeCode = teamData.employeeCode === "" ? "Employee Code is required" : !/^\d+$/.test(teamData.employeeCode) ? "Employee Code must contain only numerical values" : "";
          // break;
        case "techStack":
          newErrors.techStack = teamData.techStack.trim() === "" ? "Tech Stack is required" : "";
          break;
        case "project":
          newErrors.project = teamData.project.trim() === "" ? "Project is required" : "";
          break;
        case "percentage":
          newErrors.percentage = teamData.percentage === "" ? "Allocated Percentage is required" : isNaN(teamData.percentage) || +teamData.percentage < 0 || +teamData.percentage > 100 ? "Please enter a valid percentage (0-100)" : "";
          break;
        case "priority":
          newErrors.priority = teamData.priority.trim() === "" ? "Priority is required" : "";
          break;
        default:
          newErrors[name] = "";
      }
    });
    console.log(teamData);

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const [projects, setProjects] = useState([]);// For storing the list of projects

  const [employees, setEmployees] = useState([]); // For storing the list of employees
  const [loading, setLoading] = useState(false);
  

   // Function to call the API and get all projects
   const getAllProjects = async () => {
    const response = await getallProjects(projects)
    setProjects(response.data)
    console.log(projects);
}
// define a function to call the API
const getAllEmployee = async () => {
  try {
    setLoading(true); // Set loading to true before making the API call
    const response = await getallEmployees();
    setEmployees(response.data);
  } catch (error) {
    console.error("Error fetching employees:", error);
  } finally {
    setLoading(false); // Set loading to false after the API call (success or error)
  }
};
  
 const handleSubmit = async () => {
    if (validateForm()) {
      const updatedTeamData = { ...teamData };
      const response = await updateTracker(teamData._id, updatedTeamData);

      if (response.status === 200) {
        toast.success(response.data.message);
          
         // Update the team data in the parent component's state
        updateTeamInState(updatedTeamData);
        // Close the form after the successful update
        handleClose();
      } else {
        toast.error(response.data.message);
      }

      setTeamData(initialTeamState);
      setEmpcode('');
      handleClose();
    }
  };
      // useEffect hook to fetch all projects on component mount
      useEffect(() => {
        getAllEmployee();
        getAllProjects();
    }, []);

  return (
    <Modal size="md" show={shows} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title><h2>Edit Tracker  </h2></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Select className="sel hov"
                  name="name"
                  value={teamData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  onInput={handleinput}
              
                >
                  <option value="" disabled>
            {loading ? "Loading..." : "Employee Name"}
          </option>
                          {
        employees.length > 0 ? employees.map((i,index) => (
       
                  <option value={i.name}>{i.name}</option>
                  )
                  ):""
              }
                
                </Form.Select>
              </Form.Group>
            </Col>
            <Col>
            <Form.Group controlId="employeeCode">
        <Form.Label>Employee id</Form.Label>
        <Form.Control className="hov"
                  type="text"
                  name="employeeCode"
          value={teamData.employeeCode}
          onChange={handleChange}
          isInvalid={!!errors.employeeCode}
                />
   
        <Form.Control.Feedback type="invalid">
          {errors.employeeCode}
        </Form.Control.Feedback>
      </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="techStack">
                <Form.Label>Tech Stack</Form.Label>
                <Form.Select 
                  name="techStack" className="sel hov"
                 value={teamData.techStack}
                  onChange={handleChange}
                  isInvalid={!!errors.techStack}
                >
                  
                  <option value="mern">Mern</option>
                  <option value="python">Python</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.techStack}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
   
              <Form.Group controlId="project">
                <Form.Label>Project</Form.Label>
        
                <Form.Select
                  name="project" className="sel hov"
                  value={teamData.project}
                  onChange={handleChange}
                  isInvalid={!!errors.project}
                >
                         <option value="" disabled>
            {loading ? "Loading..." : "Select Project..."}
          </option>
                          {
        projects.length > 0 ? projects.map((i,index) => (
                  <option value={i.projectName}>{i.projectName}</option>
                  )
                  ):""
              }
                
                </Form.Select>
                 
                <Form.Control.Feedback type="invalid">
                  {errors.project}
                </Form.Control.Feedback>
              </Form.Group>
          
            
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group controlId="percentage">
                <Form.Label>Allocated Percentage</Form.Label>
                <Form.Control className="hov"
                  type="text"
                  placeholder="Enter allocated percentage"
                  name="percentage"
                  value={teamData.percentage}
                  onChange={handleChange}
                  isInvalid={!!errors.percentage}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.percentage}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="priority">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority" className="sel hov"
                  value={teamData.priority}
                  onChange={handleChange}
                  isInvalid={!!errors.priority}
                >
                  
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="low">Low</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {errors.priority}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="dark" onClick={handleSubmit}>
         Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TeamEdit;


