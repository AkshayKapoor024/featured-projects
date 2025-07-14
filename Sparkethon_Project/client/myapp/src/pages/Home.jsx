import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const promos = [
  {
    title: "Fun-Packed Toys & Brain-Boosting Games for All Ages",
    link: `/category`,
    image:"https://th.bing.com/th/id/OIP.qtMnjBXSh_Yj0ephVg68fAHaEp?rs=1&pid=ImgDetMain",
    bg: "bg-blue-100",
  },
  
  {
    // Animated center promo (kept empty)
  },
  {
    title: "Modern Home & Kitchen Essentials for Smart Living",
    link: `/kitchen`,
    image: "https://wallpapers.com/images/file/kitchen-design-pictures-ka628co3irps7c1g.jpg",
    bg: "bg-gray-100",
  },
  
  {
    title: "Top Baby Gear & Gadgets for Tech-Savvy Parents",
    link: `/baby`,
    image: "https://png.pngtree.com/background/20210715/original/pngtree-pink-cute-baby-supplies-background-picture-image_1253985.jpg",
    bg: "bg-rose-100",
  },
  {
    title: "Stylish Men’s Clothing & Iconic Jewelry Collections",
    link: `/clothing`,
    image: "https://th.bing.com/th/id/OIP.b-6oTlLQLt0Np3lSsOd1yQHaE8?rs=1&pid=ImgDetMain",
    bg: "bg-amber-100",
  },
  {
    title: "Gear Up for Action: Sports & Outdoor Essentials You’ll Love",
    link: `/sports`,
    image: "https://th.bing.com/th/id/OIP.rHVEiM405vKnn9NW2C_o_gHaFq?rs=1&pid=ImgDetMain",
    bg: "bg-green-100",
  },
  {
    title: "Creative Art Supplies & DIY Craft Kits for Every Artist",
    link: `/art`,
    image: "https://www.financialexpress.com/wp-content/uploads/2024/03/Art-and-Craft-1.jpg",
    bg: "bg-pink-100",
  },
];


const sliderImages = [
  "https://cdn.shopify.com/s/files/1/0153/8863/files/Headphone-Zone-Experience-Studio-Homepage-Final_1300x.progressive.jpg?v=1626436828", // Headphones
  "https://thumbs.dreamstime.com/b/abstract-sunglasses-colored-lenses-discount-banner-sale-modern-design-fashion-trendy-154986353.jpg", // Sunglasses
  "https://png.pngtree.com/png-clipart/20220419/original/pngtree-simple-atmosphere-fashion-sneaker-banner-poster-png-image_7541732.png", // Sneakers
];

const HomePromos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {promos.map((promo, index) => {
        // Center animated div
        if (index === 1) {
          return (
            <div
              key="slider"
              className="md:col-span-2  lg:col-span-2 rounded-lg bg-gray-100 p-6 flex items-center justify-center relative overflow-hidden h-[350px]"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={sliderImages[currentIndex]}
                  src={sliderImages[currentIndex]}
                  alt="slider"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="h-full w-full object-contain absolute"
                />
              </AnimatePresence>
              <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-full shadow">
                <h2 className="font-bold text-xl text-gray-800">
                  Hot summer savings on trending items
                </h2>
              </div>
            </div>
          );
        }

        if (!promo.title) return null;

        return (
          <div
            key={index}
            className={`rounded-lg ${promo.bg} hover:shadow-lg transition`}
          >
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full rounded-xl h-60 object-cover mb-4"
            />
            <h3 className="text-lg px-4 font-semibold">{promo.title}</h3>
            <a
              href={promo.link}
              className="text-blue-600 underline px-4 text-sm mb-2 inline-block"
            >
              Shop now
            </a>
          </div>
        );
      })}
    </div>
  );
};

export default HomePromos;
