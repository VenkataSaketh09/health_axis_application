import React from "react";
import { assets } from "../assets/assets";
const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ABOUT <span className="text-blue-600">US</span>
          </h1>
        </div>

        {/* Main Content Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image Section */}
          <div className="relative">
            <img
              src={assets.about_image}
              alt="Healthcare professionals - doctor and nurse smiling"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed">
              Welcome to Health Axis, your trusted partner in managing your
              healthcare needs conveniently and efficiently. At Health Axis, we
              understand the challenges individuals face when it comes to
              scheduling doctor appointments and managing their health records.
            </p>

            <p className="text-gray-700 leading-relaxed">
              Health Axis is committed to excellence in healthcare technology. We
              continuously strive to enhance our platform, integrating the
              latest advancements to improve user experience and deliver
              superior service. Whether you're booking your first appointment or
              managing ongoing care, Health Axis is here to support you every
              step of the way.
            </p>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our vision at Health Axis is to create a seamless healthcare
                experience for every user. We aim to bridge the gap between
                patients and healthcare providers, making it easier for you to
                access the care you need, when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
            <span className="text-blue-600">WHY</span> CHOOSE US
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Efficiency Card */}
            <div className="group bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl hover:text-blue-600 hover:border-blue-300 transition-all duration-300 hover:scale-105 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600">
                EFFICIENCY:
              </h3>
              <p className="text-gray-700 group-hover:text-gray-800">
                Streamlined appointment scheduling that fits into your busy
                lifestyle.
              </p>
            </div>

            {/* Convenience Card */}
            <div className=" group bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl  hover:border-blue-300 transition-all duration-300 hover:scale-105 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600 ">
                CONVENIENCE:
              </h3>
              <p className="text-gray-700 group-hover:text-gray-800">
                Access to a network of trusted healthcare professionals in your
                area.
              </p>
            </div>

            {/* Personalization Card */}
            <div className="group bg-white p-8 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 hover:scale-105 cursor-pointer">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-blue-600">
                PERSONALIZATION:
              </h3>
              <p className="text-gray-700 group-hover:text-gray-800">
                Tailored recommendations and reminders to help you stay on top
                of your health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
