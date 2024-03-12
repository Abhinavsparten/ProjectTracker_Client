// EmployeeContent.js

import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Table,
  Dropdown,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { CiFilter } from "react-icons/ci";
import EmployeeForm from "./EmpolyeeForm";
import { capitalize } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BsPencilSquare, BsFillTrash3Fill,BsJustify } from "react-icons/bs";
import { addTeam, deleteEmployee, getallEmployees, updateEmployee } from "../../service/allapi";
import { MDBTable, MDBTableBody } from "mdbreact";
import "./Employee.css"
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineFilterAlt } from "react-icons/md";

// EmployeesContent component definition
export const EmployeesContent = ({OpenSidebar}) => {

//for delete confirm modal
  const [smShow, setSmShow] = useState(false);

  // State variables
  const [isFormOpen, setFormOpen] = useState(false); // For controlling the visibility of the employee form
  const [employees, setEmployees] = useState([]); // For storing the list of employees
  const [employeeToEdit, setEmployeeToEdit] = useState(null); // For tracking the employee being edited
  const [search, setSearch] = useState(""); // For storing the search term
  const [filterType, setFilterType] = useState("name"); // Default filter type
  const [filterText, setFilterText] = useState("Filter"); // Default filter text
  const [errors, setErrors] = useState({}); // For handling form validation errors
 

  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);

    //for pagenation
    const [currentPage,setCurrentPage] = useState(1)
    const recordsPerPage = 8;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = employees.slice(firstIndex, lastIndex);
    const npages =Math.ceil(employees.length / recordsPerPage);
    const numbers = [...Array(npages+1).keys()].slice(1)

  // useEffect hook to set online status based on user email
  useEffect(() => {
    const userEmail = localStorage.getItem("email");

    // Find the corresponding employee and set online status
    const updatedEmployees = employees.map((employee) =>
      employee.slack === userEmail ? { ...employee, isOnline: true } : employee
    );
    // TODO: You need to do something with the updatedEmployees, probably set it in state
  }, [employees]); // Re-run the effect when employees state changes

  // Function to open the employee form
  const openForm = (employee) => {
    setEmployeeToEdit(employee);
    setFormOpen(true);
  };

  // Function to close the employee form
  const closeForm = () => {
    setEmployeeToEdit(null);
    setFormOpen(false);
  };

    //function for delete Project
  // Function to handle clicking on the delete button
  const handleDeleteButtonClick = (employeeId) => {
    setDeleteEmployeeId(employeeId);
    setSmShow(true);
  };
  // Function to fetch all employees
  //define a function to call api
  const getAllEmployee = async () => {
    const response = await getallEmployees(employees);
    setEmployees(response.data);
  };

  // handle add and edit employee
  const handleAddEmployee = async (newEmployee, isEdit) => {
    // Capitalize name and role
    newEmployee.name = capitalize(newEmployee.name);
    newEmployee.role = capitalize(newEmployee.role);
  
    try {
      // Exclude isOnline if it's not in the schema
      if (!newEmployee.hasOwnProperty("isOnline")) {
        delete newEmployee.isOnline;
      }
  
      // If editing, update the employee in the list
      if (isEdit) {
        try {
          if (newEmployee._id) {
            const response = await updateEmployee(newEmployee._id, newEmployee);
            console.log("Update Response:", response);
  
            if (response && response.status === 200) {
              getAllEmployee()
              // Update the employee
              setEmployees((prevEmployees) =>
                prevEmployees.map((employee) =>
                  employee._id === newEmployee._id ? newEmployee : employee
                )
              );
              toast.success(response?.data?.message || "Update successful");
            } else {
              toast.error(response?.data?.message || "Unknown error occurred");
            }
          } else {
            console.error("Error updating employee: _id is undefined");
            toast.error("Error updating employee. Please try again.");
          }
        } catch (updateError) {
          console.error("Error updating employee", updateError);
          toast.error("Error updating employee. Please try again.");
        }
      } else {
        // if adding new, make an API call to add the employee
        const response = await addTeam(newEmployee);
        console.log("Add Team Response:", response);
  
        if (response && response.status === 200) {
          getAllEmployee()
          // Add the new employee to the state with the returned id
          setEmployees((prevEmployees) => [
            ...prevEmployees,
            { ...newEmployee, id: response?.data?.id },
          ]);
          toast.success(response?.data?.message || "Employee added successfully");
        } else {
          toast.error(response?.data?.message || "Unknown error occurred");
        }
      }
    } catch (error) {
      console.error("Error updating/adding employee", error);
      toast.error("Error updating/adding employee. Please try again.");
    }
  };
  



  // Function to handle deleting an employee
  const handleDeleteEmployee = async (id) => {
    try {
      
        // API call for delete Employee
        const response = await deleteEmployee(id);
  
        if (response.status === 200) {
          
          toast.success(response.data.message);
  
          // Update the employees list after successful deletion
          const updatedEmployees = employees.filter((employee) => employee._id !== id);
          setEmployees(updatedEmployees);
  
          // Reset deleteEmployeeId and close the delete confirmation modal
          setDeleteEmployeeId(null);
          setSmShow(false);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting employee", error);
        toast.error("Error deleting employee. Please try again.");
    }
  };
  // Function to handle selecting a filter type
  const handleFilterSelect = (type, text) => {
    setFilterType(type);
    setFilterText(text);
  };

  // useEffect hook to fetch all employees on component mount
  useEffect(() => {
    getAllEmployee();
  }, []);

  // JSX rendering
  return (
    <Container>
      <Row className="mb-3">
        <Col className="text-start">
        <div className='menu-icon'>
            <BsJustify  className='icon' onClick={OpenSidebar}/>
        </div>
          <h1 className="mb-4">Employees</h1>
        </Col>
        <Col className="text-end">
          <Button className="hov"
            variant="dark"
            onClick={() => openForm(null)}
            style={{ fontSize: "17px", width: "150px" }}
          >
            Add Employee
          </Button>
        </Col>
        <Row className="mb-2 justify-content-start">
          <Col md="auto" className="text-start">
            <Dropdown className="hov">
              <Dropdown.Toggle
                 style={{
                  fontSize: "16px",
                  padding:"7px",
                  backgroundColor: "#f5f0f0",
                  color: "rgb(50, 49, 49)",
                  border:"none",
                  fontWeight:"normal"
                }} 
                id="dropdown-basic"
              >
               <MdOutlineFilterAlt id="filter-icon"  /> {filterText}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => handleFilterSelect("name", "Name")}
                >
                  Name
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleFilterSelect("role", "Role")}
                >
                  Role
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() =>
                    handleFilterSelect("employeeCode", "Employee Code")
                  }
                >
                  Employee Code
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => handleFilterSelect("slack", "Email")}
                >
                  Email
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
          <Col md="auto" className="text-start ">
          <div className="input-wrapper hov">
        <IoSearchSharp id="search-icon" />
        <input 
          type="text" 
          placeholder="Search"
          style={{ width: "200px" }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}

          /> 
          </div>
          </Col>
        </Row>
      </Row>
      <MDBTable responsive className="h">
        <thead className="tp">
          <tr>
            <th
              style={{
                backgroundColor: "#450c36",
                color: "white",
                borderTopLeftRadius: "10px",
                borderBottomLeftRadius: "10px",
              }}
              className="p-4"
            >
              Name{" "}
            </th>
            <th
              style={{ backgroundColor: "#450c36", color: "white" }}
              className="p-4"
            >
              Role
            </th>
            <th
              style={{ backgroundColor: "#450c36", color: "white" }}
              className="p-4"
            >
              Emp id
            </th>
            <th
              style={{ backgroundColor: "#450c36", color: "white" }}
              className="p-4"
            >
              Email
            </th>
            <th
              style={{
                backgroundColor: "#450c36",
                color: "white",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
              className="p-4"
            >
              Actions
            </th>
          </tr>
        </thead>
        <MDBTableBody>
          {records
            .filter((item) => {
              const searchTerm = search.toLowerCase();
              const employeeValue = item[filterType].toLowerCase();
              return employeeValue.includes(searchTerm);
            })
            .map((employee, index) => (
              <tr key={index} className="table-row">
                <td style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ marginRight: "8px" }}>
                    {employee.slack === localStorage.getItem("email") ? (
                      <span style={{ color: "rgba(145, 240, 145, 1)" }}>●</span>
                    ) : (
                      <span style={{ color: "gray" }}>●</span>
                    )}
                  </div>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    {employee.name}
                  </div>
                </td>
                <td>{employee.role}</td>
                <td>{employee.employeeCode}</td>
                <td>{employee.slack}</td>
                <td className="ho">
                  <Link>
                    <a style={{color:" rgb(42, 110, 218)"}}>
                      <BsPencilSquare
                        onClick={() => openForm(employee)}
                        className="ms-1 icon"
                      />
                    </a>
                  </Link>{" "}
                  <a style={{ color: "red" }}>
                  <BsFillTrash3Fill
                    onClick={() => handleDeleteButtonClick(employee._id)}
                    className="ms-2 icon"
                  />
                </a>
              </td>
              <Modal
                size="sm"
                show={smShow && deleteEmployeeId === employee._id}
                onHide={() => setSmShow(false)}
                aria-labelledby="example-modal-sizes-title-sm"
              >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            
          </Modal.Title>
        </Modal.Header>
        <Modal.Body ><h5 className="text-center" style={{marginTop:'-40px'}}>Are you sure you want to Delete ?</h5></Modal.Body>
        <Modal.Footer style={{marginTop:'-25px'}} >
          <Button variant="secondary" style={{ borderRadius: '10px',
          color:"white",marginLeft:"-50px"}} onClick={() => setSmShow(false)}>No, Cancel</Button>
          <Button variant="dark" style={{ borderRadius: '10px',
          color:"white"}}  onClick={() => handleDeleteEmployee(employee._id) }>Yes, Delete</Button>
        </Modal.Footer>
      </Modal>

              </tr>
              
            ))}
        </MDBTableBody>
        </MDBTable>
    <nav className=' fs-5 p-4 ' >
    <ul className='pagination  '>
    
      
    {
        numbers.map((n, i)=>(
          <li className={`page-item ${currentPage === n ? 'active' : ''}`}key={i}>
            <a className='page-link' onClick={()=>changeCpage(n)}>{n}</a>
          </li>

        ))
      }
   
    </ul>
  </nav>
      <EmployeeForm
        show={isFormOpen}
        handleClose={closeForm}
        handleAddEmployee={handleAddEmployee}
        employeeToEdit={employeeToEdit}
      />
      <ToastContainer autoClose={800}  position="top-center" />
      </Container>
  );

  //for pagenation

  function changeCpage(id){
    setCurrentPage(id)

  }
};
