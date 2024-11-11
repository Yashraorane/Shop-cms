import React from 'react';
import fetch from 'node-fetch';

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
                const imageUrl = product.images?.[0]?.formats?.medium?.url
                  ? `http://localhost:1337${product.images[0].formats.medium.url}`
                  : 'https://dummyimage.com/720x400';

                return (
                  <div key={product.id} className="xl:w-1/4 md:w-1/2 p-4">
                    <div className="bg-gray-100 p-6 rounded-lg">
                      <img
                        className="h-40 rounded w-full object-cover object-center mb-6"
                        src={imageUrl}
                        alt={product.title || 'Product'}
                      />
                      <h3 className="tracking-widest text-indigo-500 text-xs font-medium title-font">
                        {product.category || 'No category'}
                      </h3>
                      <h2 className="text-lg text-gray-900 font-medium title-font mb-4">
                        {product.title || 'No title'}
                      </h2>
                      <p className="leading-relaxed text-base">
                        {product.descriptions || 'No description available'}
                      </p>
                      <p className="text-gray-700">Color: {product.color || 'N/A'}</p>
                      <p className="text-gray-700">Price: ${product.price || 'N/A'}</p>

                      {/* Button with dynamic background color */}
                      <button
                        className={`border-2 border-gray-300 ml-1 rounded-full w-6 h-6 focus:outline-none`}
                        style={{ backgroundColor: product.color || 'transparent' }}
                      ></button>
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
