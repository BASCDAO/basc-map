import { FC, useEffect } from 'react';
import Link from "next/link";

export const ContentContainer: FC = props => {

  return (
    <div className="flex-1 drawer h-52">
     {/* <div className="h-screen drawer drawer-mobile w-full"> */}
      <input id="my-drawer" type="checkbox" className="grow drawer-toggle" />
      <div className="items-center  drawer-content">
        {props.children}
      </div>

      {/* SideBar / Drawer */}
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="p-4 overflow-y-auto menu w-80 bg-base-100">
          <li>
            <h1>Links</h1>
          </li>
          <li>
          <Link href="https://www.bascdao.net/" passHref>
              <a target="_blank" rel="noopener noreferrer" >Website</a>
            </Link>
          </li>
          <li>
          <Link href="https://docs.bascdao.net/" passHref>
              <a target="_blank" rel="noopener noreferrer" >Whitepaper</a>
            </Link>
          </li>
          <li>
            <h1>Buy an Ape</h1>
          </li>
          <li>
            <Link href="https://magiceden.io/marketplace/bored_ape_solana_club" passHref>
              <a target="_blank" rel="noopener noreferrer" >MagicEden</a>
            </Link>
          </li>
          <li>
            <Link href="https://opensea.io/collection/bored-ape-solana-club" passHref>
              <a target="_blank" rel="noopener noreferrer" >OpenSea</a>
            </Link>
          </li>
          <li>
            <Link href="https://marketplace.weyu.io/collection/bored-ape-solana-club" passHref>
              <a target="_blank" rel="noopener noreferrer" >WEYU</a>
            </Link>
          </li>
          <li>
            <Link href="https://solanart.io/collections/basc?tab=items" passHref>
              <a target="_blank" rel="noopener noreferrer" >Solanart</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};