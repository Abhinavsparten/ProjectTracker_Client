// EmployeeForm.js

import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addTeam } from "../../service/allapi";

// EmployeeForm component definition
const EmployeeForm = ({ show, handleClose, handleAddEmployee, employeeToEdit }) => {
  // Initial state for employee data
  const initialEmployeeState = {
    name: "",
    role: "",
    employeeCode: "",
    slack: "",
    isOnline: false,
  };

  // State to manage employee data
  const [employeeData, setEmployeeData] = useState(initialEmployeeState);
  
  // State to manage form validation errors
  const [errors, setErrors] = useState({});
   
  // Navigate function from react-router-dom
  const navigate = useNavigate();

  // Update form fields when employeeToEdit prop changes
  useEffect(() => {
    if (employeeToEdit) {
      setEmployeeData(employeeToEdit);
    } else {
      // If no employee to edit, reset the form
      setEmployeeData(initialEmployeeState);
    }
  }, [employeeToEdit]);

  // Event handler for input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    let errorMessage = "";

    // Additional specific validations for each field
    switch (name) {
      case "name":
        errorMessage = value.trim() === "" ? "Name is required" : !/^[a-zA-Z\s]+$/.test(value) ? "Name must be a string without numeric characters" : "";
        break;
      case "role":
        errorMessage = value.trim() === "" ? "Role is required" : !/^[a-zA-Z\s]+$/.test(value) ? "Role must be a string" : "";
        break;
      case "employeeCode":
        errorMessage = value.trim() === "" ? "Employee Code is required" : !/^\d+$/.test(value) ? "Employee Code must contain only numerical values" : "";
        break;
      case "slack":
        errorMessage = value.trim() === "" ? "Email is required " : !value.includes('@gmail') ? "Email must be valid" : "";
        break;
      default:
        errorMessage = "";
    }
    console.log(employeeData);

    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  // Event handler for save button click
  const handleSave = () => {
    const validationErrors = validateForm(employeeData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      handleAddEmployee(employeeData, !!employeeToEdit);
      handleClose();
      setEmployeeData(initialEmployeeState);
    }
  };

  // Form validation function
  const validateForm = (data) => {
    let errors = {};

    if (!data.name.trim()) {
      errors.name = "Name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(data.name)) {
      errors.name = "Name must be a string without numeric characters";
    }

    if (!data.role.trim()) {
      errors.role = "Role is required";
    } else if (!/^[a-zA-Z\s]+$/.test(data.role)) {
      errors.role = "Role must be a string";
    }

    if (!data.employeeCode.trim()) {
      errors.employeeCode = "Employee Code is required";
    } else if (!/^\d+$/.test(data.employeeCode)) {
      errors.employeeCode = "Employee Code must contain only numerical values";
    }

    if (!data.slack.trim()) {
      errors.slack = "Email is required ";
    } else if (!data.slack.includes('@gmail')) {
      errors.slack = "Email should be valid";
    }

    return errors;
  };
  
  // JSX rendering
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{employeeToEdit ? "Edit Team Member" : "Add Team Member"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              {/* Form group for Name */}
              <Form.Group controlId="name" >
              {employeeToEdit ? <Form.Label>Name</Form.Label> : <Form.Label> </Form.Label>}
                <Form.Control className="hov"
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={employeeData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col>
              {/* Form group for Role */}
              <Form.Group controlId="role">
              {employeeToEdit ? <Form.Label>Role</Form.Label> : <Form.Label> </Form.Label>}
                <Form.Control className="hov"
                  type="text"
                  placeholder="Role"
                  name="role"
                  value={employeeData.role}
                  onChange={handleChange}
                  isInvalid={!!errors.role}
                />
                <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              {/* Form group for Slack (Email) */}
              <Form.Group controlId="slack">
              {employeeToEdit ? <Form.Label>Email</Form.Label> : <Form.Label> </Form.Label>}
                <Form.Control className="hov"
                  type="text"
                  placeholder="Email Address"
                  name="slack"
                  value={employeeData.slack}
                  onChange={handleChange}
                  isInvalid={!!errors.slack}
                />
                <Form.Control.Feedback type="invalid">{errors.slack}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              {/* Form group for Employee Code */}
              <Form.Group controlId="employeeCode">
              {employeeToEdit ? <Form.Label>Employee Id</Form.Label> : <Form.Label> </Form.Label>}
                <Form.Control className="hov"
                  type="text"
                  placeholder="Employee id"
                  name="employeeCode"
                  value={employeeData.employeeCode}
                  onChange={handleChange}
                  isInvalid={!!errors.employeeCode}
                />
                <Form.Control.Feedback type="invalid">{errors.employeeCode}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Close button */}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {/* Save button */}
        <Button variant="dark" onClick={handleSave}>
          {employeeToEdit ? "Save" : "Add"}
        </Button>
      </Modal.Footer>
      {/* Toast container for notifications */}
      <ToastContainer position="top-center" />
    </Modal>
  );
};

export default EmployeeForm;

