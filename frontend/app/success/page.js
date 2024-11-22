"use client";  // Ensure this is at the top of the file

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";  // Use this from next/navigation
import { loadStripe } from "@stripe/stripe-js";

const Success = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const searchParams = useSearchParams();  // Get query parameters with useSearchParams
    const session_id = searchParams.get('session_id');  // Extract session_id from query params

    useEffect(() => {
        if (session_id) {
            const fetchPaymentStatus = async () => {
                console.log('Fetching payment status for session:', session_id);
                try {
                    console.log(process.env.NEXT_PUBLIC_STRAPI_URL)
                    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/payment-status`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ sessionId: session_id }),
                    });


                    console.log('Response received:', response);
                    const data = await response.json();
                    console.log('Received data:', data);
                    if (data.status === 'paid') {
                        setPaymentStatus('Payment Successful!');
                    } else {
                        setPaymentStatus('Payment Failed!');
                    }
                } catch (error) {
                    console.error("Error fetching payment status:", error);
                    setPaymentStatus('Error checking payment status');
                }
            };

            fetchPaymentStatus();
        }
    }, [session_id]);  // This will re-run the effect when session_id changes

    if (!session_id) {
        return <div>Loading...</div>;  // Optionally handle loading state
    }

    return (
        <div className='min-h-screen'>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Your order has been {paymentStatus}</h1>
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven&apos;t heard of them man bun deep.</p>
                    </div>
                    <div className="flex lg:w-2/3 w-full sm:flex-row flex-col mx-auto px-8 sm:space-x-4 sm:space-y-0 space-y-4 sm:px-0 items-end">


                    </div>
                </div>
            </section>
        </div>
    );
};

export default Success;
