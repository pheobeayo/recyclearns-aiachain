import { useCallback, useEffect, useState } from "react";
import { readOnlyProvider } from "../constants/providers";
import { getGreenEarnContract } from "../constants/contract";
import { wssProvider } from "../constants/providers";
import { ethers } from "ethers";

const UseGetAllProduct = () => {
    const [allProduct, setAllProduct] = useState([]);
    const [count, setCount] = useState(0);

    const convertIpfsUrl = (url) => {
        if (url.startsWith("ipfs://")) {
            return url.replace("ipfs://", "https://ipfs.io/ipfs/");
        }
        return url;
    };

    const fetchAllProduct = useCallback(async () => {
        try {
            const contract = getGreenEarnContract(readOnlyProvider);
            const res = await contract.getAllproduct();
            const converted = res?.map((item, index)=>{
                return{id: index+1,
                    address: item[0],
                name: item[1],
                image: convertIpfsUrl(item[2]),
                location: item[3],
                product: item[4],
                price: item[5],
                weight: item[6],
                sold: item[7],
                inProgress: item[8]   
              }      
            }) 
            setAllProduct(converted)
        } catch (error) {
            console.error(error);
        }
    }, []);

    const trackingProduct = useCallback(() => {
        setCount((prevValue) => prevValue + 1);
        fetchAllProduct();
    }, [fetchAllProduct]);


    useEffect(() => {
        fetchAllProduct();

        const filter = {
            address: import.meta.env.VITE_GREENEARN_ADDRESS ,
            topics: [ethers.id("ProductListed(address,string,uint)")],
        };

        wssProvider.getLogs({ ...filter, fromBlock: 59882972 }).then((events) => {
            setCount(events.length + 1);
        });

        const provider = new ethers.WebSocketProvider(
            import.meta.env.VITE_WSS_RPC_URL
        );
        provider.on(filter, trackingProduct);

        return () => {
            // Perform cleanup
            provider.off(filter, trackingProduct);
        };

    }, [fetchAllProduct, trackingProduct, count]);

    return allProduct;
}

export default UseGetAllProduct;