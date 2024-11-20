"use client"
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import NavBar from "./components/NavBar";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();
  const handleViewAllProducts = () => {
    router.push("/products");
  };
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <img
        src="../bg.jpg"
        alt="hero"
        className="object-cover object-top w-[100vw] h-[28vh]"
      />

      {/* Featured Products */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h2 className="text-xs text-indigo-500 tracking-widest font-medium title-font mb-1">
              SHOP THE COLLECTION
            </h2>
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              Discover Exclusive Deals
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Explore our curated collection of high-quality products. Find the perfect item that matches your style and needs.
            </p>
          </div>
          <div className="flex flex-wrap">
            {/* Product Cards */}
            {[
              {
                name: "Stylish Sneakers",
                description: "Trendy and comfortable sneakers for everyday wear.",
                price: "$79",
              },
              {
                name: "Wireless Headphones",
                description: "High-quality audio with noise-canceling features.",
                price: "$199",
              },
              {
                name: "Smartwatch",
                description: "Stay connected and track your fitness goals.",
                price: "$129",
              },
              {
                name: "Designer Backpack",
                description: "Spacious and stylish for all your essentials.",
                price: "$59",
              },
            ].map((product, index) => (
              <div
                key={index}
                className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60"
              >
                <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">
                  {product.name}
                </h2>
                <p className="leading-relaxed text-base mb-4">
                  {product.description}
                </p>
                <p className="font-bold text-gray-900">{product.price}</p>
                <button className="text-indigo-500 inline-flex items-center mt-4">
                  Add to Cart
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleViewAllProducts}
            className="flex mx-auto mt-16 text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
          >
            Start Shopping
          </button>
        </div>
      </section>
    </div>
  );
}
