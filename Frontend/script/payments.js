

const stripePublic = Stripe("pk_test_51KA2KGAuoyYpNXzKv51S8F2syAcCLM5T4Lmz6Z52RfdpwA1KjRGVz0Hx1oVygcNkCKT7HZ1L5pn2EdnFsSKDjgcb00qLtANYtN")


const btnComprarPayments = document.getElementById('btnComprar')
const form = document.getElementById('payment-form');


btnComprarPayments.addEventListener('click', e =>{
    initPayment()
})


const initPayment = async e=>{
    const shoopingCar = JSON.parse(localStorage.getItem('carrito'))
    try {
        let res = await axios.post('http://localhost:4000/create-checkout-session',shoopingCar)
        const {client_secret} = await res.data
        const clientSecret = client_secret
        /* const options = {
          clientSecret : client_secret,
          appearance : {
            theme: 'flat',
            variables: {
              fontWeightNormal: '500',
              borderRadius: '2px',
              colorBackground: 'white',
              colorPrimary: '#DF1B41',
              colorPrimaryText: 'white',
              spacingGridRow: '15px'
            },
            rules: {
              '.Label': {
                marginBottom: '6px'
              },
              '.Tab, .Input, .Block': {
                boxShadow: '0px 3px 10px rgba(18, 42, 66, 0.08)',
                padding: '12px'
              }
            }
          }

        } */
        const appearance = {
          theme: 'flat',
          variables: {
            fontWeightNormal: '500',
            borderRadius: '2px',
            colorBackground: 'white',
            colorPrimary: '#DF1B41',
            colorPrimaryText: 'white',
            spacingGridRow: '15px'
          },
          rules: {
            '.Label': {
              marginBottom: '6px'
            },
            '.Tab, .Input, .Block': {
              boxShadow: '0px 3px 10px rgba(18, 42, 66, 0.08)',
              padding: '12px'
            }
          }
        };
        
        const elements = stripePublic.elements({clientSecret, appearance});
        console.log(elements);
        
        const paymentElement = elements.create('payment');
        paymentElement.mount('#payment-element');

    } catch (error) {
        
    }

}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  const {error} = await stripePublic.confirmPayment({
    //`Elements` instance that was used to create the Payment Element
    elements,
    confirmParams: {
      return_url: 'http://127.0.0.1:5500/Frontend/Usuarios/payment/payment.html',
    },
  });

  if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (e.g., payment
    // details incomplete)
    const messageContainer = document.querySelector('#error-message');
    messageContainer.textContent = error.message;
  } else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
});




/* const options = {
    clientSecret: '{{CLIENT_SECRET}}',
    // Fully customizable with appearance API.
    appearance: },
  };
  
  // Set up Stripe.js and Elements to use in checkout form, passing the client secret obtained in step 2
  const elements = stripe.elements(options);
  
  // Create and mount the Payment Element
  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element'); */


  document.addEventListener("DOMContentLoaded", ()=>{
   
  });