import { motion, useMotionValue, useTransform } from "framer-motion";
import Navbar from './Navbar'
import { useRef } from "react";
import { TypeAnimation } from 'react-type-animation';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();
  const imageRef = useRef(null);

  // Mouse-based rotation
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X within image
    const y = e.clientY - rect.top;  // Mouse Y within image
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateAmountX = ((y - centerY) / centerY) * -5;
    const rotateAmountY = ((x - centerX) / centerX) * 5;

    rotateX.set(rotateAmountX);
    rotateY.set(rotateAmountY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };


  return (
    <>
    <Navbar />
    
    <div className="bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="text-center py-10">
        <p className="text-lg tracking-wide font-michroma">
          YOUR NEXT&nbsp;
                  <TypeAnimation
          sequence={[
            'FOOTBALL',
            1000,
            'VOLLEYBALL',
            1000,
            'BASKETBALL',
            1000,
            'RUGBY',
            1000,
            // Final one stays
            'CRICKET',
            2000,
          ]}
          wrapper="span"
          cursor={true}
          repeat={Infinity}
          className="text-blue-700 font-bold animate-pulse transition-all duration-500"
        />

        &nbsp;UNIFORM...
      </p>

        {/* Model Image */}
        <div className="flex justify-center items-end my-8">
          <motion.div
            initial={{ x: 500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute top-1/2 bottom-0 left-0 right-0 -translate-y-1/2 h-[3.2cm] bg-black z-4"
          ></motion.div>

          <motion.img
            ref={imageRef}
            src="/assets/image.png"
            alt="Jersey Models"
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              rotateX: rotateX,
              rotateY: rotateY,
              transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative max-w-full h-[600px] object-contain"
          />
        </div>

        <button onClick={() => navigate('/select-sport')} className="border border-black px-6 py-2 hover:bg-black hover:text-white transition">
          Enter Our Design Studio
        </button>
      </section>

      {/* Why Choose Section */}
      {/*
      <section className="bg-gray-50 py-16 px-4">
        <h2 className="text-2xl font-semibold text-center mb-10">
          Why Choose Jersey Customizer?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Easy Design Tools",
              desc: "Intuitive drag-and-drop interface for seamless customization.",
              icon: "🛠️",
            },
            {
              title: "Premium Quality Materials",
              desc: "Durable fabrics and vibrant prints for jerseys that last.",
              icon: "🎽",
            },
            {
              title: "Fast Turnaround",
              desc: "Quick production and shipping to get your custom gear sooner.",
              icon: "⚡",
            },
            {
              title: "Team Discounts",
              desc: "Special pricing for bulk orders for sports teams and organizations.",
              icon: "👥",
            },
            {
              title: "Expert Support",
              desc: "Dedicated design and customer service team ready to assist.",
              icon: "📞",
            },
            {
              title: "Endless Possibilities",
              desc: "From colors to fonts, your imagination is the only limit.",
              icon: "🧢",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border p-6 rounded shadow-sm text-center"
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section> */}

      {/* Footer Links */}
      <footer className="text-center py-10 text-sm text-gray-700 space-y-1">
        <div>Our Process</div>
        <div>Gallery</div>
        <div>FAQ</div>
      </footer>
    </div>
     </>
  )
}
