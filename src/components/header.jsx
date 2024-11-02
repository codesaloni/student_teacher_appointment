import studing from '../assets/studing.jpg';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="h-96 w-full relative">
      {/* Image container with overlay */}
      <div className="relative flex justify-center items-center h-full">
        <img src={studing} alt="Studying" className="object-cover w-full h-full" />
        
        {/* White overlay with opacity */}
        <div className="absolute inset-0 bg-blue-50 opacity-50"></div>
      </div>
    
      {/* Text on top of the image */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-black z-10">
        <h5 className="text-lg md:text-4xl font-semibold px-4 sm:px-0">
          The greatest sign of success is<br />
          a teacher student becoming<br />
          better than the teacher
        </h5>
    
        <div className="flex justify-center mt-6 gap-3">
          <Link to="/sighup"><button className="bg-black text-white py-3 px-6 rounded-full hover:bg-slate-800">
            Be a student
          </button></Link>
         <Link to="/login"><button className="bg-black text-white py-3 px-6 rounded-full hover:bg-slate-800">
            Find a Teacher
          </button></Link>
        </div>
      </div>
    </div>
  );
}

export default Header;
