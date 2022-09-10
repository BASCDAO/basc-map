import { PublicKey } from "@solana/web3.js"
import { programs } from "@metaplex/js"
import { useCallback, useEffect, useState } from "react"
import { getNFTsByVault } from "../utils/nfts"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export type sNFT = {
  pubkey?: PublicKey
  mint: PublicKey
  onchainMetadata: programs.metadata.MetadataData
  externalMetadata: {
    attributes: Array<any>
    collection: any
    description: string
    edition: number
    external_url: string
    image: string
    name: string
    properties: {
      files: Array<string>
      category: string
      creators: Array<{
        pubKey: string
        address: string
      }>
    }
    seller_fee_basis_points: number
  }
}

const useStakedNFTs = (creators: string[] = []) => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [stakedNFTs, setStakedNFTs] = useState<Array<sNFT> | null>(null)
  
  const fetchNFTs = useCallback(async () => {
    const NFTs = await getNFTsByVault(publicKey, connection)
    const filtered = creators
      ? NFTs.filter((NFT) => {
          const obj = NFT.onchainMetadata?.updateAuthority == "BasC5At2AGkUi2ApemqAgmfPUUSRP76VjWi9Jek8uLrZ" && NFT.onchainMetadata?.data.symbol == "BASC"
          return obj
        })
      : NFTs
    setStakedNFTs(filtered)
  }, [connection, publicKey])

  useEffect(() => {
    if (publicKey) {
      fetchNFTs()
    }
  }, [publicKey])

  return { stakedNFTs, fetchNFTs }
}

export default useStakedNFTs