import {Link} from "react-router-dom"

function Navbar() {
  return (
    <div><nav className="bg-gray-800">
    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
       
          <button type="button" className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
            <span className="absolute -inset-0.5"></span>
            <span className="sr-only">Open main menu</span>
           
            
            
            
          </button>
        </div>
        <div className="flex flex-1 sm:items-stretch sm:justify-start">
          <div className="flex flex-shrink-0 items-center">
            <h1 className='text-white text-xl'>EduBook</h1>
          </div>
          <div className="hidden sm:ml-6 sm:block">
            <div className="flex space-x-4">
             
            <Link to="/" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Home</Link>

            </div>
          </div>
        </div>
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
         
  
    
          <div className="relative ml-3">
            <div>
            <Link to="/sighup" className="text-white">Login/Signup</Link>
            </div>
  
            
          </div>
        </div>
      </div>
    </div>

    <div className="sm:hidden" id="mobile-menu">
      <div className="space-y-1 px-2 pb-3 pt-2">
       
        <Link to="/" className="block rounded-md bg-gray-900 px-3 py-2 text-base font-medium text-white" aria-current="page">Home</Link>

       
      </div>
    </div>
  </nav></div>
  )
}

export default  Navbar