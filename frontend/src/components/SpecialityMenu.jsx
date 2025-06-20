import { specialityData } from "../assets/assets"
import {Link} from "react-router-dom"
const SpecialityMenu = () => {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-gray-900" id="speciality">
      <h1 className="text-3xl font-bold">Find By <span className="text-blue-600">Speciality</span></h1>
      <p className="sm:w-1/3 text-center text-base">Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
      <div className="flex sm:justify-center gap-4 pt-5 w-full overflow-scroll">
        {
            specialityData.map((value,index)=>(
                <Link onClick={()=>scrollTo(0,0)} key={index} to={`/doctors/${value.speciality}`} className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500">
                    <img src={value.image} alt="image" className="w-16 sm:w-24 mb-2"/>
                    <p>{value.speciality}</p>
                </Link>
            ))
        }
      </div>
    </div>
  )
}

export default SpecialityMenu
