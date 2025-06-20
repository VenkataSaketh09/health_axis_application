import React from 'react';
import {assets} from "../assets/assets"
const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            CONTACT <span className="text-blue-600">US</span>
          </h1>
        </div>

        {/* Main Content Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Image Section */}
          <div className="relative">
            <img 
              src={assets.contact_image}
              alt="Healthcare team - doctor and nurse with patient consultation"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Our Office Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                OUR OFFICE
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>00000 Willms Station</p>
                <p>Suite 000, Washington, USA</p>
              </div>
              <div className="mt-4 space-y-2 text-gray-700">
                <p>Tel: (000) 000-0000</p>
                <p>Email: <span className="text-blue-600">mvsaketh@gmail.com</span></p>
              </div>
            </div>

            {/* Careers Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                CAREERS AT Health Axis
              </h2>
              <p className="text-gray-700 mb-6">
                Learn more about our teams and job openings.
              </p>
              <button className="border-2 border-gray-900 text-gray-900 px-8 py-3 rounded hover:bg-gray-900 hover:text-white transition-colors duration-300 font-medium">
                Explore More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;