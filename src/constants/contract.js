import { ethers } from "ethers";
import earnAbi from "./earnAbi.json"
// import mintAbi from "./mintAbi.json"
import tokenAbi from './tokenAbi.json'

// export const getGreenMintContract = (providerOrSigner) =>
//     new ethers.Contract(
//         import.meta.env.VITE_GREENMINT_ADDRESS,
//         mintAbi,
//         providerOrSigner
//     );

export const getGreenTokenContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_GREENTOKEN_ADDRESS,
        tokenAbi,
        providerOrSigner
    );

    // const add = import.meta.env.VITE_METERTOKEN_ADDRESS

    // console.log(add)

export const getGreenEarnContract = (providerOrSigner) =>
    new ethers.Contract(
        import.meta.env.VITE_GREENEARN_ADDRESS,
        earnAbi,
        providerOrSigner
    );