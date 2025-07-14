import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const toyItems = [
  {
    id: 1,
    title: "Pikachu Deluxe Costume (XS)",
    description: "Official Pokémon Pikachu costume for kids – X-Small size with deluxe detailing.",
    image: "https://th.bing.com/th/id/OIP.kEjrzJZitPNS86dZCqKXLwAAAA?rs=1&pid=ImgDetMain",
    price: 29.12,
    weight: 0.61,
  },
  {
    id: 2,
    title: "Union Officer Costume (M)",
    description: "Civil War-era Union Officer costume for children. Medium size by Forum Novelties.",
    image: "https://th.bing.com/th/id/OIP.5Fo95gpL43S-qlHBPcn0xwHaHa?w=500&h=500&rs=1&pid=ImgDetMain",
    price: 21.09,
    weight: 0.8,
  },
  {
    id: 3,
    title: "Captain America T-Shirt & Mask",
    description: "Marvel Avengers Assemble t-shirt costume with Captain America mask. Small size.",
    image: "https://th.bing.com/th/id/OIP.3H7Jxl03pLcHtqWiopzXAgHaHa?o=7rm=3&rs=1&pid=ImgDetMain",
    price: 10.36,
    weight: 0.31,
  },
  {
    id: 4,
    title: "Attack On Titan Levi Wallet",
    description: "Compact Levi-themed wallet from Attack on Titan – perfect for anime fans.",
    image: "https://m.media-amazon.com/images/I/61eBwttNcLL.__AC_SX300_SY300_QL70_ML2_.jpg",
    price: 24.53,
    weight: 0.1,
  },
  {
    id: 5,
    title: "2-Tone Costume Wig",
    description: "Colorful 2-tone wig ideal for cosplay, costumes, and themed parties.",
    image: "https://i.etsystatic.com/18769024/r/il/4f2b7f/5216925853/il_600x600.5216925853_w2ol.jpg",
    price: 14.73,
    weight: 0.8,
  },
  {
    id: 6,
    title: "Flash Logo Sticker - DC Comics",
    description: "Official DC Comics Flash logo vinyl sticker for customizing laptops, notebooks, etc.",
    image: "https://m.media-amazon.com/images/I/61jXjYEgx4L._AC_SX569_.jpg",
    price: 34.99,
    weight: 0.8,
  },
  {
    id: 7,
    title: "Medieval Princess Costume",
    description: "Elegant fuchsia-colored medieval princess dress costume for girls.",
    image: "https://i5.walmartimages.com/asr/9811a328-0a11-4ac2-8c17-32aee6bd177c.303a8ef2d7b0957aad4d9b12fad06122.jpeg?odnHeight=372&odnWidth=372&odnBg=FFFFFF",
    price: 22.58,
    weight: 0.8,
  },
  {
    id: 8,
    title: "Suede Cowboy Hat - Adult",
    description: "Classic brown suede cowboy hat for adult costume wear by Forum Novelties.",
    image: "https://i.ebayimg.com/images/g/0bsAAOSwzlFmIUjZ/s-l1600.jpg",
    price: 14.99,
    weight: 0.8,
  }
];



const Clothing = () => {
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
      <h2 className="text-3xl font-bold capitalize mb-6 text-center">Stylish Clothing</h2>
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

export default Clothing;