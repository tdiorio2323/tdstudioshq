import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthPage } from "@/components/AuthPage";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
      supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Get user role from user_roles table
        supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              if (data.role === 'admin') {
                navigate('/admin');
              } else if (data.role === 'brand') {
                navigate('/brand');
              } else {
                navigate('/shop');
              }
            } else {
              // Default to shop if no role found
              navigate('/shop');
            }
          });
      }
    });
  }, [navigate]);

  return <AuthPage />;
};

export default Auth;