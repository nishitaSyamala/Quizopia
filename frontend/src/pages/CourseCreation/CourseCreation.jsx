import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";


const AdminCreateCourse = ({onSuccess}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [errors, setErrors] = useState({});
  const accessToken = localStorage.getItem('accessToken');


  // Mock Data
    const [teachers,setTeachers] = useState([])

  // Validation
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Course name is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!teacherId) newErrors.teacherId = "Teacher selection is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form Submission
  const MySwal = withReactContent(Swal);

const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    const values = {
      name,
      description,
      teacherId,
    };

    const data = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const { data } = await axios.post(
          "http://localhost:3000/api/v1/course/create",
          values,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        console.log(data);

        // Show success toast
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Course created successfully!",
          showConfirmButton: false,
          timer: 3000,
        });

        // Clear form and errors
        setName("");
        setDescription("");
        setErrors({});
        onSuccess(); // Close the modal or handle success as needed
      } catch (error) {
        console.error(error);

        // Show error toast
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Failed to create the course.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    };

    data();
  }
};

  useEffect(() => {
    const data = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:3000/api/v1/user/users-role",
          { role: "teacher" },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        setTeachers(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    data();
  }, []);

  return (
    <div className="px-2 py-2" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Course Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        <div className="mb-3">
          <label>Course Description</label>
          <textarea
            rows="5"
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="mb-3">
          <label>Select Teacher</label>
          <select
            className={`form-control ${errors.teacherId ? "is-invalid" : ""}`}
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          >
            <option value="">-- Select Teacher --</option>
            {teachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullName}
              </option>
            ))}
          </select>
          {errors.teacherId && (
            <div className="invalid-feedback">{errors.teacherId}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary">
          Create Course
        </button>
      </form>
    </div>
  );
};

export default AdminCreateCourse;
