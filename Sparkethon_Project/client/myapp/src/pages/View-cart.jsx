import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewCart = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
    setSelectedItems(stored.map(() => true));
  }, []);

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    updatedCart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);

    const updatedSelection = [...selectedItems];
    updatedSelection.splice(index, 1);
    setSelectedItems(updatedSelection);
  };

  const handleCheckboxChange = (index) => {
    const updated = [...selectedItems];
    updated[index] = !updated[index];
    setSelectedItems(updated);
  };

  const handleOrderAll = () => {
    const itemsToOrder = cart.filter((_, i) => selectedItems[i]);
    if (itemsToOrder.length === 0)
      return alert("Please select at least one item to order.");

    navigate("/place-order", { state: { products: itemsToOrder } });
  };

  const total = cart.reduce((acc, item, i) => {
    if (selectedItems[i]) {
      return acc + item.price * (item.quantity || 1);
    }
    return acc;
  }, 0);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">Your Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-start gap-3"
            >
              {/* Image */}
              <img
                src={item.thumbnail || item.image}
                alt={item.title}
                className="w-full h-32 object-contain bg-gray-100 rounded"
              />

              {/* Title and Description */}
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description || "No description available."}</p>

              {/* Quantity and Price */}
              <p className="text-sm text-gray-500">Quantity: {item.quantity || 1}</p>
              <p className="text-green-700 font-bold text-lg">
                ${(item.price * (item.quantity || 1)).toFixed(2)}
              </p>

              {/* Checkbox */}
              <label className="flex items-center gap-2 mt-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedItems[index] || false}
                  onChange={() => handleCheckboxChange(index)}
                  className="accent-blue-600"
                />
                Select for Order
              </label>

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(index)}
                className="mt-auto cursor-pointer bg-red-500 hover:bg-red-600 text-white py-1 px-4 rounded text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Total and Order Button */}
      {cart.length > 0 && (
        <div className="mt-8 max-w-6xl mx-auto flex justify-end items-center gap-6">
          <div className="text-xl font-bold text-gray-800">
            Total: ${total.toFixed(2)}
          </div>
          <button
            onClick={handleOrderAll}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-6 rounded-lg text-lg font-semibold shadow"
          >
            Order Now
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewCart;