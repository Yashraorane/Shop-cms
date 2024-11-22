"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic"; // Ensure dynamic rendering

const Success = () => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const searchParams = useSearchParams();
    const session_id = searchParams.get('session_id');

    useEffect(() => {
        if (session_id) {
            const fetchPaymentStatus = async () => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/orders/payment-status`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ sessionId: session_id }),
                    });

                    const data = await response.json();
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
    }, [session_id]);

    if (!session_id || paymentStatus === null) {
        return <div>Loading your payment status...</div>;
    }

    return (
        <div className='min-h-screen'>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Your order has been {paymentStatus}</h1>
                        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Thank you for your purchase. Please check your email for the order details.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Success;
