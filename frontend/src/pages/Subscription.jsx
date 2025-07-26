import React from "react";
import { motion } from "framer-motion";
import AnimatedText from "../components/Animations/AnimatedText";
import AnimatedText2 from "../components/Animations/AnimatedText2";
import { useNavigate } from "react-router-dom";
import backgroundVideo from "../assets/plan-intro3.mp4";

const plans = [
  {
    name: "Basic",
    price: "8.99",
    quality: "Good",
    resolution: "720p",
    devices: "1",
    watchAtSameTime: "1",
    downloadDevices: "1",
    supportedDevices: "TV, Computer, Mobile, Tablet",
  },
  {
    name: "Standard",
    price: "13.99",
    quality: "Better",
    resolution: "1080p",
    devices: "2",
    watchAtSameTime: "2",
    downloadDevices: "2",
    supportedDevices: "TV, Computer, Mobile, Tablet",
  },
  {
    name: "Premium",
    price: "17.99",
    quality: "Best",
    resolution: "4K + HDR",
    devices: "4",
    watchAtSameTime: "4",
    downloadDevices: "6",
    supportedDevices: "TV, Computer, Mobile, Tablet",
  },
];

const Subscriptions = () => {
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    navigate("/payment", { state: { plan } });
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-auto pb-12 text-white font-sans bg-transparent">
      {/* Background Image - Fixed implementation */}
      {/* <div
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/31656893/pexels-photo-31656893/free-photo-of-ornate-interior-dome-of-st-paul-s-cathedral.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)`,
          backgroundSize: 'cover !important',
          backgroundPosition: 'center !important',
          backgroundRepeat: 'no-repeat !important',
        }}
      /> */}

      {/* Commented out video tag */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="fixed top-0 left-0 w-full h-full object-cover -z-10"
        key={backgroundVideo}
      >
        <source src={backgroundVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="w-[80%] text-center mb-5 mt-5">
        <AnimatedText
          text="Choose the Plan That's Right for You"
          className="text-3xl md:text-4xl font-bold pt-[75px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-[90%] max-w-[1100px] p-5">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            className="bg-[#222] p-5 rounded-xl text-center shadow-lg transition-all duration-300 hover:scale-105 flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">
                <AnimatedText2 text={plan.name} />
              </h2>
              <p className="text-xl font-bold text-yellow-400 mb-4">
                ${plan.price}
              </p>

              <p className="text-gray-400 text-left py-2 border-b border-gray-700">
                Video Quality: <span className="text-white">{plan.quality}</span>
              </p>
              <p className="text-gray-400 text-left py-2 border-b border-gray-700">
                Resolution: <span className="text-white">{plan.resolution}</span>
              </p>
              <p className="text-gray-400 text-left py-2 border-b border-gray-700">
                Supported Devices: <span className="text-white">{plan.supportedDevices}</span>
              </p>
              <p className="text-gray-400 text-left py-2 border-b border-gray-700">
                Devices your household can watch at the same time: <span className="text-white">{plan.watchAtSameTime}</span>
              </p>
              <p className="text-gray-400 text-left py-2">
                Download Devices: <span className="text-white">{plan.downloadDevices}</span>
              </p>
            </div>

            <button
              onClick={() => handleSubscribe(plan)}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 mt-6 rounded-md w-full transition-colors duration-300"
            >
              Subscribe
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
