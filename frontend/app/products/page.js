import React from 'react';
import fetch from 'node-fetch';
import Link from 'next/link';

export default async function Products() {
  try {
    const response = await fetch('http://localhost:1337/api/products?populate=*', {
      cache: 'no-store',
    });
    const data = await response.json();
    const products = data.data;

    return (
      <div className='container mx-auto px-4'>
        <section className="text-gray-600 body-font">
          <div className="container px-5 py-24 mx-auto">
            <div className="flex flex-wrap w-full mb-20">
              <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
                  Products List
                </h1>
                <div className="h-1 w-20 bg-indigo-500 rounded"></div>
              </div>
            </div>
            <div className="flex flex-wrap -m-4">
              {products.map((product) => {
                // Check for image formats
                const imageUrl = product.images?.[0]?.formats?.medium?.url
                  ? `http://localhost:1337${product.images[0].formats.medium.url}`
                  : product.images?.[0]?.url
                    ? `http://localhost:1337${product.images[0].url}`
                    : 'https://dummyimage.com/720x400';

                return (
                  <div key={product.id} className="xl:w-1/4 md:w-1/2 p-4">
                    <div className="bg-gray-100 p-6 rounded-lg h-full flex flex-col">
                      {/* Ensure images have a fixed height */}
                      <div className="flex-shrink-0">
                        <img
                          className="h-40 w-full object-cover object-center mb-6"
                          src={imageUrl}
                          alt={product.title || 'Product'}
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                          {product.category || 'No category'}
                        </h3>
                        <h3>{product.id}</h3>
                        <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                          {product.title || 'No title'}
                        </h2>
                        <p className="leading-relaxed text-base">
                          {product.descriptions || 'No description available'}
                        </p>
                        <p className="flex items-center space-x-2 text-gray-700">
                          <span
                            className={`border-2 rounded-full w-6 h-6`}
                            style={{ backgroundColor: product.color || 'transparent' }}
                          ></span>
                          <span>Color: {product.color || 'N/A'}</span>
                        </p>

                        <p className="text-gray-700">Price: ${product.price || 'N/A'}</p>

                        {/* Buy Now Button */}
                        <Link href={`/items/${product.id}`}>
                          <button className="my-4 text-white bg-indigo-500 border-0 py-1 md:py-2 px-2 md:px-4 focus:outline-none hover:bg-indigo-600 rounded text-sm">
                            Buy Now
                          </button>
                        </Link>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return <div>Error loading products. Please try again later.</div>;
  }
}
