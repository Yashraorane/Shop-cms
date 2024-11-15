"use client";
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect , useContext } from 'react';
import CustomImage from '../../components/Image';
import { CartContext } from '../../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams(); 
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:1337/api/products?filters[id][$eq]=${id}&populate=*`);
          const data = await response.json();
          if (data?.data?.length > 0) {
            setProduct(data.data[0]);
          } else {
            console.error('Product not found');
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };
      fetchProduct();
    }
  }, [id]);

  // const addToCart = (id, quantity, price) => {
  //   // Example: Storing the cart item in localStorage
  //   const cart = JSON.parse(localStorage.getItem('cart')) || [];
  //   const newItem = { id, quantity, price, title: product?.title };
  //   cart.push(newItem);
  //   localStorage.setItem('cart', JSON.stringify(cart));
  //   alert('Item added to cart!');
  // };

  const handleAddToCart = () => {
    addToCart(id, 1, product.price);
   // alert('Item added to cart!');
  };

  const handleCheckout = () => {
    // Navigate to the checkout page
    router.push('/checkout');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const imageUrl = product.images?.[0]?.formats?.medium?.url
    ? `http://localhost:1337${product.images[0].formats.medium.url}`
    : 'https://dummyimage.com/720x400';

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-24 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <div className="lg:w-1/2 w-full lg:h-auto h-64 relative">
            <CustomImage
              src={imageUrl}
              alt={product.title || 'Product'}
            />
          </div>
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">{product.brand || 'No brand'}</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.title || 'No title'}</h1>
            <p className="leading-relaxed">{product.descriptions || 'No description available'}</p>
            <span className="title-font font-medium text-2xl text-gray-900">
              ${product.price || 'N/A'}
            </span>
            <div className="flex mt-4">
              {/* <button
                onClick={() => addToCart(id, 1, product.price)}
                className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded"
              > */}
              <button
                onClick={handleAddToCart}
                className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded"
              >
                Add to Cart
              </button>
              <button
                onClick={handleCheckout}
                className="flex ml-auto text-white bg-indigo-500 border-0 py-2 px-4 focus:outline-none hover:bg-indigo-600 rounded"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
