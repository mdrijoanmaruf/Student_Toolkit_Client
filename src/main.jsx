import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'

import AuthProvider from './Contexts/AuthProvider.jsx'
import LoadingProvider from './Contexts/LoadingContext.jsx'
import LoadingWrapper from './Components/LoadingWrapper.jsx'
import { router } from './Route/route.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LoadingProvider>
      <AuthProvider>
        <LoadingWrapper>
          <RouterProvider router={router} />
        </LoadingWrapper>
      </AuthProvider>
    </LoadingProvider>
  </StrictMode>
)
