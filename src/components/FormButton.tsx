import { FC } from 'react';
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

export const FormPin: FC = () => {
  const { publicKey, signMessage } = useWallet();

  return (
    <Link href="/basics">
      <div>
          <button
              className="btn btn-ghost btn-md rounded-btn mgl-map-overlay ... "
              title="New pin!"
              hidden={!publicKey} disabled={!publicKey} 
          >
            <img src="/plus.png" height ="48" width="48" />
              <span className="block group-disabled:hidden" > 
              </span>
          </button>
      </div>
      </Link>
  );
};