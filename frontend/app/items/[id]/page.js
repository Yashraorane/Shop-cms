"use client";
import { useParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';


export default function ProductDetail() {
  const { id } = useParams(); 
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      console.log('id:', id);
      const fetchProduct = async () => {
        try {
          const response = await fetch(`http://localhost:1337/api/products?filters[id][$eq]=${id}&populate=*`);
          const data = await response.json();
          if (data?.data?.length > 0) {
            setProduct(data.data[0]);
          } else {
            console.error('Product not found');
            // Handle case when no product is found
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      };

      fetchProduct();
    }
  }, [id]);

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
          <img
            alt="ecommerce"
            className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded"
            src={imageUrl}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">{product.brand || 'No brand'}</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">{product.title || 'No title'}</h1>
            <p className="leading-relaxed">{product.descriptions || 'No description available'}</p>
            <span className="title-font font-medium text-2xl text-gray-900">
              ${product.price || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
