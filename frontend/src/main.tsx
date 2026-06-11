// import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./lib/queryClient"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import App from "./App"
import "./index.css"

import {
  AuthProvider,
} from "./contexts/AuthContext"


ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter> 
        <App /> 
      </BrowserRouter>
    </AuthProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
)