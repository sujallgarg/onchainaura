'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import {
  Wallet,
  ConnectWallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';

export default function ConnectWallett() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (typeof window !== 'undefined' && isConnected && address) {
      router.push(`/base/points?address=${address}`);
    }
  }, [isConnected, address, router]);

  return (
    <div className="flex justify-center w-full">
      <Wallet className=''>
        <ConnectWallet className='bg-blue-800'>
          <Avatar className="h-6 w-6" />
          <Name />
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address className={color.foregroundMuted} />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
