'use client';

import { ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';

// Cliente ThirdWeb (necesario para v5)
const clientId = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || '3fb238b2e45cfe057ff5609ef406b378';

const client = createThirdwebClient({ 
  clientId: clientId
});

export default function ThirdWebProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}

export { client };
