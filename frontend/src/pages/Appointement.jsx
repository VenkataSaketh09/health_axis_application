import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from "../context/AppContext"
import BookAppointement from '../components/BookAppointement';

const Appointement = () => {
  const { docId } = useParams();
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Get the doctor data based on ID from params
  const doctor = doctors.find(doc => doc._id === docId);
  
  // Get suggested doctors with same specialty (excluding current doctor)
  const suggestedDoctors = doctors
    .filter(doc => doc._id !== docId && doc.speciality === doctor?.speciality)
    .slice(0, 4);

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor not found</h2>
          <p className="text-gray-600">The doctor you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Details</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Doctor Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Doctor Image */}
                <div className="flex-shrink-0">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-64 h-80 object-cover rounded-lg"
                  />
                </div>
                
                {/* Doctor Info */}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{doctor.name}</h2>
                  
                  {/* Experience */}
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-600">{doctor.experience} of Experience</span>
                  </div>
                  
                  {/* Address */}
                  <div className="flex items-start mb-4">
                    <svg className="w-5 h-5 text-gray-400 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-600">
                      {doctor.address}
                    </span>
                  </div>
                  
                  {/* Speciality Badge */}
                  <div className="mb-6">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                      {doctor.speciality}
                    </span>
                  </div>
                  
                  {/* Social Media Links */}
                  <div className="flex gap-3 mb-6">
                    <a href="#" className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center hover:bg-blue-900 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </a>
                  </div>
                  
                  {/* Book Appointment Component - Pass doctor data as props */}
                  <BookAppointement doctor={doctor} />
                </div>
              </div>
            </div>
            
            {/* About Me Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">About Me</h3>
              <p className="text-gray-600 leading-relaxed">
                {doctor.about}
              </p>
            </div>
          </div>
          
          {/* Suggestions Sidebar */}
          <div className="w-full lg:w-80">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Suggestions</h3>
              
              <div className="space-y-4">
                {suggestedDoctors.length > 0 ? (
                  suggestedDoctors.map((suggestedDoc) => (
                    <div onClick={() => navigate(`/appointment/${suggestedDoc._id}`)} key={suggestedDoc._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <img
                        src={suggestedDoc.image}
                        alt={suggestedDoc.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                            {suggestedDoc.speciality}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 text-sm">{suggestedDoc.name}</h4>
                        <p className="text-xs text-blue-600 font-medium">{suggestedDoc.experience}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No other doctors found with the same specialty</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointement;