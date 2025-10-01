import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";

// Lazy load components
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const MylarShop = lazy(() => import("./pages/MylarShop"));
const Admin = lazy(() => import("./pages/Admin"));
const Brand = lazy(() => import("./pages/Brand"));
const LinkTest = lazy(() => import("./pages/LinkTest"));
const Candyman = lazy(() => import("./pages/Candyman"));

// Keep Auth as synchronous since it's the landing page
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<div className="p-6">Loading…</div>}>
              <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/shop" element={<ErrorBoundary><Shop /></ErrorBoundary>} />
                <Route path="/shop/:id" element={<ErrorBoundary><ProductDetail /></ErrorBoundary>} />
                <Route path="/checkout" element={<ErrorBoundary><Checkout /></ErrorBoundary>} />
                <Route path="/mylars" element={<ErrorBoundary><MylarShop /></ErrorBoundary>} />
                <Route path="/mylars/:slug" element={<ErrorBoundary><MylarShop /></ErrorBoundary>} />
                <Route path="/admin" element={<ErrorBoundary><Admin /></ErrorBoundary>} />
                <Route path="/brand" element={<ErrorBoundary><Brand /></ErrorBoundary>} />
                <Route path="/linktest" element={<ErrorBoundary><LinkTest /></ErrorBoundary>} />
                <Route path="/candyman" element={<ErrorBoundary><Candyman /></ErrorBoundary>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
