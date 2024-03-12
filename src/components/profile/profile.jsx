// Profile.js

import React, { useEffect, useState } from "react";

import { Container, Row, Col, Offcanvas, Button } from "react-bootstrap";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { ProjectsContent } from "../Projects/ProjectsContent";
import { EmployeesContent } from "../Employees/EmployeesContent";
import { TeamContent } from "../Team/TeamContent";
import { IoMenu } from "react-icons/io5";
import {Dashboard} from "../Dashboard/Dashboard"
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userInactive, setUserInactive] = useState(false);
  const navigate = useNavigate();


const handleSectionChange = (section) => {
  setActiveSection(section);
  setShowSidebar(false);
};

const checkTokenExpiration = () => {
  // Get the token from local storage
  const token = localStorage.getItem('jwtToken');

  // Check if the token is present
  if (token) {
    // Decode the token to get expiration time
    const decodedToken = jwtDecode(token);

    // Check if the token has expired
    if (decodedToken.exp * 1000 < Date.now()) {
      // Token is expired, perform logout
      handleLogout();
    }
  }
};

// Check token expiration on component mount
useEffect(() => {
  checkTokenExpiration();
}, []);



const handleLogout = () => {
  // Check if email and JWT token are present in local storage
  const userEmail = localStorage.getItem("email");
  const userToken = localStorage.getItem("jwtToken");

  if (!userEmail && !userToken) {
    // If not available, navigate to home page
    navigate("/");
  }

  // If available, clear local storage and perform additional logout actions if needed
  localStorage.removeItem("email");
  localStorage.removeItem("jwtToken");
  // Perform additional logout actions if needed
  navigate("/");
};

  const getButtonClassName = (section) => {
    return `nav-link text-white ${activeSection === section ? "active" : ""}`;
  };


  return (
    <Container fluid className="profile-container ">
      <Row className="h-100">
        {/* Sidebar */}
        <Col 
          md={3}
          className={`dev text-white p-4 h-100  ${
            showSidebar ? "sidebar-responsive" : ""
          }`}
        >
          <ul id="center" className="nav nav-pills flex-column">
            <li 
              className={`nav-item mb-1  mt-4 d-flex align-items-center ${getButtonClassName(
                "dashboard"
              )}`}
            >
              <button
                className={getButtonClassName("dashboard")}
                onClick={() => handleSectionChange("dashboard")} title="Dashboard"
              >
                Dashboard
              </button>
            </li>
            <li 
              className={`nav-item mb-1   d-flex mt-2 align-items-center ${getButtonClassName(
                "projects"
              )}`}
            >
              <button
                className={getButtonClassName("projects")}
                onClick={() => handleSectionChange("projects")} title="Projects"
              >
                Projects
              </button>
            </li>
            <li 
              className={`nav-item mb-1  mt-2 d-flex align-items-center ${getButtonClassName(
                "employees"
              )}`}
            >
              <button
                className={getButtonClassName("employees")}
                onClick={() => handleSectionChange("employees")} title="Team Members"
              >
                Team Members
              </button>
            </li>
            <li 
              className={`nav-item mb-1  mt-2 d-flex align-items-center ${getButtonClassName(
                "team"
              )}`}
            >
              <button
                className={getButtonClassName("team")}
                onClick={() => handleSectionChange("team")} title="Tracker"
              >
                Tracker
              </button>
            </li>
            <li 
              className={`nav-item mb-1  mt-2 d-flex align-items-center ${getButtonClassName(
                "logout"
              )}`}
            >
              <button
                className={getButtonClassName("logout")}
                onClick={handleLogout} title="Tracker"
              >
                Logout
              </button>
            </li>
          </ul>
        </Col>

        {/* Main Content */}
        <Col md={9}  className="p-4  bg-light h-100 overflow-y-auto">
          <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)}>
            <Offcanvas.Header
              closeButton
              style={{
                backgroundColor: "#450c36",
                color: "white",
                border: "none",
                zIndex: "1000",
              }}
            >
              <Offcanvas.Title>Inhouse</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body 
              style={{
                backgroundColor: "#450c36",
                fontSize: "19px",
                fontWeight: "500",
              }}
            >
              <ul    className="nav nav-pills  flex-column">
                <li 
                  className={`nav-item mb-2 d-flex  ${getButtonClassName(
                    "dashboard"
                  )}`}
                >
                  <button 
                    className={getButtonClassName("dashboard")}
                    onClick={() => handleSectionChange("dashboard")}
                  >
                    Dashboard
                  </button>
                </li>
                <li
                  className={`nav-item mb-2 d-flex  ${getButtonClassName(
                    "projects"
                  )}`}
                >
                  <button
                    className={getButtonClassName("projects")}
                    onClick={() => handleSectionChange("projects")}
                  >
                    Projects
                  </button>
                </li>
                <li
                  className={`nav-item mb-2 d-flex  ${getButtonClassName(
                    "employees"
                  )}`}
                >
                  <button
                    className={getButtonClassName("employees")}
                    onClick={() => handleSectionChange("employees")}
                  >
                    Team Members
                  </button>
                </li>
                <li
                  className={`nav-item mb-2 d-flex  ${getButtonClassName(
                    "team"
                  )}`}
                >
                  <button
                    className={getButtonClassName("team")}
                    onClick={() => handleSectionChange("team")}
                  >
                    Tracker
                  </button>
                </li>
                <li
                  className={`nav-item mb-2 d-flex   ${getButtonClassName(
                    "logout"
                  )}`}
                >
                  <button
                    className={getButtonClassName("logout")}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </Offcanvas.Body>
          </Offcanvas>

          {/* Main Content based on the selected section */}
          {activeSection === "dashboard" && (
            <Dashboard OpenSidebar={() => setShowSidebar(true)} />
          )}
          {activeSection === "projects" && (
            <ProjectsContent OpenSidebar={() => setShowSidebar(true)} />
          )}
          {activeSection === "employees" && (
            <EmployeesContent OpenSidebar={() => setShowSidebar(true)} />
          )}
          {activeSection === "team" && (
            <TeamContent OpenSidebar={() => setShowSidebar(true)} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
