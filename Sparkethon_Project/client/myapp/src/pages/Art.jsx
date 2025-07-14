import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const toyItems = [
  {
    id: 1,
    title: "Stencil Tape - Martha Stewart",
    description: "Reusable stencil tape ideal for precise painting and craft applications.",
    image: "https://n3.sdlcdn.com/imgs/a/h/f/Martha-Stewart-Stencil-32292-Tape-SDL844018008-1-4f0fc.jpg",
    price: 9.97,
    weight: 0.15 
  },
  {
    id: 2,
    title: "Perler Instruction Pad - 86 Patterns",
    description: "A pattern book full of 86 fun summertime designs for Perler fuse beads.",
    image: "https://m.media-amazon.com/images/I/815XzF2gBPL._AC_SX679_.jpg",
    price: 5.99,
    weight: 0.38
  },
  {
    id: 3,
    title: "Faber-Castell Watercolor Pencils - 12ct",
    description: "High-quality watercolor pencils in a tin set, perfect for blending and sketching.",
    image: "https://th.bing.com/th/id/OIP.XJDVFRVugJq2AzCJmoeqPAHaGo?rs=1&pid=ImgDetMain",
    price: 9.51,
    weight: 0.31
  },
  {
    id: 4,
    title: "Ergobaby Stroller Carry Bag",
    description: "Backpack-style compact carry bag designed for Ergobaby Metro strollers.",
    image: "https://media.s-bol.com/JE8Gz8BJQrk2/YWQ55mn/550x515.jpg",
    price: 6.23,
    weight: 0.61    
  }
];



const Art = () => {
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
      <h2 className="text-3xl font-bold capitalize mb-6 text-center">Art and Craft</h2>
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

export default Art;