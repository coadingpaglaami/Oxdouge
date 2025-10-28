// import { authApi } from "@/api/authApi";
// import { productApi } from "@/api/productApi";
// import { configureStore } from "@reduxjs/toolkit";

// export const store = configureStore({
//     reducer:{
//         [authApi.reducerPath]: authApi.reducer ,
//         [productApi.reducerPath]: productApi.reducer,
//        }
// })

import { authApi } from "@/api/authApi";
import { productApi } from "@/api/productApi";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, productApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
