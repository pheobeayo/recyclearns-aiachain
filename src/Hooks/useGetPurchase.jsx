import React, { useCallback, useState, useEffect } from "react";
import { readOnlyProvider, wssProvider } from "../constants/providers";
import { getGreenEarnContract } from "../constants/contract";
import { ethers } from "ethers";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

const useGetPurchase = () => {
    const [purchase, setPurchase] = useState()

    const fetchPurchase = async () => {
        try {
            const contract = getGreenEarnContract(readOnlyProvider)

            await contract.on("ProductBought", (address, uint, uint) => {
                console.log(address, uint, uint)
                setPurchase()
            })
        } catch(err) {

        }
    }
 

  return (
    <div></div>
  )
};

export default useGetPurchase;
