import { FC } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useAutoConnect } from "../contexts/AutoConnectProvider";
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';

export const AppBar: FC = (props) => {
  const { autoConnect, setAutoConnect } = useAutoConnect();
  const { publicKey, signMessage } = useWallet();
  const { networkConfiguration, setNetworkConfiguration } = useNetworkConfiguration();
  setNetworkConfiguration("mainnet-beta")

  if (publicKey) {
    return (

      <div>
        <div className="navbar flex flex-row md:mb-1 shadow-lg bg-neutral text-neutral-content bg-opacity-20">
          <div className="navbar-start">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <svg
                className="inline-block w-6 h-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>

          <div className="md:inline md:navbar-center">
            <div className="flex items-stretch">
              <img
                src="/logo-white.svg"
                alt="BASC"
                width="40"
                height="40"
              ></img>
            </div>
          </div>
          <div className="navbar-end">
            <WalletMultiButton className="btn btn-ghost mr-0" />
          </div>
        </div>
        {props.children}
      </div>
    );
  } else {
    return (
      <div>
        <div className="navbar flex flex-row md:mb-1 shadow-lg bg-neutral text-neutral-content bg-opacity-20">
          <div className="navbar-start">
            <label htmlFor="my-drawer" className="btn btn-square btn-ghost">
              <svg
                className="inline-block w-6 h-6 stroke-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>

          <div className="md:inline md:navbar-center">
            <div className="flex items-stretch">
              <img
                src="/logo-white.svg"
                alt="BASC"
                width="40"
                height="40"
              ></img>
            </div>
          </div>

          <div className="navbar-end">
            <WalletMultiButton className="btn btn-ghost mr-0" />
          </div>
        </div>
        {props.children}
      </div>
    );
  }
};