// 📁 src/components/Sidebar.jsx
import React from "react";
import {
  Home as HomeIcon,
  ClipboardList,
  Bell,
  HelpCircle,
  Info,
} from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-[220px] h-full bg-blue-700 text-white flex flex-col justify-between py-6 pl-5 z-50">
      <div>
        <h2 className="text-2xl font-bold mb-8">Walmart</h2>
        <nav className="space-y-3">
          {[
            { label: "Dashboard", icon: <HomeIcon /> },
            { label: "Orders", icon: <ClipboardList /> },
            { label: "Notifications", icon: <Bell /> },
            { label: "Help", icon: <HelpCircle /> },
            { label: "About", icon: <Info /> },
          ].map((item, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 px-3 py-2  rounded-md cursor-pointer transition-colors ${
                item.label === "Orders"
                  ? "bg-white text-black font-semibold rounded-r-none"
                  : "hover:bg-[#2A2A3B] text-white"
              }`}
            >
              <div className="text-xl">{item.icon}</div>
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;