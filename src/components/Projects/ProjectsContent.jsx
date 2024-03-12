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
import "./project.css";
import { Link } from 'react-router-dom';
import { CiFilter } from "react-icons/ci";
import ProjectForm from "./ProjectForm";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment';
import { MDBTable, MDBTableBody } from 'mdbreact';
import { BsPencilSquare, BsFillTrash3Fill, BsJustify } from 'react-icons/bs'
import { addProject, deleteProject, getallProjects, updateProject } from "../../service/allapi";
import { IoSearchSharp } from "react-icons/io5";
import { MdOutlineFilterAlt } from "react-icons/md";

// ProjectsContent component definition
export const ProjectsContent = ({ OpenSidebar }) => {
  // State management
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [smShow, setSmShow] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('projectName');
  const [filterText, setFilterText] = useState('Filter');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = projects.slice(firstIndex, lastIndex);
  const npages = Math.ceil(projects.length / recordsPerPage);
  const numbers = [...Array(npages + 1).keys()].slice(1);

  // Function to open the project form
  const openForm = (project) => {
    setProjectToEdit(project);
    setFormOpen(true);
  };

  // Function to close the project form
  const closeForm = () => {
    setProjectToEdit(null);
    setFormOpen(false);
  };

  // Function to handle delete button click and set the project ID to be deleted
  const handleDeleteClick = (projectId) => {
    setDeleteProjectId(projectId);
    setSmShow(true);
  };

  // Function to handle delete Project
  const handleDeleteProject = async (id) => {
    // API call for delete Project
    const response = await deleteProject(id);
    if (response.status === 200) {
      toast.success(response.data.message);
      setSmShow(false);
      getAllProjects();
    } else {
      toast.error(response.data.message);
    }
  };

  // Function to handle filter type selection
  const handleFilterSelect = (type, text) => {
    setFilterType(type);
    setFilterText(text);
  };

  // Function to call the API and get all projects
  const getAllProjects = async () => {
    const response = await getallProjects();
    setProjects(response.data);
  }

  //Capitalize the first letter
  const capitalizeString = (str) => {
    if (typeof str !== 'string') {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Function to handle adding or editing a project
  const handleAddProject = async (newProject, isEdit) => {
    // Capitalize the first letter of projectName, clientName, projectType, and resources
    newProject.projectName = capitalizeString(newProject.projectName);
    newProject.clientName = capitalizeString(newProject.clientName);
    newProject.projectType = capitalizeString(newProject.projectType);
  
  
    try {
      if (isEdit) {
        // If editing, make an API call to update the project
        const response = await updateProject(newProject._id, newProject);
  
        if (response && response.status === 200) {
          getAllProjects()
          // Update the corresponding project in the state
          setProjects((prevProjects) =>
            prevProjects.map((project) =>
              project._id === newProject._id ? newProject : project
            )
          );
          toast.success(response.data && response.data.message);
        } else {
          toast.error(response && response.data && response.data.message || 'Unknown error occurred');
        }
      } else {
        // If adding new, make an API call to add the project
        const response = await addProject(newProject);
        if (response && response.status === 200) {
          getAllProjects()
          // Add the new project to the state with the returned id
          setProjects((prevProjects) => [
            ...prevProjects,
            { ...newProject, _id: response.data && response.data.id },
          ]);
          toast.success(response.data && response.data.message);
        } else {
          toast.error(response && response.data && response.data.message || 'Unknown error occurred');
        }
      }
    } catch (error) {
      console.error('Error updating/adding project:', error);
      toast.error('Error updating/adding project. Please try again.');
    }
  };
  

  // useEffect hook to fetch all projects on component mount
  useEffect(() => {
    getAllProjects();
  }, []);

  // JSX rendering
  return (
    <Container>
      <Row className="mb-3">
        <Col className="text-start">
          <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
          </div>
          <h1 className="mb-4">Projects</h1>
        </Col>
        <Col className="text-end">
          <Button variant="dark" onClick={() => openForm(null)} style={{ fontSize: "17px", width: "150px" }}>
            Add Project
          </Button>
        </Col>
        <Row className="mb-2 justify-content-start">
          <Col md="auto" className="text-start">
            <Dropdown className="hov">
              <Dropdown.Toggle
                style={{
                  fontSize: "16px",
                  padding: "7px",
                  backgroundColor: "#f5f0f0",
                  color: "rgb(50, 49, 49)",
                  border: "none",
                  fontWeight: "normal"
                }}
                id="dropdown-basic"
              >
                <MdOutlineFilterAlt id="filter-icon" /> {filterText}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleFilterSelect('projectName', 'Project Name')}>Project Name</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterSelect('clientName', 'Client Name')}>Client Name</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterSelect('startDate', 'Start Date')}>Start Date</Dropdown.Item>
                <Dropdown.Item onClick={() => handleFilterSelect('endDate', 'End Date')}>End Date</Dropdown.Item>
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
      <MDBTable responsive className="p-3 h">
        <thead className="tp" >
          <tr >
            <th style={{
              backgroundColor: "#450c36", color: "white",
              borderTopLeftRadius: "10px", borderBottomLeftRadius: "10px"
            }} className="p-4" >Project Name </th>
            <th style={{ backgroundColor: "#450c36", color: "white", }} className="p-4" >Client Name</th>
            <th style={{ backgroundColor: "#450c36", color: "white" }} className="p-4" >Start Date
              <div className="arrow">
                <div class="up-arrow" onclick="clickupArrow()">

                </div>
                <div class="down-arrow" onclick="clickDownArrow()">

                </div>
              </div>
            </th>
            <th style={{ backgroundColor: "#450c36", color: "white" }} className="p-4" >End Date
              <div className="arrow">
                <div class="up-arrow" onclick="clickupArrow()">

                </div>
                <div class="down-arrow" onclick="clickDownArrow()">

                </div>
              </div>
            </th>
            <th style={{ backgroundColor: "#450c36", color: "white" }} className="p-4" >Proj.Type</th>
            <th style={{ backgroundColor: "#450c36", color: "white" }} className="p-4" >#Resources</th>
            <th style={{
              backgroundColor: "#450c36", color: "white",
              borderTopRightRadius: "10px", borderBottomRightRadius: "10px"
            }} className="p-4" >Actions</th>

          </tr>
        </thead>
        <MDBTableBody>
          {records.filter((item) => {
            const searchTerm = search.toLowerCase();
            const projectValue = item[filterType].toLowerCase();
            return projectValue.includes(searchTerm);
          }).map((project, index) => (
            <tr key={index} className="table-row" >
              <td>{project.projectName}</td>
              <td>{project.clientName}</td>
              <td>{moment(project.startDate).format("DD-MM-YYYY")}</td>
              <td>{moment(project.endDate).format("DD-MM-YYYY")}</td>
              <td>{project.projectType}</td>
              <td>{project.resources}</td>

              <td className="ho">
                <Link>
                  <a style={{ color: " rgb(42, 110, 218)" }}>
                    <BsPencilSquare onClick={() => openForm(project)} className=' ms-1 icon' />
                  </a>
                </Link>{" "}
                <a style={{ color: "red" }} onClick={() => handleDeleteClick(project._id)}>
                  <BsFillTrash3Fill className='ms-2 icon' />
                </a>
                <Modal
                  size="sm"
                  show={smShow && deleteProjectId === project._id}
                  onHide={() => setSmShow(false)}
                  aria-labelledby="example-modal-sizes-title-sm"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-sm"></Modal.Title>
                  </Modal.Header>
                  <Modal.Body ><h5 className="text-center" style={{ marginTop: '-40px' }}>Are you sure you want to Delete?</h5></Modal.Body>
                  <Modal.Footer style={{ marginTop: '-25px' }} >
                    <Button variant="secondary" style={{
                      borderRadius: '10px',
                      color: "white", marginLeft: "-50px"
                    }} onClick={() => setSmShow(false)}>No, Cancel</Button>
                    <Button variant="dark" style={{
                      borderRadius: '10px',
                      color: "white"
                    }} onClick={() => handleDeleteProject(project._id)}>Yes, Delete</Button>
                  </Modal.Footer>
                </Modal>
              </td>
            </tr>
          ))}
        </MDBTableBody>
      </MDBTable>
      <nav className=' fs-5 p-4 ' >
        <ul className='pagination  '>
          {
            numbers.map((n, i) => (
              <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={i}>
                <a className='page-link ' onClick={() => changeCpage(n)}>{n}</a>
              </li>
            ))
          }
        </ul>
      </nav>
      <ProjectForm show={isFormOpen} handleClose={closeForm} handleAddProject={handleAddProject} projectToEdit={projectToEdit} />
      <ToastContainer autoClose={800} position="top-center" />
    </Container>
  );
  //for pagination
  function changeCpage(id) {
    setCurrentPage(id);
  }
};

export default ProjectsContent;