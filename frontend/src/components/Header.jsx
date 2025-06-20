import { assets } from "../assets/assets";

const Header = () => {
  return (
    <section className="flex justify-center items-center  py-10 ml-[80px]">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-center md:gap-8">
          <div>
            <div className="max-w-lg md:max-w-none">
              <h2 className="text-5xl font-bold text-gray-900 sm:text-3xl px-7">
                Find & Book
                <span className="text-blue-600"> Appointment </span>
                <br /> with your Fav
                <span className="text-blue-600"> Doctors</span>
              </h2>

              <p className="mt-4 text-gray-700 px-7 ">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur
                doloremque saepe architecto maiores repudiandae amet perferendis
                repellendus, reprehenderit voluptas sequi.
              </p>
              <div className="flex flex-row">
                <a href="#speciality" className="mt-6 ml-7 px-10 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2">
                  Book Appointment
                  <img
                    src={assets.arrowIcon}
                    alt="arrow"
                    className="w-5 h-5 text-white mt-1"
                  />
                </a >
              </div>
            </div>
          </div>

          <div>
            <img
              src={assets.docHeader2}
              className="rounded-3xl inset-0 w-2xl object-cover"
              alt="doctors"
              width={400}
              height={400}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Header;
