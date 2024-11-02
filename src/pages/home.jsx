import Navbar from '../components/navbar';
import Header from '../components/header';
import Footer from '../components/footer';
import { db } from "./firebase";
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

function Home() {
  const [teachers, setTeachers] = useState([]); // Renamed to 'teachers' since it's an array

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const mydata = await getDocs(collection(db, "teachers"));
        const teacherList = mydata.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTeachers(teacherList); // Set the list of teachers
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };
    fetchTeachers(); // Make sure to call the function to fetch the data
  }, []);

  return (
    <div>
      <Navbar />
      <Header />
      <h1 className='container text-[40px] text-center mt-9'>Our Teachers</h1>
      <p className='text-base lg:text-xl py-4 px-4 lg:px-40'>
        Our faculty consists of experts in their respective fields, boasting a minimum of 2 years of work experience. They are passionate about sharing their knowledge and expertise to foster a dynamic learning environment.
      </p>

      {/* Loop through the teachers array to display each teacher */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map(teacher => (
          <div key={teacher.id} className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white text-black">
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-black">{teacher.name}</div>
              <p className="text-gray-700 text-base">Subject:{teacher.subject}</p>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
}

export default Home;
