// TeamContent.js

import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Dropdown,
  Form,
} from "react-bootstrap";
import TeamForm from "./TeamForm";
import { CiFilter } from "react-icons/ci";
import { capitalize } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MDBTable, MDBTableBody, MDBTableHead } from "mdbreact";
import {
  BsPencilSquare,
  BsFillTrash3Fill,
  BsJustify,
  BsSearch,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import {
  addTracker,
  deleteTracker,
  getSingleEmpEdit,
  getallTracker,
  updateTracker,
} from "../../service/allapi";
import { MdOutlineFilterAlt } from "react-icons/md";
import TeamEdit from "./TeamEdit";

export const TeamContent = ({ OpenSidebar }) => {
  const [team, setTeam] = useState([]);

  //for delete confirm modal
  const [smShow, setSmShow] = useState(false);

  const [smShows, setSmShows] = useState(false);

  const [isFormOpen, setFormOpen] = useState(false);

  const [isFormOpens, setFormOpens] = useState(false);
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [filterText, setFilterText] = useState("Filter");
  // State to track the ID of the team for which delete confirmation modal is open
  const [deleteTeamId, setDeleteTeamId] = useState(null);

  //for pagenation
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 8;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = teams.slice(firstIndex, lastIndex);
  const npages = Math.ceil(teams.length / recordsPerPage);
  const numbers = [...Array(npages + 1).keys()].slice(1);

  const openForm = () => {
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
  };

  const openForms = async (v) => {
    setFormOpens(true);
    const response = await getSingleEmpEdit(v);
    console.log(response.data);
    setTeam(response.data);
  };

  const closeFormss = () => {
    setFormOpens(false);
  };

  // Function to call the API and get all projects
  const getallTeam = async () => {
    const response = await getallTracker(teams);
    console.log(response.data);
    setTeams(response.data);
  };

  // Function to handle clicking on the delete button
  const handleDeleteButtonClick = (teamId) => {
    setDeleteTeamId(teamId);
    setSmShow(true);
  };

  // Function to handle deleting a team
  const handleDeleteTeam = async (id) => {
    try {
      const response = await deleteTracker(id);
      if (response.status === 200) {
        toast.success(response.data.message);
        setSmShow(false);
        getallTeam();
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error deleting team", error);
    }
  };

  const handleFilterSelect = (type, text) => {
    setFilterType(type);
    setFilterText(text);
  };
  // useEffect hook to fetch all employees on component mount
  useEffect(() => {
    getallTeam();
  }, [teams]);

  const updateTeamInState = (updatedTeamData) => {
    // Update the team data in the local state
    setTeams((prevTeams) => {
      const updatedTeams = prevTeams.map((team) =>
        team._id === updatedTeamData._id ? updatedTeamData : team
      );
      return updatedTeams;
    });
  };

 

  return (
    <Container>
      <Row className="mb-3">
        <Col className="text-start">
          <div className="menu-icon">
            <BsJustify className="icon" onClick={OpenSidebar} />
          </div>
          <h1 className="mb-2">Teams</h1>
        </Col>
        <Col className="text-end">
          <Button
            variant="dark"
            onClick={() => openForm(null)}
            style={{ fontSize: "17px", width: "150px" }}
          >
            Add Team
          </Button>
        </Col>
      </Row>
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
                fontWeight: "normal",
              }}
              id="dropdown-basic"
            >
              <MdOutlineFilterAlt id="filter-icon" /> {filterText}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleFilterSelect("name", "Name")}>
               Name
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleFilterSelect("employeeCode", "Emp id")}
              >
                Emp Id
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleFilterSelect("techStack", "Tech stack")}
              >
               Tech Stack
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleFilterSelect("project", "Project")}
              >
                Project
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleFilterSelect("percentage", "Percentage")}
              >
                Percentage
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleFilterSelect("priority", "Priority")}
              >
                Priority
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
      <MDBTable responsive className="mt-3 h">
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
              Name
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
              Tech stack
            </th>
            <th
              style={{ backgroundColor: "#450c36", color: "white" }}
              className="p-4"
            >
              Project
            </th>
            <th
              style={{ backgroundColor: "#450c36", color: "white" }}
              className="p-4"
            >
              Percentage
            </th>
            <th
              style={{ backgroundColor: "#450c36", color: "white" }}
              className="p-4"
            >
              Priority
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
              Action
            </th>
          </tr>
        </thead>
        <MDBTableBody>
          {records
            .filter((team) => {
              const searchTerm = search.toLowerCase();
              const teamValue = filterType === 'percentage' ? team[filterType].toString() : team[filterType].toLowerCase();
              return teamValue.includes(searchTerm);
            })
            .map((team, index) => (
              <tr key={team._id} className="table-row">
                <td className="table-cell">{team.name}</td>
                <td className="table-cell">{team.employeeCode}</td>
                <td className="table-cell">{team.techStack}</td>
                <td className="table-cell">{team.project}</td>
                <td className="table-cell">{team.percentage} %</td>
                <td className="table-cell">{team.priority}</td>

                <td className="ho">
                  <Link>
                    <a style={{ color: " rgb(42, 110, 218)" }}>
                      <BsPencilSquare
                        onClick={() => openForms(team._id)}
                        className=" ms-1 icon"
                      />
                    </a>
                  </Link>{" "}
                  <a style={{ color: "red" }}>
                    <BsFillTrash3Fill
                      onClick={() => handleDeleteButtonClick(team._id)}
                      className="ms-2 icon"
                    />
                                
                  </a>
                  <Modal
                    size="sm"
                    show={smShow && deleteTeamId === team._id}
                    onHide={() => setSmShow(false)}
                    aria-labelledby="example-modal-sizes-title-sm"
                  >
                    <Modal.Header closeButton>
                      <Modal.Title id="example-modal-sizes-title-sm"></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <h5
                        className="text-center"
                        style={{ marginTop: "-40px" }}
                      >
                        Are you sure you want to Delete ?
                      </h5>
                    </Modal.Body>
                    <Modal.Footer style={{ marginTop: "-25px" }}>
                      <Button
                        variant="secondary"
                        style={{
                          borderRadius: "10px",
                          color: "white",
                          marginLeft: "-50px",
                        }}
                        onClick={() => setSmShow(false)}
                      >
                        No, Cancel
                      </Button>
                      <Button
                        variant="dark"
                        style={{ borderRadius: "10px", color: "white" }}
                        onClick={() => handleDeleteTeam(team._id)}
                      >
                        Yes, Delete       
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
              </tr>
            ))}
        </MDBTableBody>
      </MDBTable>

      <nav className=" fs-5 p-4 ">
        <ul className="pagination  ">
          {numbers.map((n, i) => (
            <li
              className={`page-item ${currentPage === n ? "active" : ""}`}
              key={i}
            >
              <a className="page-link " onClick={() => changeCpage(n)}>
                {n}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <TeamForm show={isFormOpen} handleClose={closeForm} />
      <TeamEdit shows={isFormOpens} handleClose={closeFormss} team={team} updateTeamInState={updateTeamInState} />
      <ToastContainer autoClose={800} position="top-center" />
    </Container>
  );
  //for pagenation

  function changeCpage(id) {
    setCurrentPage(id);
  }
};

export default TeamContent;
