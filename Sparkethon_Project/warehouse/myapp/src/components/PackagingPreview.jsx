import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThreeDBox from "./ThreeDBox";

const PackagingPreview = ({
  viewOrder,
  setPreviewMode,
  handleGoToBoxDisplay,
  mlResponse,
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [hoveredSection, setHoveredSection] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: 300,
      transition: { duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const dataItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      className="w-1/3 h-full bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-2 flex flex-col relative overflow-hidden border-l border-gray-700"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
      </div>

      {/* Close button */}
      <motion.button
        className="absolute cursor-pointer top-2 right-4 text-white text-2xl font-bold hover:text-red-400 z-10 transition-colors duration-200"
        onClick={() => setPreviewMode(false)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        &times;
      </motion.button>

      {/* Header */}
      <motion.div variants={itemVariants} className="relative z-10">
        <h2 className="text-xl font-semibold mb-1 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          3D Model Preview
        </h2>
        <motion.hr
          className="border-gray-500 mb-3"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </motion.div>

      {/* Main content area */}
      <motion.div
        variants={itemVariants}
        className="flex flex-1 w-full relative z-10"
      >
        {/* 3D Model area */}
        <motion.div
          className="flex-1 h-full bg-black rounded-lg border border-gray-700 shadow-2xl overflow-hidden"
          whileHover={{
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.05)",
          }}
          transition={{ duration: 0.3 }}
        >
          <ThreeDBox />

          {/* 3D Model overlay info */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-xs">
            Interactive 3D View
          </div>
        </motion.div>

        {/* Items sidebar */}
        <motion.div
          className="h-full p-3 flex flex-col gap-3 items-center justify-center shadow-inner bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-r-lg"
          variants={itemVariants}
        >
          <div className="text-xs text-gray-400 mb-2">Items</div>
          <AnimatePresence>
            {viewOrder?.items?.map((item, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, z: 10 }}
                onHoverStart={() => setSelectedItem(item)}
                onHoverEnd={() => setSelectedItem(null)}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover cursor-pointer rounded-full border-2 border-white/20 shadow-lg transition-all duration-200 group-hover:border-blue-400"
                  title={item.name}
                />
                <div className="absolute inset-0 rounded-full bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>

                {/* Item tooltip */}
                <AnimatePresence>
                  {selectedItem === item && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.8 }}
                      className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-white text-black px-2 py-1 rounded text-xs whitespace-nowrap shadow-lg z-20"
                    >
                      {item.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-white rotate-45"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Data section */}
      <motion.div
        className="text-sm space-y-3 relative z-10 bg-gradient-to-t from-gray-900/90 to-transparent p-4 rounded-lg backdrop-blur-sm max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900"
        variants={itemVariants}
        style={{
          scrollbarColor: "#4B5563 #1F2937", // thumb, track (dark gray)
          scrollbarWidth: "thin",
        }}
      >
        <div className="text-xs text-gray-400 mb-3 font-semibold tracking-wide">
          ML RECOMMENDATIONS
        </div>

        {mlResponse ? (
          mlResponse.error ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-400 p-3 bg-red-900/20 rounded border border-red-800 "
            >
              <div className="flex items-center gap-2 ">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                {mlResponse.error}
              </div>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {[
                {
                  label: "Box Dimensions",
                  value: mlResponse.Box_Dimensions,
                  icon: "📦",
                },
                {
                  label: "Box Category",
                  value: mlResponse.Box_Category,
                  icon: "🏷️",
                },
                {
                  label: "Weather Recommendation",
                  value: mlResponse.Weather_Recommendation,
                  icon: "🌤️",
                },
                {
                  label: "Filler Type",
                  value: mlResponse.Filler_Type,
                  icon: "🧱",
                },
                {
                  label: "Filler Amount",
                  value: mlResponse.Filler_Amount,
                  icon: "⚖️",
                },
                {
                  label: "Cost Saved (Per unit)",
                  value: mlResponse.Cost_Savings_Per_Unit,
                  icon: "💰",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  variants={dataItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                  className="p-2 rounded cursor-pointer border border-transparent hover:border-gray-600"
                  onHoverStart={() => setHoveredSection(item.label)}
                  onHoverEnd={() => setHoveredSection(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1">
                      <span className="text-gray-300 text-xs">
                        {item.label}:
                      </span>
                      <div className="text-white font-medium">
                        {item.value || "N/A"}
                      </div>
                    </div>
                    {hoveredSection === item.label && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-blue-400 rounded-full"
                      />
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Environmental Impact - Special styling */}
              <motion.div
                variants={dataItemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="p-3 rounded-lg bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700/50 cursor-pointer"
                onHoverStart={() => setHoveredSection("environmental")}
                onHoverEnd={() => setHoveredSection(null)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🌱</span>
                  <span className="text-green-400 text-xs font-semibold">
                    Environmental Impact
                  </span>
                  {hoveredSection === "environmental" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-green-400 rounded-full"
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-green-800/20 p-2 rounded">
                    <div className="text-green-300">Plastic Saved</div>
                    <div className="text-white font-bold">
                      {mlResponse.Environmental_Impact?.Plastic_Saved_kg || "0.46"}
                      kg
                    </div>
                  </div>
                  <div className="bg-blue-800/20 p-2 rounded">
                    <div className="text-blue-300">CO₂ Saved</div>
                    <div className="text-white font-bold">
                      {mlResponse.Environmental_Impact?.CO2_Saved_kg || "0.2"}kg
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-3 bg-gray-800/50 rounded border border-gray-700"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full"
            />
            <span className="text-gray-400">
              Fetching ML Recommendations...
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Go button */}
      <motion.button
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold mt-4 cursor-pointer transition-all duration-200 shadow-lg relative z-10 overflow-hidden"
        onClick={handleGoToBoxDisplay}
        variants={itemVariants}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
        }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <span className="relative z-10">Continue to Box Display</span>
      </motion.button>
    </motion.div>
  );
};

export default PackagingPreview;
