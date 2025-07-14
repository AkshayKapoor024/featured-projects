import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
const toyItems = [
  {
    id: 1,
    title: "Etched Glass Window Film (24x36)",
    description: "Decorative window film that simulates the look of etched glass.",
    image: "https://images.thdstatic.com/productImages/a6c60250-e9da-4d73-a603-21cb6e856388/svn/etched-artscape-window-film-01-0121-64_1000.jpg",
    price: 12.99,
    weight: 0.76,
  },
  {
    id: 2,
    title: "Red Activity Table – Adjustable Height",
    description: "Durable red laminate activity table with adjustable short legs for kids.",
    image: "https://m.media-amazon.com/images/I/71tfSgX1SWL._AC_SL1500_.jpg",
    price: 117.26,
    weight: 39,
  },
  {
    id: 3,
    title: "Stainless Steel Hose Clamps – 10 Pack",
    description: "Heavy-duty hose clamps made of stainless steel for plumbing and automotive use.",
    image: "https://m.media-amazon.com/images/I/71VLfjENISL._SL1500_.jpg",
    price: 34.27,
    weight: 0.8,
  },
  {
    id: 4,
    title: "Frozen 2 Twin/Full Comforter Set",
    description: "Disney Frozen 2 themed comforter and sham set featuring forest spirit designs.",
    image: "https://images-na.ssl-images-amazon.com/images/I/51ZMC0Ras6L.jpg",
    price: 36.37,
    weight: 4.23,
  },
  {
    id: 5,
    title: "Alice in Wonderland Tapestry Blanket",
    description: "Cozy woven tapestry throw blanket with Mad Hatter’s Wonderland theme.",
    image: "https://allears.net/wp-content/uploads/2022/11/https-m-media-amazon-com-images-i-a1i2vw8sepl-_ac_sl1500_-jpg.jpg",
    price: 35.00,
    weight: 0.8,
  },
  {
    id: 6,
    title: "Curious George Giant Wall Decal",
    description: "Peel and stick wall decal featuring Curious George. Easy to apply and remove.",
    image: "https://m.media-amazon.com/images/S/aplus-media/vc/f33d1d3d-a338-48c8-973c-e12bede91196.__CR0,0,970,300_PT0_SX970_V1___.jpg",
    price: 11.00,
    weight: 0.8,
  },
  {
    id: 7,
    title: "JoJo Siwa Sweet Life Curtains",
    description: "Colorful and stylish window curtains featuring JoJo Siwa graphics.",
    image: "https://m.media-amazon.com/images/I/91rmwbh2moS._AC_.jpg",
    price: 19.99,
    weight: 0.8,
  },
  {
    id: 8,
    title: "Kids Bistro Chair Set – White/Driftwood",
    description: "Stylish 2-piece chair set for children with a modern bistro look.",
    image: "https://th.bing.com/th/id/R.7a6538213183cf3e6a477247ec1ecb8b?...",
    price: 99.99,
    weight: 0.8,
  },
];



const Kitchen = () => {
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const initial = {};
    toyItems.forEach((item) => {
      initial[item.id] = 1;
    });
    setQuantities(initial);
  }, []);

  const increaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: prev[id] > 1 ? prev[id] - 1 : 1,
    }));
  };

  const handleAddToCart = (item) => {
    const qty = quantities[item.id] || 1;
    const cartItem = { ...item, quantity: qty };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = [...existingCart, cartItem];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast.success(`${item.title} (x${qty}) added to cart!`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-300">
      <h2 className="text-3xl font-bold capitalize mb-6 text-center">Kitchen Appliances</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {toyItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border p-4 rounded-xl shadow hover:shadow-md transition duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-40 w-full object-contain rounded-md bg-gray-100 p-2"
            />
            <h3 className="mt-3 text-base font-semibold">{item.title}</h3>
            <p className="text-gray-700 text-sm">{item.description}</p>
            <p className="text-green-700 font-bold mt-1">${item.price}</p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex px-1 py-1 rounded-lg items-center gap-2">
                <button
                  onClick={() => decreaseQty(item.id)}
                  className="bg-red-500 text-white text-lg px-2 cursor-pointer rounded"
                >
                  -
                </button>
                <span className="px-2">{quantities[item.id]}</span>
                <button
                  onClick={() => increaseQty(item.id)}
                  className="bg-blue-500 text-white px-2 text-lg cursor-pointer rounded"
                >
                  +
                </button>
              </div>
            </div>

               <button
              onClick={() => handleAddToCart(item)}
              className="mt-4 w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 rounded-md text-sm"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kitchen;