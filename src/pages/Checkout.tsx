import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckoutFlow } from "@/components/CheckoutFlow";

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    // Get cart data from sessionStorage
    const storedItems = sessionStorage.getItem('cartItems');
    const storedTotal = sessionStorage.getItem('cartTotal');
    
    if (storedItems && storedTotal) {
      setCartItems(JSON.parse(storedItems));
      setCartTotal(parseInt(storedTotal));
    } else {
      // No cart data, redirect to shop
      navigate('/shop');
    }
  }, [navigate]);

  const handleBack = () => {
    navigate('/shop');
  };

  const handleOrderComplete = () => {
    // Clear cart data
    sessionStorage.removeItem('cartItems');
    sessionStorage.removeItem('cartTotal');
    navigate('/shop');
  };

  return (
    <CheckoutFlow
      cartItems={cartItems}
      total={cartTotal}
      onBack={handleBack}
      onOrderComplete={handleOrderComplete}
    />
  );
};

export default Checkout;