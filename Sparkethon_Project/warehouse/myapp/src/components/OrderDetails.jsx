import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Clock, 
  Settings, 
  Truck, 
  CheckCircle, 
  XCircle, 
  FileText,
  CreditCard, 
  MapPin, 
  Package, 
  Calendar,
  ShoppingBag,
  ArrowRight
} from "lucide-react";

const OrderDetails = ({ viewOrder, setViewOrder, handlePreviewPackaging }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0, x: 300 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut",
        staggerChildren: 0.05 
      }
    },
    exit: { 
      opacity: 0, 
      x: 300,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'from-yellow-500 to-orange-500';
      case 'processing': return 'from-blue-500 to-indigo-600';
      case 'shipped': return 'from-green-500 to-emerald-600';
      case 'delivered': return 'from-emerald-500 to-teal-600';
      case 'cancelled': return 'from-red-500 to-rose-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return Clock;
      case 'processing': return Settings;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return FileText;
    }
  };

  const StatusIcon = getStatusIcon(viewOrder.status);

  return (
    <motion.div 
      className="w-1/3 h-full bg-gradient-to-br from-white via-gray-50 to-blue-50 shadow-2xl border-l border-gray-200/50 flex flex-col relative overflow-hidden backdrop-blur-sm"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>

      {/* Close Button */}
      <motion.button
        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 z-20 transition-colors duration-200"
        onClick={() => setViewOrder(null)}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <X size={24} />
      </motion.button>

      {/* Header - Compact */}
      <motion.div 
        className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-white/80 to-blue-50/80 backdrop-blur-sm relative z-10"
        variants={itemVariants}
      >
        <motion.h2 
          className="text-xl font-bold mb-2 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Order #{viewOrder.index}
        </motion.h2>
        <motion.div
          className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r ${getStatusColor(viewOrder.status)} text-white text-xs rounded-full font-semibold shadow-lg`}
          whileHover={{ scale: 1.05 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <StatusIcon size={14} />
          {viewOrder.status?.charAt(0).toUpperCase() + viewOrder.status?.slice(1)}
          <motion.div
            className="w-1.5 h-1.5 bg-white rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Customer Info - Compact */}
      <motion.div 
        className="p-4 flex items-center gap-3 border-b border-gray-100/50 bg-gradient-to-b from-white/60 to-transparent relative z-10"
        variants={itemVariants}
        onHoverStart={() => setActiveSection('customer')}
        onHoverEnd={() => setActiveSection(null)}
      >
        <motion.div
          className="relative"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {viewOrder.customerImage ? (
            <motion.img
              src={viewOrder.customerImage}
              alt={viewOrder.customer}
              className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            />
          ) : (
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            >
              {viewOrder.customer?.charAt(0).toUpperCase()}
            </motion.div>
          )}
          <motion.div
            className="absolute inset-0 rounded-full bg-blue-400/20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: activeSection === 'customer' ? 1.2 : 0,
              opacity: activeSection === 'customer' ? 1 : 0
            }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
        <div className="flex-1">
          <motion.p 
            className="text-lg font-bold text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {viewOrder.customer}
          </motion.p>
          <motion.div
            className="text-xs text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Valued Customer
          </motion.div>
        </div>
      </motion.div>

      {/* Order Details - Compact Grid */}
      <motion.div 
        className="p-4 text-xs text-gray-700 border-b border-gray-100/50 bg-white/40 backdrop-blur-sm relative z-10"
        variants={itemVariants}
      >
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Payment", value: viewOrder.paymentMethod, icon: CreditCard },
            { label: "Type", value: viewOrder.type, icon: Package },
            { label: "Address", value: viewOrder.address, icon: MapPin, span: true },
            { label: "Date", value: new Date(viewOrder.date).toLocaleDateString(), icon: Calendar }
          ].map((detail, index) => {
            const IconComponent = detail.icon;
            return (
              <motion.div
                key={detail.label}
                className={`flex items-start gap-2 p-2 rounded-lg hover:bg-white/60 transition-all duration-200 cursor-pointer ${detail.span ? 'col-span-2' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setActiveSection(detail.label)}
                onHoverEnd={() => setActiveSection(null)}
              >
                <IconComponent size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
                    {detail.label}
                  </div>
                  <div className="text-gray-700 text-xs truncate">{detail.value}</div>
                </div>
                {activeSection === detail.label && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Items List - Compact */}
      <motion.div 
        className="p-4 flex-1 min-h-0 relative z-10"
        variants={itemVariants}
      >
        <motion.div 
          className="flex items-center justify-between mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2">
            <ShoppingBag size={16} className="text-blue-500" />
            <h3 className="text-sm font-bold">Items</h3>
          </div>
          <motion.div
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.3 }}
          >
            {viewOrder.items?.length}
          </motion.div>
        </motion.div>
        
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          <AnimatePresence>
            {viewOrder.items?.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-sm border border-gray-200/50 cursor-pointer"
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.05 }}
                whileHover={{ 
                  scale: 1.01, 
                  y: -1,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                }}
                onHoverStart={() => setHoveredItem(index)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <motion.div
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 rounded object-cover shadow-sm border border-white"
                    />
                    <motion.div
                      className="absolute inset-0 rounded bg-blue-400/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredItem === index ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{item.name}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500 bg-gray-100 px-1 py-0.5 rounded text-xs">
                        {item.quantity}x
                      </span>
                      <span className="text-xs text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-xs">
                        ${item.price}
                      </span>
                    </div>
                  </div>
                </div>
                <motion.div 
                  className="text-xs font-bold text-gray-800 bg-green-50 px-2 py-1 rounded flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  ${(item.price * item.quantity).toFixed(2)}
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Total + Button - Compact */}
      <motion.div 
        className="p-4 border-t border-gray-200/50 bg-gradient-to-t from-white/90 to-transparent backdrop-blur-sm relative z-10"
        variants={itemVariants}
      >
        <motion.div 
          className="text-right mb-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8 }}
        >
          <div className="text-xs text-gray-600 mb-1">Total Amount</div>
          <motion.div 
            className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            ${viewOrder.total}
          </motion.div>
        </motion.div>
        <motion.button
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white py-3 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl relative overflow-hidden"
          onClick={handlePreviewPackaging}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          whileHover={{ 
            scale: 1.02, 
            y: -2,
            boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6 }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <Package size={16} />
            Preview Packaging
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight size={14} />
            </motion.div>
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetails;