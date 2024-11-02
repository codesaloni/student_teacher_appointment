import { useState, useEffect } from "react";
import Footer from "../components/footer";
import Header from "../components/header";
import Navbar from "../components/navbar";
import { auth } from "./firebase"; 
import { signOut } from "firebase/auth";
import { getFirestore, collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";

const db = getFirestore();

function Teacher() {
  const [appointments, setAppointments] = useState([]);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherProfile, setTeacherProfile] = useState({});
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  

  // Fetch current teacher profile and appointments when component mounts
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setTeacherEmail(currentUser.email);
      fetchTeacherProfile(currentUser.email);
    }
  }, []);

  // Auto-dismiss success/error messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Fetch teacher's profile based on email
  const fetchTeacherProfile = async (email) => {
    try {
      const teacherCollection = await getDocs(collection(db, "teachers"));
      const teacherData = teacherCollection.docs.find(doc => doc.data().email === email);
      if (teacherData) {
        const profileData = { id: teacherData.id, ...teacherData.data() };
        setTeacherProfile(profileData);
        
        // Fetch appointments and messages from teacher profile  (by teacher name))
        fetchTeacherAppointments(profileData.name);
        fetchTeacherMessages(profileData.name);
      }
    } catch (error) {
      console.error("Error fetching teacher profile:", error);
      setError("Failed to load teacher profile.");
    }
  };

  // Fetch appointments based on the teachers name
  const fetchTeacherAppointments = async (teacherName) => {
    try {
      const appointmentCollection = await getDocs(collection(db, "appointments"));
      const filteredAppointments = appointmentCollection.docs
        .filter(doc => doc.data().teacher === teacherName) // Filter by teacher name
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setAppointments(filteredAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Failed to load appointments.");
    }
  };

  // Fetch messages based on the teacher's name
  const fetchTeacherMessages = async (teacherName) => {
    try {
      const messagesCollection = await getDocs(collection(db, "messages"));
      const filteredMessages = messagesCollection.docs
        .filter(doc => doc.data().teacher === teacherName)
        .map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(filteredMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages.");
    }
  };


  // Update the status of the appointment
  const handleUpdateAppointmentStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status });
      setSuccess(`Appointment ${status} successfully.`);
      
      // Refresh the appointments after updating the status
      fetchTeacherAppointments(teacherProfile.name);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      setError("Failed to update appointment status.");
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
      <div className="min-h-screen p-8 bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Teacher Dashboard</h2>

          {/* Profile Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold">Profile Information</h3>
            {teacherProfile ? (
              <>
                <p><strong>Name:</strong> {teacherProfile.name}</p>
                <p><strong>Department:</strong> {teacherProfile.department}</p>
                <p><strong>Subject:</strong> {teacherProfile.subject}</p>
                <p><strong>Email:</strong> {teacherProfile.email}</p>
              </>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>

        

          {/* Appointments Section */}
          <h3 className="text-xl font-semibold">Approve/Cancel Appointments</h3>
          {appointments.length > 0 ? (
            <ul>
              {appointments.map((appointment) => (
                <li key={appointment.id} className="mb-4 p-4 border rounded-lg bg-gray-100">
                  <p><strong>Student:</strong> {appointment.studentName}</p>
                  <p><strong>Date:</strong> {appointment.date}</p>
                  <p><strong>Status:</strong> {appointment.status}</p>
                  <div className="mt-2">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded mr-2"
                      onClick={() => handleUpdateAppointmentStatus(appointment.id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                      onClick={() => handleUpdateAppointmentStatus(appointment.id, "rejected")}
                    >
                      Cancel
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments available.</p>
          )}

          {/* Messages Section */}
          <h3 className="text-xl font-semibold">View Messages</h3>
          {messages.length > 0 ? (
            <ul>
              {messages.map((message) => (
                <li key={message.id} className="mb-4 p-4 border rounded-lg bg-gray-100">
                  <p><strong>From:</strong> {message.studentName}</p>
                  <p><strong>Message:</strong> {message.message}</p>
                  {/* <p><strong>Date:</strong> {message.date}</p> */}
                </li>
              ))}
            </ul>
          ) : (
            <p>No messages available.</p>
          )}

          {/* Success/Error Messages */}
          {success && <p className="text-green-500 mt-4">{success}</p>}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
      <div className="flex justify-end mt-4">
  <button
    onClick={handleLogout}
    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded"
  >
    Logout
  </button>
</div>
      <Footer />
    </div>
  );
}

export default Teacher;
