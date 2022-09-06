import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useCallback, useEffect, useState } from "react";
import { sign } from "tweetnacl";
import { notify } from "../utils/notifications";
import Link from "next/link";
import bs58 from "bs58";
import axios from "axios";
import citiesByCountries from "../utils/cities";
import useWalletNFTs, { NFT } from "../hooks/useWalletNFTs";

export const ShowForm: FC = () => {
  const { publicKey, signMessage } = useWallet();
  const [PK, setPK] = useState("");
  const [name, setName] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [mints, setMints] = useState("");
  const [selectedPFP, setSelectedPFP] = useState("");
  const [selectedPFPHistory, setSelectedPFPHistory] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mintInfo, setMintInfo] = useState("");

  const onClick = useCallback(async () => {
    try {
      // `publicKey` will be null if the wallet isn't connected
      if (!publicKey) throw new Error("Wallet not connected!");
      // `signMessage` will be undefined if the wallet doesn't support it
      if (!signMessage)
        throw new Error("Wallet does not support message signing!");
      // Encode anything as bytes
      const message = new TextEncoder().encode("Hello, world!");
      // Sign the bytes using the wallet
      const signature = await signMessage(message);
      // Verify that the bytes were signed using the private key that matches the known public key
      if (!sign.detached.verify(message, signature, publicKey.toBytes()))
        throw new Error("Invalid signature!");
      notify({
        type: "success",
        message: "Sign message successful!",
        txid: bs58.encode(signature),
      });
    } catch (error: any) {
      notify({
        type: "error",
        message: `Sign Message failed!`,
        description: error?.message,
      });
      console.log("error", `Sign Message failed! ${error?.message}`);
    }
  }, [publicKey, notify, signMessage]);

  const selectCountryString = "Select a Country";
  const selectCityString = "Select a City";
  const selectPFPString = "Select Mint";

  const countries = Object.keys(citiesByCountries).sort();
  const countryData = citiesByCountries[country]?.sort();

  if (countryData && countryData[0].city !== selectCityString) {
    countryData.unshift({
      city: selectCityString,
    });
  } else {
  }

  if (!PK && publicKey) {
    setPK(publicKey.toBase58());
  } else {
  }
  const { walletNFTs } = useWalletNFTs();
  const tempMints = [];
  if (walletNFTs) {
    for (var i = 0; i < walletNFTs.length; i++) {
      tempMints.push(walletNFTs[i].externalMetadata.name);
    }
  }

  if (walletNFTs) {
    if (selectedPFP !== selectedPFPHistory) {
      let obj = walletNFTs.find((o, i) => {
        if (o.externalMetadata.name === selectedPFP) {
          setMintInfo(walletNFTs[i].externalMetadata.image);
          setSelectedPFPHistory(walletNFTs[i].externalMetadata.name);
        }
      });
    } else {
    }
  }
  const validateForm = () => {
    const isURL = (userInput) => {
      return userInput.match(
        /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
      );
    };
    if (!selectedPFP) {
      setErrorMessage("Name cannot be empty");
      return;
    }
    if (!name) {
      setErrorMessage("Name cannot be empty");
      return;
    }
    if (isURL(name)) {
      setErrorMessage("No links allowed");
      return;
    }
    if (isURL(twitter)) {
      setErrorMessage("No links allowed. Only Twitter ID without the @");
      return;
    }
    if (isURL(discord)) {
      setErrorMessage("No links allowed. Only Discord ID with #");
      return;
    }
    if (name.length > 15) {
      setErrorMessage("Name too long");
      return;
    }
    if (twitter.length > 25) {
      setErrorMessage("Twitter ID too long");
      return;
    }
    if (discord.length > 32) {
      setErrorMessage("Discord ID too long");
      return;
    }
    if (!twitter) {
      setErrorMessage("Twitter ID cannot be empty");
      return;
    }
    if (!country || country === selectCountryString) {
      setErrorMessage("Country cannot be empty");
      return;
    }
    if (!city || city === selectCityString) {
      setErrorMessage("City cannot be empty");
      return;
    }
    setErrorMessage("");
    return true;
  };

  const requestSignMessage = async () => {
    if(!validateForm()) {
      return;
    }
    try {
      if (!publicKey) throw new Error("Wallet not connected!");
      if (!signMessage)
        throw new Error("Wallet does not support message signing!");

      // Encode anything as bytes
      const countryCode = citiesByCountries[country].find(
        (item) => item.city === city
      );
      if (!countryCode.lat || !countryCode.lng) {
        console.log(countryCode);
      }
      countryCode.latitude =
        countryCode.lat + (Math.floor(Math.random() * (10 - 1 + 1)) + 1) / 100;
      countryCode.longitude =
        countryCode.lng + (Math.floor(Math.random() * (10 - 1 + 1)) + 1) / 100;
      //delete countryCode.lat;
      //delete countryCode.lng;
      countryCode.country = country;
      const signatureSummary = {
        name,
        twitter,
        discord,
        country,
        city,
      };
      console.log(mintInfo);
      const message = new TextEncoder().encode(
        JSON.stringify(signatureSummary, null, "\t")
      );
      const signature = await signMessage(message);
      const userDetails = {
        wallet: publicKey.toString(),
        country: countryCode,
        name: name,
        discord: discord,
        twitter: twitter,
        pfp: mintInfo,
        tokens: [],
        signatureMessage: {
          message: bs58.encode(message),
          encodedSignature: bs58.encode(signature),
          publicKey: bs58.encode(publicKey.toBytes()),
        },
      };
      /*
      const userDetails = {
        wallet: publicKey.toString(),
        name,
        twitter,
        discord,
        country: countryCode,
        tokens: walletNFTs,
        signatureMessage: {
          message: bs58.encode(message),
          encodedSignature: bs58.encode(signature),
          publicKey: bs58.encode(publicKey.toBytes()),
        }
      };
      */
      setIsLoading(true);
      //https://bascmap-express-api.vercel.app/users 
      //http://localhost:3001/users

      console.log(userDetails);
      await axios
        .post(process.env.NEXT_PUBLIC_API_KEY, {
          ...userDetails,
        })
        .then((res) => {
          setIsLoading(false);
          //onClose();
        })
        .catch((err) => {
          setIsLoading(false);
          console.error(err);
        });
    } catch (error) {
      alert(`Signing failed: ${error?.message}`);
    }
  };

  return (
    <form>
      <div className="grid gap-6 mb-6 lg:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Wallet
          </label>
          <input
            type="text"
            id="wallet"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={PK}
            disabled
          ></input>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Exxempt"
            required
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Twitter
          </label>
          <input
            type="text"
            id="twitter"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="@"
            required
            onChange={(e) => setTwitter(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Discord
          </label>
          <input
            type="text"
            id="discord"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Exxempt#0596"
            onChange={(e) => setDiscord(e.target.value)}
          ></input>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            Country
          </label>
          <select
            id="Country"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={selectCountryString}
            required
            onChange={(e) => {
              setCountry(e.target.value);
              setCity("");
            }}
          >
            {countries.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            City
          </label>
          <select
            id="City"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={selectCityString}
            required
            onChange={(e) => setCity(e.target.value)}
          >
            {countryData?.map((cityData) => (
              <option key={cityData.city}>{cityData.city}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
            PFP
          </label>
          <select
            id="pfp"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder={selectPFPString}
            required
            onChange={(e) => setSelectedPFP(e.target.value)}
          >
            {tempMints.map((SelectedPFP) => (
              <option key={SelectedPFP}>{SelectedPFP}</option>
            ))}
          </select>
        </div>
      </div>
      {/*<div className="flex items-start mb-6">
            <div className="flex items-center h-5">
            <input id="remember" type="checkbox" value="" className="w-4 h-4 bg-gray-50 rounded border border-gray-300 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800" required>
            </input>
            </div>
            <label className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-400">I agree with the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>.</label>
        </div>*/}
      <button
        type="button"
        className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        onClick={requestSignMessage}
      >
        Submit
      </button>
      <Link href="/">
      <button
        type="button"
        className="group w-60 m-2 btn animate-pulse disabled:animate-none bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
        
        onClick={requestSignMessage}
      >
        Cancel
      </button>
      </Link>
    </form>
  );
};
