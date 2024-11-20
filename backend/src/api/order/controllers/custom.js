const { createCoreController } = require('@strapi/strapi').factories;

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  
    async createCheckoutSession(ctx) {
        try {
            const { cart, form, amount } = ctx.request.body;
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: cart.map(item => ({
                    price_data: {
                        currency: 'gbp', // Change currency if needed
                        product_data: {
                            name: item[0],
                        },
                        unit_amount: item[1] * 100, // Stripe expects amount in cents
                    },
                    quantity: 1,
                })),
                mode: 'payment',
                success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            });

            ctx.send({ id: session.id });
        } catch (error) {
            console.error("Error creating Stripe checkout session:", error);
            ctx.throw(500, 'Failed to create Stripe session');
        }
    },
  
    async pre(ctx) {
    const { amount, email, orderId, cart, address, name } = ctx.request.body;

    try {
      // Create a payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Amount in smallest currency unit
        currency: 'usd',
        receipt_email: email,
        metadata: { orderId },
      });

      // Store the order in Strapi
      await strapi.entityService.create('api::order.order', {
        data: {
          email,
          orderid: orderId,
          paymentInfo: null,
          products: cart,
          address,
          name,
          transactionid: paymentIntent.id,
          amount,
          status: 'pending',
        },
      });

      // Respond with the client secret for the frontend to complete the payment
      ctx.send({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
      console.error(err);
      ctx.status = 500;
      ctx.send({ message: 'Internal Server Error', error: err.message });
    }
  },

//   async post(ctx) {
//     const sig = ctx.request.headers['stripe-signature'];
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Set your webhook secret in .env

//     try {
//       const event = stripe.webhooks.constructEvent(
//         ctx.request.body,
//         sig,
//         endpointSecret
//       );

//       if (event.type === 'payment_intent.succeeded') {
//         const paymentIntent = event.data.object;

//         // Find the order in Strapi based on the payment intent ID
//         const order = await strapi.entityService.findMany('api::order.order', {
//           filters: { transactionid: paymentIntent.id },
//         });

//         if (order.length > 0) {
//           // Update the order status to 'completed'
//           await strapi.entityService.update('api::order.order', order[0].id, {
//             data: {
//               status: 'completed',
//               paymentInfo: JSON.stringify(paymentIntent),
//             },
//           });

//           ctx.send({ message: 'Order updated successfully' });
//         } else {
//           ctx.status = 404;
//           ctx.send({ message: 'Order not found' });
//         }
//       } else if (event.type === 'payment_intent.payment_failed') {
//         const paymentIntent = event.data.object;

//         // Find the order and update the status to 'failed'
//         const order = await strapi.entityService.findMany('api::order.order', {
//           filters: { transactionid: paymentIntent.id },
//         });

//         if (order.length > 0) {
//           await strapi.entityService.update('api::order.order', order[0].id, {
//             data: {
//               status: 'failed',
//               paymentInfo: JSON.stringify(paymentIntent),
//             },
//           });

//           ctx.send({ message: 'Order updated as failed' });
//         } else {
//           ctx.status = 404;
//           ctx.send({ message: 'Order not found' });
//         }
//       } else {
//         ctx.status = 400;
//         ctx.send({ message: 'Unhandled event type' });
//       }
//     } catch (err) {
//       console.error('Webhook error:', err.message);
//       ctx.status = 400;
//       ctx.send({ message: `Webhook Error: ${err.message}` });
//     }
//   },

async post(ctx) {
    const sig = ctx.request.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Set your webhook secret in .env

    try {
        const event = stripe.webhooks.constructEvent(
            ctx.request.body,
            sig,
            endpointSecret
        );

        if (event.type === 'charge.succeeded') {
            const charge = event.data.object;
            const paymentIntentId = charge.payment_intent;

            // Find the order in Strapi based on the payment intent ID
            const order = await strapi.entityService.findMany('api::order.order', {
                filters: { transactionid: paymentIntentId },
            });

            if (order.length > 0) {
                // Update the order status to 'completed'
                await strapi.entityService.update('api::order.order', order[0].id, {
                    data: {
                        status: 'completed',
                        paymentInfo: JSON.stringify(charge),
                    },
                });

                ctx.send({ message: 'Order updated successfully' });
            } else {
                ctx.status = 404;
                ctx.send({ message: 'Order not found' });
            }
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;

            // Find the order and update the status to 'failed'
            const order = await strapi.entityService.findMany('api::order.order', {
                filters: { transactionid: paymentIntent.id },
            });

            if (order.length > 0) {
                await strapi.entityService.update('api::order.order', order[0].id, {
                    data: {
                        status: 'failed',
                        paymentInfo: JSON.stringify(paymentIntent),
                    },
                });

                ctx.send({ message: 'Order updated as failed' });
            } else {
                ctx.status = 404;
                ctx.send({ message: 'Order not found' });
            }
        } else {
            ctx.status = 400;
            ctx.send({ message: 'Unhandled event type' });
        }
    } catch (err) {
        console.error('Webhook error:', err.message);
        ctx.status = 400;
        ctx.send({ message: `Webhook Error: ${err.message}` });
    }
},
  

// async paymentStatus(ctx) {
//     try {
//         const { sessionId } = ctx.request.body;
//         const session = await stripe.checkout.sessions.retrieve(sessionId);

//         // Here you could update the order status or check other details
//         const paymentStatus = session.payment_status; // 'paid' or 'unpaid'

//         ctx.send({ status: paymentStatus });
//     } catch (error) {
//         console.error('Error fetching payment status:', error);
//         ctx.throw(500, 'Error fetching payment status');
//     }
// },

async paymentStatus(ctx) {
    try {
        const { sessionId } = ctx.request.body;
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('Stripe session:', session);

        // Verify order retrieval
        const order = await strapi.entityService.findMany('api::order.order', {
            filters: { transactionId: sessionId }, // Make sure this field matches your Strapi model
        });
        console.log('Order found:', order);

        if (order.length > 0 && session.payment_status === 'paid') {
            await strapi.entityService.update('api::order.order', order[0].id, {
                data: {
                    status: 'completed',
                    paymentInfo: JSON.stringify(session),
                    publishedAt: new Date(),
                },
            });
            ctx.send({ status: 'Order marked as completed and published' });
        } else {
            ctx.send({ status: session.payment_status, message: 'Order not found or not paid' });
        }
    } catch (error) {
        console.error('Error fetching payment status:', error);
        ctx.throw(500, 'Error fetching payment status');
    }
},


}));