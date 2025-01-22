import React from "react";
import Temple1 from "../../assets/images/temple-1.png";
import Temple2 from "../../assets/images/temple-2.png";
import Temple3 from "../../assets/images/temple-3.png";
import Temple4 from "../../assets/images/temple-4.png";
import Temple5 from "../../assets/images/temple-5.png";
import Temple6 from "../../assets/images/temple-6.jpeg";
import Temple7 from "../../assets/images/temple-7.jpg";
import Temple8 from "../../assets/images/temple-8.jpg";
import Temple9 from "../../assets/images/temple-9.jpg";
import Temple10 from "../../assets/images/temple-10.jpg";
import Temple11 from "../../assets/images/temple-11.jpg";
import Temple12 from "../../assets/images/temple-12.jpg";
import Temple13 from "../../assets/images/temple-13.jpg";
import Temple14 from "../../assets/images/temple-14.jpg";
import Temple15 from "../../assets/images/temple-15.jpg";

const Marquee = () => {
  const templeImages1 = [
    { id: 1, src: Temple1 },
    { id: 2, src: Temple2 },
    { id: 3, src: Temple3 },
    { id: 4, src: Temple4 },
    { id: 5, src: Temple5 },
  ];

  const templeImages2 = [
    { id: 6, src: Temple6 },
    { id: 7, src: Temple7 },
    { id: 8, src: Temple8 },
    { id: 9, src: Temple9 },
    { id: 10, src: Temple10 },
  ];

  const templeImages3 = [
    { id: 6, src: Temple11 },
    { id: 7, src: Temple12 },
    { id: 8, src: Temple13 },
    { id: 9, src: Temple14 },
    { id: 10, src: Temple15 },
  ];

  return (
    <>
      <div className="relative h-[320px] w-full grid grid-cols-3 gap-4 overflow-hidden px-4">
        {/* First Column - Bottom to Top */}
        <div className="relative overflow-hidden">
          <div className="animate-scroll-up flex flex-col gap-4 pointer-events-none">
            {[...templeImages1, ...templeImages1].map((image, index) => (
              <div
                key={`${image.id}-${index}`}
                className="w-full h-[150px] flex-shrink-0"
              >
                <img
                  src={image.src}
                  alt={`Temple ${image.id}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Second Column - Top to Bottom */}
        <div className="relative overflow-hidden">
          <div className="animate-scroll-down flex flex-col gap-4 pointer-events-none">
            {[...templeImages2, ...templeImages2].map((image, index) => (
              <div
                key={`${image.id}-${index}-middle`}
                className="w-full h-[150px] flex-shrink-0"
              >
                <img
                  src={image.src}
                  alt={`Temple ${image.id}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Third Column - Bottom to Top */}
        <div className="relative overflow-hidden">
          <div className="animate-scroll-up-slower flex flex-col gap-4 pointer-events-none">
            {[...templeImages3, ...templeImages3].map((image, index) => (
              <div
                key={`${image.id}-${index}-right`}
                className="w-full h-[150px] flex-shrink-0"
              >
                <img
                  src={image.src}
                  alt={`Temple ${image.id}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none col-span-3" />
      </div>

      <style jsx>{`
        .animate-scroll-up {
          animation: scrollUp 25s linear infinite;
        }

        .animate-scroll-down {
          animation: scrollDown 30s linear infinite;
        }

        .animate-scroll-up-slower {
          animation: scrollUp 35s linear infinite;
        }

        @keyframes scrollUp {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        @keyframes scrollDown {
          0% {
            transform: translateY(-50%);
          }
          100% {
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="text-center flex flex-col gap-3 mt-8 mb-4">
        <p className="text-black1 text-4xl font-extrabold">Welcome</p>
        <p className="text-black1 text-base">"Plan Your Perfect Trip Today!"</p>
      </div>
    </>
  );
};

export default Marquee;
