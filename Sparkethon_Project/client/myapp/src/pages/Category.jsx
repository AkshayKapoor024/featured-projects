import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const toyItems = [
  {
    id: 1,
    title: "Airplane Studio Kit",
    description: "Design and build airplanes with this creative Guillow studio kit and travel case.",
    image: "https://m.media-amazon.com/images/I/81AOuZugIyL.jpg",
    price: 34.99,
    weight: 0.84,
  },
  {
    id: 2,
    title: "Woodstock Collage Puzzle - 500 pcs",
    description: "Colorful 500-piece puzzle featuring a Woodstock-themed collage, perfect for kids and adults.",
    image: "https://www.bobangles.com.au/wp-content/uploads/2024/06/W-10353BX-1.jpg",
    price: 17.49,
    weight: 0.83,
  },
  {
    id: 3,
    title: "Triangular Double-Tip Crayons",
    description: "Durable, easy-grip crayons with dual tips, great for kids' art and coloring fun.",
    image: "https://th.bing.com/th/id/R.e540768ae123aaf6bd6121d13c2fc44e?rik=Ko8eW%2bUxtVlXzg&riu=http%3a%2f%2froundeyesupply.com%2fcdn%2fshop%2ffiles%2f121017096.jpg%3fv%3d1684258029&ehk=qUA5fmvXQAW%2flCtGtleA6UiJD7RmfdDGZmbUoq4mNu0%3d&risl=&pid=ImgRaw&r=0",
    price: 97.68,
    weight: 0.8,
  },
  {
    id: 4,
    title: "Moonlite Story Projector Set",
    description: "Includes 3 magical story reels to be used with the Moonlite storybook projector for boys.",
    image: "https://mymoonlite.com/cdn/shop/files/3-STORY__0002_PRINCESS-12x10x2_72ppi_600x600.png?v=1728508538",
    price: 18.16,
    weight: 0.2,
  },
  {
    id: 5,
    title: "Black Canary Statue - DC Cover Girls",
    description: "Stylish collectible statue of Black Canary designed by Joëlle Jones, a must-have for DC fans.",
    image: "https://i.ebayimg.com/images/g/Vs0AAOSwfWFkk0-U/s-l1600.jpg",
    price: 84.61,
    weight: 0.8,
  },
  {
    id: 6,
    title: "Flash Logo Sticker - DC Comics",
    description: "Classic Flash superhero logo sticker to personalize notebooks, laptops, and more.",
    image: "https://i.pinimg.com/600x315/83/fc/b1/83fcb1cddaab7932f4a28995f1de1fa7.jpg",
    price: 4.99,
    weight: 0.8,
  },
  {
    id: 7,
    title: "ABC Melody Maker - Learning Toy",
    description: "Interactive toy that teaches ABCs through music and melodies for early learners.",
    image: "https://images-bucket.bonanzastatic.com/afu/images/f4f3/8575/3c9e_11887885234/__57.jpg",
    price: 34.39,
    weight: 0.8,
  },
  {
    id: 8,
    title: "Common Core Kit - Grade 5",
    description: "Comprehensive educational kit aligned with Common Core standards for 5th grade.",
    image: "https://m.media-amazon.com/images/I/814BzByZlQL._AC_.jpg",
    price: 12.88,
    weight: 0.8,
  }
];



const CategoryPage = () => {
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
      <h2 className="text-3xl font-bold capitalize mb-6 text-center">Toys and Games</h2>
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

export default CategoryPage;