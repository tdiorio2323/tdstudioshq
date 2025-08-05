import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BrandDashboard from "@/components/BrandDashboard";

const Brand = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and has brand role
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
        return;
      }

      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()
        .then(({ data }) => {
          if (!data || data.role !== 'brand') {
            navigate('/shop');
          }
        });
    });
  }, [navigate]);

  return <BrandDashboard />;
};

export default Brand;