import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const OrdersTable = ({
  orders,
  selectOrders,
  viewOrder,
  toggleOrder,
  setViewOrder,
  handleImport,
  handleDelete,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
    hover: {
      scale: 1.01,
      transition: { duration: 0.2 },
    },
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "shipped":
        return "bg-green-100 text-green-800 border-green-200";
      case "delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "standard":
        return "📦";
      case "express":
        return "⚡";
      case "priority":
        return "🚀";
      case "overnight":
        return "🌙";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className={`relative ${
        viewOrder ? "w-2/3" : "w-full"
      } bg-gradient-to-br from-white via-gray-50 to-blue-50  shadow-2xl px-8 pt-8 pb-24 flex flex-col transition-all duration-500 h-full border border-gray-200/50 backdrop-blur-sm`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>

      {/* Header Section */}
      <motion.div
        className="relative z-10 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Orders Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage and track your order fulfillment
            </p>
          </div>
        </div>

        {orders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            Found {orders.length} active orders
          </motion.div>
        )}
      </motion.div>

      {/* Table Container */}
      <motion.div
        className="flex-1 overflow-hidden rounded-2xl border border-gray-200/80 shadow-xl bg-white/80 backdrop-blur-sm relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="overflow-y-auto overflow-x-hidden h-full">
          <table className="min-w-full text-sm">
            <thead className="bg-gradient-to-r from-gray-50 to-blue-50 sticky top-0 z-20 border-b border-gray-200">
              <tr>
                {[
                  {
                    label: "Order",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 4h18M3 10h18M3 16h18"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Customer",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5.121 17.804A4 4 0 0112 14h0a4 4 0 016.879 3.804M12 14a4 4 0 10-4-4 4 4 0 004 4z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Type",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6M5 8h14M4 6h16a1 1 0 011 1v11a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Status",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 10h4v11H3V10zm7-6h4v17h-4V4zm7 10h4v7h-4v-7z"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Total",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-10v2m0 12v-2m0 0H8m4 0h4"
                        />
                      </svg>
                    ),
                  },
                  {
                    label: "Date",
                    icon: (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                  },
                ].map((header) => (
                  <th
                    key={header.label}
                    className="text-left px-6 py-4 font-semibold text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      {header.icon}
                      <span className="text-xs uppercase tracking-wider">
                        {header.label}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {orders.length === 0 ? (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <td colSpan="6" className="text-center py-16">
                      <motion.div
                        className="flex flex-col items-center justify-center space-y-4"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          animate={{
                            rotate: [0, 10, -10, 0],
                            scale: [1, 1.1, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                          }}
                          className="text-6xl"
                        >
                          📭
                        </motion.div>
                        <div className="space-y-2">
                          <p className="font-semibold text-gray-700 text-lg">
                            No orders available
                          </p>
                          <p className="text-sm text-gray-500">
                            Orders will appear here when available
                          </p>
                        </div>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                      </motion.div>
                    </td>
                  </motion.tr>
                ) : (
                  orders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 even:bg-gray-50/50 transition-all duration-300 cursor-pointer border-b border-gray-100 group"
                      onClick={() =>
                        setViewOrder({ ...order, index: index + 1 })
                      }
                    >
                      <td className="px-6 py-4">
                        <label className="flex items-center gap-3">
                          <motion.input
                            type="checkbox"
                            className="w-5 h-5 accent-blue-600 cursor-pointer rounded-md"
                            checked={selectOrders.includes(order.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleOrder(order.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          />
                          <span className="font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full text-xs">
                            #{String(index + 1).padStart(3, "0")}
                          </span>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {order.customerImage ? (
                            <motion.img
                              src={order.customerImage}
                              alt={order.customer}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                              whileHover={{ scale: 1.1 }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {order.customer.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <span className="font-medium text-gray-800">
                              {order.customer}
                            </span>
                            <div className="text-xs text-gray-500">
                              Customer
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getTypeIcon(order.type)}
                          </span>
                          <span className="font-medium text-gray-700">
                            {order.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            order.status
                          )}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="w-2 h-2 rounded-full bg-current mr-2 animate-pulse"></div>
                          {order.status}
                        </motion.span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-lg text-gray-800">
                          ${Number(order.total).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Total Amount
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-700">
                              {new Date(order.date).toLocaleDateString(
                                "en-GB",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(order.date).toLocaleDateString(
                                "en-GB",
                                {
                                  weekday: "short",
                                }
                              )}
                            </div>
                          </div>
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewOrder({ ...order, index: index + 1 });
                            }}
                            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            whileHover={{ scale: 1.05, x: 5 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12H3m0 0l4-4m-4 4l4 4"
                              />
                            </svg>
                            View Details
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <AnimatePresence>
        {selectOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <motion.div
              className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl px-8 py-4 flex gap-4 border border-gray-200/50"
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-xs">
                      {selectOrders.length}
                    </span>
                  </div>
                  Selected
                </div>

                <motion.button
                  onClick={handleImport}
                  className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Import (Mark as Packed)
                </motion.button>

                <motion.button
                  onClick={handleDelete}
                  className="bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center gap-2"
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete Selected
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default OrdersTable;
