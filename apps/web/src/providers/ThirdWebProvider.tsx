'use client';

import React from 'react';
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";

interface ThirdWebProviderProps {
  children: React.ReactNode;
}

const ThirdWebProvider: React.FC<ThirdWebProviderProps> = ({ children }) => {
  return (
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      authConfig={{
        domain: process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN || "localhost:3000",
        authUrl: "/api/auth",
      }}
    >
      {children}
    </ThirdwebProvider>
  );
};

export default ThirdWebProvider;