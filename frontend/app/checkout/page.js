'use client';
import React, { useEffect, useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import Script from 'next/script';
import { loadStripe } from '@stripe/stripe-js';


const Checkout = () => {
    const { cart } = useContext(CartContext); // Access cart from context
    const [subtotal, setSubtotal] = useState(0);
    const [form, setForm] = useState({ name: "", email: "", address: "", phone: "" });
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

    useEffect(() => {
        // Calculate subtotal
        const total = cart.reduce((acc, item) => acc + item[1], 0);
        setSubtotal(total);
    }, [cart]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const submit = async () => {
        try {
            // Call your backend to create a checkout session
            const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cart, form, amount: subtotal }),
            });
            
            const session = await response.json();
            console.log('Stripe session ID:', session.id); // Debugging log

    
            // Redirect to Stripe Checkout
            const stripe = await stripePromise;
            if (stripe) {
                const { error } = await stripe.redirectToCheckout({ sessionId: session.id });
                if (error) {
                    console.error("Stripe redirection error:", error);
                }
            }
        } catch (error) {
            console.error("Error creating Stripe checkout session:", error);
        }
    };
    

    return (
        <div>
            <section className="text-black body-font relative">
                <div className="container px-5 py-24 mx-auto min-h-screen">
                    <div className="flex flex-col w-full mb-12">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-black">Checkout</h1>
                        <h2 className="text-2xl font-medium">Cart</h2>
                        <div className="cart">
                            {cart.length > 0 ? `Your cart details are as follows:` : `Your cart is empty!`}
                        </div>
                        <ul className="list-decimal px-8">
                            {cart.map((item, index) => (
                                <li key={index}>
                                    Product {item[0]} with a price of ${item[1]}
                                </li>
                            ))}
                        </ul>
                        <div className="font-bold">Subtotal: ${subtotal}</div>
                    </div>
                    <div className="flex flex-wrap -m-2">
                        <div className="p-2 w-1/2">
                            <div className="relative">
                                <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
                                <input onChange={handleChange} value={form.name} type="text" id="name" name="name" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>
                        <div className="p-2 w-1/2">
                            <div className="relative">
                                <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
                                <input onChange={handleChange} value={form.email} type="email" id="email" name="email" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>
                        <div className="p-2 w-1/2">
                            <div className="relative">
                                <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone</label>
                                <input onChange={handleChange} value={form.phone} type="tel" id="phone" name="phone" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 transition-colors duration-200 ease-in-out" />
                            </div>
                        </div>
                        <div className="p-2 w-full">
                            <div className="relative">
                                <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
                                <textarea onChange={handleChange} value={form.address} id="address" name="address" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none transition-colors duration-200 ease-in-out"></textarea>
                            </div>
                        </div>
                        <div className="p-2 w-full">
                            {/* <button onClick={submit} className="flex text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Pay Now</button> */}
                            <button onClick={submit} className="flex text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg">Pay Now</button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Checkout;
