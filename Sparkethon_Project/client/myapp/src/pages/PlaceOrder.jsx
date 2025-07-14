import React, { useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { getAuth } from "firebase/auth";

const estimateDimensions = (weight) => {
  const scale = Math.cbrt(weight); // Cube root for roughly cubic volume
  const base = 10 * scale; // Base size scaling

  return {
    width: parseFloat((base).toFixed(2)),
    height: parseFloat((base * 0.8).toFixed(2)),
    depth: parseFloat((base * 1.2).toFixed(2)),
  };
};

const PlaceOrder = () => {
  const { state } = useLocation();
  const items = state?.products || [];

  const [paymentMethod, setPaymentMethod] = useState("");
  const [address, setAddress] = useState("");

  const total = items.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );
 const auth = getAuth();
  const currentUser = auth.currentUser;
const handleConfirmOrder = async () => {
  if (!paymentMethod || !address) return;

  // 1. Estimate item dimensions from weight
  const estimatedItems = items.map((item) => {
    const weight = item.weight || 1;
    const { width, height, depth } = estimateDimensions(weight);
    return {
      name: item.title,
      image: item.thumbnail || item.image,
      quantity: item.quantity || 1,
      price: item.price,
      weight,
      width,
      height,
      depth,
    };
  });

  // 2. Call ML API to get box prediction
  let boxPrediction = {};
  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: estimatedItems }),
    });

    const mlData = await response.json();
    boxPrediction = {
      dimensions: mlData.Box_Dimensions || "",
      category: mlData.Box_Category || "Medium",
      filler: mlData.Filler_Type || "Paper",
      impact: mlData.Environmental_Impact || {},
      weatherAdvice: mlData.Weather_Recommendation || "",
    };
  } catch (error) {
    console.error("Failed to fetch box prediction:", error);
    // Fallback values
    boxPrediction = {
      dimensions: "",
      category: "Medium",
      filler: "Paper",
      impact: {},
      weatherAdvice: "",
    };
  }

  // 3. Create order data
  const orderData = {
    customer: currentUser?.displayName || currentUser?.email || "Anonymous",
    customerImage: currentUser?.photoURL || "",
    type: "Online",
    status: "Pending",
    paymentMethod,
    address,
    date: new Date().toISOString(),
    total: total.toFixed(2),
    items: estimatedItems,
    boxInfo: boxPrediction,
  };

  // 4. Save to Firestore
  try {
    await addDoc(collection(db, "orders"), orderData);
    toast.success("🎉 Congratulations! Your order is confirmed!");
  } catch (error) {
    console.error("Error placing order:", error);
    toast.error("Failed to place order. Please try again.");
  }
};




  if (!items.length) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">No items selected for order.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold mb-4">Place Order</h2>

        <div className="grid gap-4 mb-6">
          {items.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-md shadow-sm">
              <div className="flex items-center space-x-4">
                <img src={item.thumbnail|| item.image} alt={item.title} className="h-16 w-16 object-contain" />
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                </div>
              </div>
              <div className="font-bold text-green-700">
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 mb-4">
          <h4 className="text-xl font-bold">Total: ${total.toFixed(2)}</h4>
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Payment Method</h4>
          {["UPI", "Cash on Delivery", "Credit/Debit Card", "Net Banking"].map(method => (
            <label key={method} className="block mb-1">
              <input
                type="radio"
                name="payment"
                value={method}
                checked={paymentMethod === method}
                onChange={e => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              {method}
            </label>
          ))}
        </div>

        {/* Address */}
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Delivery Address</h4>
          <textarea
            rows={1}
            className="w-full resize-none border border-gray-400 rounded-md p-2"
            placeholder="Enter your full address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button
          disabled={!paymentMethod || !address}
          onClick={handleConfirmOrder}
          className={`mt-4 ${
            paymentMethod && address ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
          } text-white py-2 px-6 rounded-lg cursor-pointer text-lg font-semibold shadow`}
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default PlaceOrder;