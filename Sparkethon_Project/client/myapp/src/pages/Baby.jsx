import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const toyItems = [
  {
    id: 1,
    title: "Airplane Design Studio Kit",
    description: "Build and customize model airplanes with this creative design studio and travel case.",
    image: "https://i5.walmartimages.com/asr/7daab614-4eb9-474a-a70e-2b6215c43c0c_1.9b458b0e2c80611e691cc23cce5e01fc.jpeg",
    price: 33.92,
    weight: 0.84, // grams
  },
  {
    id: 2,
    title: "Owl Growth Chart - Pink",
    description: "Track your child’s height with this adorable owl-themed birchwood growth chart.",
    image: "https://i.pinimg.com/736x/ab/99/f4/ab99f42569c631c7381c7e80cbe9e274.jpg",
    price: 18.70,
    weight: 0.85,
  },
  {
    id: 3,
    title: "Cactus Silicone Teether Set",
    description: "Soft, baby-safe silicone teethers in a cute cactus design. Comes in a set of two.",
    image: "https://i5.walmartimages.com/seo/Sugarbooger-Silicone-Teether-Set-of-Two-Happy-Cactus_894ce01d-69e4-427d-8675-2fe922d45727_1.0151c1f1fa82ea38271c55822c7e2b25.jpeg",
    price: 16.72,
    weight: 0.3,
  },
  {
    id: 4,
    title: "My Little Pony Wall Decals",
    description: "Decorate your room with giant, removable My Little Pony Fluttershy decals.",
    image: "https://images.homedepot-static.com/productImages/f53714ee-6137-4ca3-b5b8-223a3eb2eafb/svn/multi-roommates-wall-decals-rmk2708gm-64_1000.jpg",
    price: 12.97,
    weight: 1,
  },
  {
    id: 5,
    title: "Zebra Plush Rocker",
    description: "A soft zebra plush rocker that brings both comfort and fun to your child’s playtime.",
    image: "https://th.bing.com/th/id/OIP.wdRNGnvgW_gn4dBHXHqFdgHaJ4?rs=1&pid=ImgDetMain",
    price: 47.91,
    weight: 0.8,
  },
  {
    id: 6,
    title: "SpongeBob Toddler Bed",
    description: "Bright and playful toddler bed with Nickelodeon’s SpongeBob design for young fans.",
    image: "https://th.bing.com/th/id/OIP.ieceFfCUmx_Bx9Te-lMr0gHaFS?rs=1&pid=ImgDetMain",
    price: 58.49,
    weight: 0.8,
  },
  {
    id: 7,
    title: "Ergobaby Stroller Carry Bag",
    description: "Durable backpack-style carry bag designed for Ergobaby Metro strollers.",
    image: "https://cdn.shopify.com/s/files/1/0690/1977/products/Ergobaby-Metro-1.5-Compact-City-Stroller---Marine-Blue_1800x1800.jpg?v=1586789777",
    price: 30.00,
    weight: 0.8,
  },
  {
    id: 8,
    title: "Grade 5 Core Standards Kit",
    description: "Complete Common Core learning kit for 5th grade with worksheets and activities.",
    image: "https://i.pinimg.com/originals/60/f2/66/60f266c1a210e05aca65f89b3433d6b2.jpg",
    price: 27.57,
    weight: 0.8,
  }
];




const Baby = () => {
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
      <h2 className="text-3xl font-bold capitalize mb-6 text-center">Baby Products</h2>
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

export default Baby;