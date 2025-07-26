import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import GooglePayButton from "@google-pay/button-react";

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.plan) {
    navigate("/subscriptions");
    return null;
  }

  const { name, price, quality, resolution, supportedDevices } = state.plan;

  const handlePaymentSuccess = async (paymentData) => {
    try {
      // Send payment data and selected plan to the backend
      const response = await fetch("/api/subscribe", {
        method: "POST",
        credentials: "include", // To send the cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: name }), // Send the selected plan
      });

      const data = await response.json();

      if (response.ok) {
        // If the backend confirms the subscription, show success and navigate
        alert(`Payment successful for ${name} plan!`);
        navigate("/dashboard"); // Or navigate to another page
      } else {
        alert("Something went wrong with the payment.");
      }
    } catch (error) {
      console.log("Error:", error.message);
      alert("There was an issue processing your payment.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-6">
      <motion.div
        className="bg-gray-900 p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-gray-700"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-extrabold mb-2 text-yellow-400">
          Subscribe to {name} Plan
        </h2>
        <p className="text-gray-300 mb-6">
          Get access to premium streaming features instantly.
        </p>

        <div className="bg-gray-800 rounded-md p-4 text-left text-sm mb-6">
          <p>
            <span className="font-semibold text-white">Plan:</span> {name}
          </p>
          <p>
            <span className="font-semibold text-white">Price:</span> ${price}/month
          </p>
          <p>
            <span className="font-semibold text-white">Video Quality:</span> {quality}
          </p>
          <p>
            <span className="font-semibold text-white">Resolution:</span> {resolution}
          </p>
          <p>
            <span className="font-semibold text-white">Supported Devices:</span>{" "}
            {supportedDevices}
          </p>
        </div>

        <h3 className="text-lg font-semibold text-gray-200 mb-2">
          Choose Payment Method
        </h3>

        {/* Google Pay Button */}
        <GooglePayButton
          environment="TEST"
          paymentRequest={{
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: [
              {
                type: "CARD",
                parameters: {
                  allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                  allowedCardNetworks: ["MASTERCARD", "VISA"],
                },
                tokenizationSpecification: {
                  type: "PAYMENT_GATEWAY",
                  parameters: {
                    gateway: "example",
                    gatewayMerchantId: "exampleGatewayMerchantId",
                  },
                },
              },
            ],
            merchantInfo: {
              merchantId: "12345678901234567890",
              merchantName: "Demo Merchant",
            },
            transactionInfo: {
              totalPriceStatus: "FINAL",
              totalPriceLabel: "Total",
              totalPrice: price,
              currencyCode: "USD",
              countryCode: "US",
            },
          }}
          onLoadPaymentData={async (paymentData) => {
            // Call function to handle payment success
            await handlePaymentSuccess(paymentData);
          }}
        />

        {/* Other payment methods can go here (Stripe, Razorpay, etc.) */}

        <div className="text-gray-400 text-xs mt-6 flex items-center justify-center gap-2">
          <ShieldCheck size={16} />
          <span>Payments are 100% secure and encrypted.</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
