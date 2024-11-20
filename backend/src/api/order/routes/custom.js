//   module.exports = {
//     routes: [
//       {
//         method: 'GET',
//         path: '/orders/pretransaction',
//         handler: 'custom.exampleAction',
//       },
//     ],
//   };
  

module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/orders/create-checkout-session', // This matches the frontend request
        handler: 'custom.createCheckoutSession', // This calls your controller method
        config: {
          auth: false, // Temporarily disable authentication for testing
        },
      },
      {
        method: 'POST',
        path: '/orders/pretransaction',
        handler: 'custom.pre',  // Ensure this matches the controller
        config: {
          auth: false,  // Temporarily disable authentication for testing
        },
      },
      {
        method: 'POST',
        path: '/orders/posttransaction',
        handler: 'custom.post',
        config: {
            auth: false,  // Temporarily disable authentication for testing
          }, 
      },
      {
        method: 'POST',
        path: '/orders/payment-status',
        handler: 'custom.paymentStatus',  // Make sure this matches the controller
        config: {
          auth: false,  // Temporarily disable authentication for testing
        },
      },
    ],
  };
  