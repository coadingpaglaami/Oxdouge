import { authApi } from "@/api/authApi";
import { cartApi } from "@/api/cartApi";
import { couponApi } from "@/api/couponApi";
import { dashboardApi } from "@/api/dashboard";
import { ordersApi } from "@/api/ordersApi";
import { productApi } from "@/api/productApi";
import { shippingApi } from "@/api/shippingApi";
import { profileApi } from "@/api/profileApi"; // Import the profile API
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [couponApi.reducerPath]: couponApi.reducer,
    [shippingApi.reducerPath]: shippingApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      productApi.middleware,
      cartApi.middleware,
      couponApi.middleware,
      shippingApi.middleware,
      ordersApi.middleware,
      profileApi.middleware,
      dashboardApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
