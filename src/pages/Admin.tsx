import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SuperAdminDashboard from "@/components/SuperAdminDashboard";

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and has admin role
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
          if (!data || data.role !== 'admin') {
            navigate('/shop');
          }
        });
    });
  }, [navigate]);

  return <SuperAdminDashboard />;
};

export default Admin;