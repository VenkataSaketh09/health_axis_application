import { useContext, useEffect } from "react"
import { AdminContext } from "../../context/AdminContext"

const DoctorsList = () => {
  const { aToken, getAllDoctors, doctors,changeAvailability } = useContext(AdminContext)
  
  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">All Doctors</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {doctors.map((doctor, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
            {/* Doctor Image */}
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-500 group-hover:to-indigo-600 p-8 flex items-center justify-center transition-all duration-500">
              <img 
                src={doctor.image} 
                alt={doctor.name}
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Doctor Info */}
            <div className="p-6 bg-white">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {doctor.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 capitalize">
                {doctor.speciality}
              </p>
              
              {/* Availability Status */}
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  checked={doctor.available}
                  onClick={()=>changeAvailability(doctor._id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className={`text-sm font-medium text-gray-800`}>
                  Available
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {doctors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">No doctors found</div>
          <div className="text-gray-500 text-sm">Please check back later</div>
        </div>
      )}
    </div>
  )
}

export default DoctorsList