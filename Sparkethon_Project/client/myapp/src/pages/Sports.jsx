import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const toyItems = [
  {
    id: 1,
    title: "DB CoreFlex Longboard (41\")",
    description: "Premium bamboo fiberglass longboard designed for smooth carving and cruising.",
    image: "https://images-na.ssl-images-amazon.com/images/I/51MbXlSamtL.jpg",
    price: 237.68,
    weight: 10.7,
  },
  {
    id: 2,
    title: "Franklin Eye Black Stickers",
    description: "Customizable black eye stickers for baseball or football players.",
    image: "https://m.media-amazon.com/images/I/71HLpD8iVrL._AC_.jpg",
    price: 6.91,
    weight: 0.8, 
  },
  {
    id: 3,
    title: "Mikasa Replica Volleyball",
    description: "Durable volleyball ideal for training and recreational indoor/outdoor games.",
    image: "https://m.media-amazon.com/images/I/61hNPPJ1fqL._AC_SL1200_.jpg",
    price: 18.93,
    weight: 1, 
  },
  {
    id: 4,
    title: "Georgia Bulldogs Puzzle Cube",
    description: "Official NCAA-branded Rubik's cube-style puzzle for fans and collectors.",
    image: "https://th.bing.com/th/id/OIP.mHKcTgfn04N4Ni4ozAtRIAHaF_?rs=1&pid=ImgDetMain",
    price: 10.49,
    weight: 0.1, 
  },
  {
    id: 5,
    title: "Ultra Pro Gamers Bag – Red",
    description: "Spacious and durable carrying bag for card games, board games, and gear.",
    image: "https://th.bing.com/th/id/OIP.PcBTT9aBJVQigxwF8gqPpgHaJo?rs=1&pid=ImgDetMain",
    price: 74.96,
    weight: 2.28, 
  },
  {
    id: 6,
    title: "Clever Catch Insects Ball",
    description: "Educational 24\" vinyl ball with insect-themed Q&A for interactive learning.",
    image: "https://m.media-amazon.com/images/I/81Q0gBpx2+L._SL1500_.jpg",
    price: 17.40,
    weight: 0.35, 
  },
];



const Sports = () => {
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
      <h2 className="text-3xl font-bold capitalize mb-6 text-center">Sports Items</h2>
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

export default Sports;