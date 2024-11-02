import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Header from "../components/header";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Footer from "../components/footer";

const auth = getAuth();
const db = getFirestore();


function Student() {
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appointmentTeacher, setAppointmentTeacher] = useState("");
  const [messageTeacher, setMessageTeacher] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [studentName, setStudentName] = useState(""); // State to hold the logged-in student's name

  // Fetch the current logged-in user's details
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If the user has a display name, set it; otherwise use the email
        setStudentName(user.displayName || user.email);
      } else {
        // No user is signed in, redirect to login page or handle accordingly
        console.log("No user is signed in");
      }
    });

    // Cleanup the listener on unmount
    return () => unsubscribe();
  }, []);

  // Fetch teachers data from Firestore
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const teacherCollection = await getDocs(collection(db, "teachers"));
        setTeachers(teacherCollection.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };

    fetchTeachers();
  }, []);

  // Handle appointment booking
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, "appointments"), {
        teacher: appointmentTeacher,
        date: new Date().toISOString(),
        studentName: studentName, // Use the logged-in student's name
      });
      
      setSuccessMessage(`Appointment booked with ${appointmentTeacher}`);
      setAppointmentTeacher(""); // Clear after booking
    } catch (err) {
      console.error("Error booking appointment:", err);
    }
  };

  // Handle message sending
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    try {
      await addDoc(collection(db, "messages"), {
        teacher: messageTeacher,
        message: messageContent,
        date: new Date().toISOString(),
        studentName: studentName, // Use the logged-in student's name
      });
      
      setSuccessMessage(`Message sent to ${messageTeacher}`);
      setMessageContent(""); // Clear after sending message
      setMessageTeacher(""); // Reset selected teacher
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <div> 
      <Navbar />
      <Header />
      <div className="border-4 gap-36 p-4">
        {/* Search Teachers Section */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search Teachers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          />
        </div>

        {/* Teachers List */}
        <h2 className="text-xl font-bold mb-2">Teachers</h2>
        <table className="table-fixed w-full mb-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Subject</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.length > 0 ? (
              teachers.filter((teacher) => 
                teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.name}</td>
                  <td>{teacher.department}</td>
                  <td>{teacher.subject}</td>
                  <td >
                    <button 
                      className="bg-blue-500 text-white px-3 py-1 rounded "
                      onClick={() => setAppointmentTeacher(teacher.name)}
                    >
                      Bookapp
                    </button>
                    <button 
                      className="bg-green-500 text-white px-3 py-1 rounded lg:ml-2"
                      onClick={() => setMessageTeacher(teacher.name)}
                    >
                      Message
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No teachers found</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Book Appointment Form */}
        {appointmentTeacher && (
          <form onSubmit={handleBookAppointment} className="mb-4">
            <h3 className="font-semibold">Booking Appointment with: {appointmentTeacher}</h3>
            <button className="bg-blue-500 text-white px-2 py-1 rounded mt-2" type="submit">
              Confirm Appointment
            </button>
          </form>
        )}

        {/* Send Message Form */}
        {messageTeacher && (
          <form onSubmit={handleSendMessage} className="mb-4">
            <h3 className="font-semibold">Sending Message to: {messageTeacher}</h3>
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message..."
              className="border rounded px-2 py-1 w-full h-24"
              required
            ></textarea>
            <button className="bg-green-500 text-white px-2 py-1 rounded mt-2" type="submit">
              Send Message
            </button>
          </form>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="text-green-500 font-semibold">{successMessage}</div>
        )}
      </div>
      <div className="flex justify-end mt-4">
  <button
    onClick={handleLogout}
    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded"
  >
    Logout
  </button>
</div>
          <Footer/>
    </div>
  );
}

export default Student;


