import React from "react";

const Overview = ({ stats, pendingOrders }) => {
  return (
    <div className="overview p-5">
      <h1 className="font-semibold">OVERVIEW</h1>
      <div className="mt-[17px] flex justify-around">
        <div className="flex flex-col gap-[10px] items-center">
          <div>
            <h1 className="text-[24px] font-semibold">{stats.total}</h1>
            <h1 className="text-gray-500 text-center">Total Orders</h1>
          </div>
        </div>
        <div className="flex flex-col gap-[10px] items-center">
          <div>
            <h1 className="text-[24px] font-semibold">{pendingOrders-1}</h1>
            <h1 className="text-gray-500 text-center">Pending Orders</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;