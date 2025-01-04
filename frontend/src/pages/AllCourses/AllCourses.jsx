import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import AdminCreateCourse from "../CourseCreation/CourseCreation";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const AllCourses = () => {
  const [showModal, setShowModal] = useState(false); // For "Create Course" modal
  const [editModal, setEditModal] = useState(false); // For "Edit Course" modal
  const [selectedCourse, setSelectedCourse] = useState(null); // Course selected for editing
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const accessToken = localStorage.getItem('accessToken');

  // accessing the user role
  const role= localStorage.getItem('role');

  // Handlers for "Create Course" modal
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const MySwal = withReactContent(Swal);

  // Handlers for "Edit Course" modal
  const handleEditShow = (course) => {
    setSelectedCourse(course);
    setEditModal(true);
  };
  const handleEditClose = () => {
    setSelectedCourse(null);
    setEditModal(false);
  };

  
 // Delete course functionality
 const handleDelete = (courseId) => {
  MySwal.fire({
    title: "Are you sure?",
    text: "Do you really want to delete this course? This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const { data } = await axios.delete(
          `http://localhost:3000/api/v1/course/delete/${courseId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setSelectedCourse(""); // Clear the selected course
        MySwal.fire("Deleted!", "The course has been deleted.", "success");
        console.log(data);
      } catch (error) {
        console.error(error);
        MySwal.fire("Error!", "There was a problem deleting the course.", "error");
      }
    }
  });
};

  // Save updated course details
  const handleSaveEdit = () => {
    const updatedCourse = {
      name: selectedCourse.name,
      description: selectedCourse.description,
      teacherId: selectedCourse.teacherId || selectedCourse?.teacher?._id,
    };
  
    console.log(updatedCourse);
  
    const data = async () => {
      try {
        const { data } = await axios.put(
          `http://localhost:3000/api/v1/course/edit-all/${selectedCourse._id}`,
          updatedCourse,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log(data);
        setSelectedCourse("");
        handleEditClose();
  
        // Show success toast
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Changes saved successfully!",
          showConfirmButton: false,
          timer: 3000,
        });
      } catch (error) {
        console.error(error);
  
        // Show error toast
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Failed to save changes.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    };
    data();
  };

  // Fetch courses and teachers
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/api/v1/course/all-courses', {
          headers: { "Authorization": `Bearer ${accessToken}` }
        });
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:3000/api/v1/user/users-role",
          { role: "teacher" },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setTeachers(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCourses();
    fetchTeachers();
  }, [selectedCourse, showModal]);

  return (
    <div className="container mt-3">
      <div className="text-end">
        <Button variant="primary" onClick={handleShow} className="mb-3">
          Create Course
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            {role==="admin"? <th>Course ID</th>:null}
            <th>Teacher Name</th>
            <th>No. of Enrolled Students</th>
            <th>No. of Quizzes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course._id}>
              <td>{course.name}</td>
              {role==="admin"?<td>{course._id}</td>:null}
              <td>{course.teacher.fullName}</td>
              <td>{course.students.length}</td>
              <td>{course.quizzes.length}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEditShow(course)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Course Modal */}
      <Modal show={editModal} onHide={handleEditClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formCourseName">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedCourse?.name || ""}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCourseDescription">
              <Form.Label>Course Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={selectedCourse?.description || ""}
                onChange={(e) =>
                  setSelectedCourse({ ...selectedCourse, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTeacher">
              <Form.Label>Select Teacher</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourse?.teacherId || selectedCourse?.teacher?._id}
                onChange={(e) =>{                  
                  setSelectedCourse({ ...selectedCourse, teacherId: e.target.value })}
                }
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.fullName}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleEditClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Course Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title >Create Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AdminCreateCourse onSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AllCourses;


