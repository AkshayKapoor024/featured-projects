// 📁 src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";
import Sidebar from "./Sidebar";
import OrdersTable from "./OrdersTable";
import OrderDetails from "./OrderDetails";
import LoadingPreview from "./LoadingPreview";
import PackagingPreview from "./PackagingPreview";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Homes = () => {
  const [orders, setOrders] = useState([]);
  const [selectOrders, setSelectOrders] = useState([]);
  const [viewOrder, setViewOrder] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mlResponse, setMlResponse] = useState(null);
  const navigate = useNavigate();

  const [importedStats, setImportedStats] = useState(() => ({
    total: Number(localStorage.getItem("importedTotalOrders")) || 0,
    revenue: Number(localStorage.getItem("importedTotalRevenue")) || 0,
    paid: Number(localStorage.getItem("importedPaidOrders")) || 0,
    cancelled: Number(localStorage.getItem("importedCancelledOrders")) || 0,
    pending: Number(localStorage.getItem("importedPendingOrders")) || 0,
  }));
  const handleGoToBoxDisplay = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const items = mlResponse?.items || viewOrder?.items || [];
      const totalVolume = items.reduce(
        (sum, item) =>
          sum + (item.width || 10) * (item.height || 10) * (item.depth || 10),
        0
      );
      const boxSize = Math.ceil(Math.pow(totalVolume, 1 / 3)) * 1.2;

      navigate("/box-preview", {
        state: {
          order: { ...viewOrder, items }, // ✅ inject optimized items
          boxSize,
        },
      });

      setIsGenerating(false);
    }, 800);
  };

  const toggleOrder = (id) => {
    setSelectOrders((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const handleImport = async () => {
    const imported = orders.filter((o) => selectOrders.includes(o.id));
    const total = imported.length;
    const paid = imported.filter(
      (o) => o.status?.toLowerCase() === "paid"
    ).length;
    const cancelled = imported.filter(
      (o) => o.status?.toLowerCase() === "cancelled"
    ).length;
    const pending = imported.filter(
      (o) => o.status?.toLowerCase() === "pending"
    ).length;
    const revenue = imported.reduce(
      (acc, curr) => acc + Number(curr.total || 0),
      0
    );

    const newStats = {
      total: importedStats.total + total,
      revenue: importedStats.revenue + revenue,
      paid: importedStats.paid + paid,
      cancelled: importedStats.cancelled + cancelled,
      pending: importedStats.pending + pending,
    };

    Object.entries(newStats).forEach(([key, value]) =>
      localStorage.setItem(
        `imported${key.charAt(0).toUpperCase() + key.slice(1)}`,
        value
      )
    );
    setImportedStats(newStats);

    for (const id of selectOrders) {
      try {
        await deleteDoc(doc(db, "orders", id));
      } catch (err) {
        console.log(`Skipping local-only order: ${id}`);
      }
    }

    const localOrders = JSON.parse(localStorage.getItem("localOrders")) || [];
    const updatedLocalOrders = localOrders.filter(
      (order) => !selectOrders.includes(order.id)
    );
    localStorage.setItem("localOrders", JSON.stringify(updatedLocalOrders));

    // ✅ Track deleted
    const deletedIds =
      JSON.parse(localStorage.getItem("deletedOrderIds")) || [];
    const updatedDeletedIds = [...new Set([...deletedIds, ...selectOrders])];
    localStorage.setItem("deletedOrderIds", JSON.stringify(updatedDeletedIds));

    if (viewOrder && selectOrders.includes(viewOrder.id)) {
      setViewOrder(null);
    }

    setSelectOrders([]);
    setOrders((prev) =>
      prev.filter((order) => !selectOrders.includes(order.id))
    );
  };

  const handleDelete = async () => {
    for (const id of selectOrders) {
      try {
        await deleteDoc(doc(db, "orders", id));
      } catch (err) {
        console.log(`Local delete: ${id}`);
      }
    }

    const localOrders = JSON.parse(localStorage.getItem("localOrders")) || [];
    const updatedLocalOrders = localOrders.filter(
      (order) => !selectOrders.includes(order.id)
    );
    localStorage.setItem("localOrders", JSON.stringify(updatedLocalOrders));

    // ✅ Track deleted
    const deletedIds =
      JSON.parse(localStorage.getItem("deletedOrderIds")) || [];
    const updatedDeletedIds = [...new Set([...deletedIds, ...selectOrders])];
    localStorage.setItem("deletedOrderIds", JSON.stringify(updatedDeletedIds));

    if (viewOrder && selectOrders.includes(viewOrder.id)) {
      setViewOrder(null);
    }

    setSelectOrders([]);
    setOrders((prev) =>
      prev.filter((order) => !selectOrders.includes(order.id))
    );
  };

  const handlePreviewPackaging = async () => {
    setLoadingPreview(true);
    setMlResponse(null);

    try {
      const items = viewOrder?.items || [];
      const formattedItems = items.map((item) => ({
        width: item.width || 10,
        height: item.height || 10,
        depth: item.depth || 10,
        weight: item.weight || 1,
      }));

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: formattedItems }),
      });

      const data = await response.json();
      setMlResponse(data);
    } catch (error) {
      console.error("ML Model Error:", error);
      setMlResponse({ error: "Unable to fetch recommendation." });
    }

    setTimeout(() => {
      setLoadingPreview(false);
      setPreviewMode(true);
    }, 3000);
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snapshot) => {
      const firestoreOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const deletedIds =
        JSON.parse(localStorage.getItem("deletedOrderIds")) || [];

      let localOrders = JSON.parse(localStorage.getItem("localOrders")) || [];
      localOrders = localOrders.filter(
        (order) => !deletedIds.includes(order.id)
      );

      const combinedOrders = [
        ...firestoreOrders,
        ...localOrders.filter(
          (local) => !firestoreOrders.some((f) => f.id === local.id)
        ),
      ];

      setOrders(combinedOrders);
    });

    return () => unsub();
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex h-full">
        <OrdersTable
          orders={orders.filter(
            (order) =>
              !JSON.parse(
                localStorage.getItem("deletedOrderIds") || "[]"
              ).includes(order.id)
          )}
          selectOrders={selectOrders}
          setSelectOrders={setSelectOrders}
          toggleOrder={toggleOrder}
          viewOrder={viewOrder}
          setViewOrder={setViewOrder}
          handleImport={handleImport}
          handleDelete={handleDelete}
        />

        {viewOrder && loadingPreview && <LoadingPreview />}
        {viewOrder && !previewMode && !loadingPreview && (
          <OrderDetails
            viewOrder={viewOrder}
            setViewOrder={setViewOrder}
            handlePreviewPackaging={handlePreviewPackaging}
          />
        )}
        <AnimatePresence mode="wait">
          {viewOrder && previewMode && !isGenerating && (
            <PackagingPreview
              viewOrder={viewOrder}
              setPreviewMode={setPreviewMode}
              handleGoToBoxDisplay={handleGoToBoxDisplay}
              mlResponse={mlResponse}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Homes;
