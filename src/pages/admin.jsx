import { useState, useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Navbar from "../components/navbar";
import { auth } from "./firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, getDocs, deleteDoc, updateDoc } from "firebase/firestore";

const db = getFirestore();

function Admin() {
  const [teacherName, setTeacherName] = useState("");
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch teachers and students data when the component loads
    fetchTeachers();
    fetchStudentRequests();
  }, []);

  const fetchTeachers = async () => {
    const teacherCollection = await getDocs(collection(db, "teachers"));
    setTeachers(teacherCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchStudentRequests = async () => {
    const studentCollection = await getDocs(collection(db, "students"));
    setStudents(studentCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "teachers", user.uid), {
        name: teacherName,
        email: email,
        department: department,
        subject: subject,
        role: "teacher",
      });

      setSuccess("Teacher added successfully!");
      setTeacherName("");
      setEmail("");
      setDepartment("");
      setSubject("");
      fetchTeachers(); // Refresh teacher list
    } catch (error) {
      console.error("Error adding teacher:", error);
      setError(error.message);
    }
  };

  const handleDeleteTeacher = async (id) => {
    await deleteDoc(doc(db, "teachers", id));
    fetchTeachers(); // Refresh teacher list
  };

  const handleUpdateTeacher = async (id) => {
    // Logic to update a teacher's info in Firestore
    await updateDoc(doc(db, "teachers", id), {
      name: teacherName,
      department: department,
      subject: subject,
    });
    fetchTeachers(); // Refresh teacher list
  };


  return (
    <div>
      <Navbar />
      <Header />
      <div className="min-h-screen p-8 bg-gray-100 ">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto ">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>

          {/* Add Teacher Section */}
          <h3 className="text-xl font-semibold mb-4">Add Teacher</h3>
          <form onSubmit={handleAddTeacher}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="teacherName">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="teacherName"
                type="text"
                placeholder="Enter teacher's name"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                Department
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="department"
                type="text"
                placeholder="Enter department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="subject"
                type="text"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="email"
                type="email"
                placeholder="Enter teacher's email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Add Teacher
            </button>
          </form>

          {/* List of Teachers */}
          <h3 className="text-xl font-semibold mt-8 mb-4">Manage Teachers</h3>
          <ul>
            {teachers.map((teacher) => (
              <li key={teacher.id} className="mb-2 p-2 border rounded-lg bg-gray-100 flex justify-between items-center  ">
                <span>
                  {teacher.name} - {teacher.department} - {teacher.subject}
                </span>
                <div>
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded mr-2"
                    onClick={() => handleUpdateTeacher(teacher.id)}
                  >
                    Update
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
