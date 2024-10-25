import { useCallback, useEffect, useState } from "react";
import { readOnlyProvider } from "../constants/providers";
import { getGreenEarnContract } from "../constants/contract";
import { wssProvider } from "../constants/providers";
import { ethers } from "ethers";

const useGetSeller = () => {
    const [allSeller, setAllSeller] = useState([]);
    const [count, setCount] = useState(0);

    const fetchAllSeller = useCallback(async () => {
        try {
            const contract = getGreenEarnContract(readOnlyProvider);
            const res = await contract.getallSeller();
            const converted = res?.map((item, index)=>{
                return{
                    address: item[0],
                    id: item[1],
                    name: item[2],
                    location: item[3],
                    mail: item[4],
                    product: item[5],
                    weight: item[6],
                    payment: item[7], 
              }      
            }) 
            setAllSeller(converted)
        } catch (error) {
            console.error(error);
        }
    }, []);

    const trackingSeller = useCallback(() => {
        setCount((prevValue) => prevValue + 1);
        fetchAllSeller();
    }, [fetchAllSeller]);


    useEffect(() => {
        fetchAllSeller();

        const filter = {
            address: import.meta.env.VITE_GREENEARN_ADDRESS ,
            topics: [ethers.id("ProfileCreated(address,string,uint)")],
        };

        wssProvider.getLogs({ ...filter, fromBlock: 59882972 }).then((events) => {
            setCount(events.length + 1);
        });

        const provider = new ethers.WebSocketProvider(
            import.meta.env.VITE_WSS_RPC_URL
        );
        provider.on(filter, trackingSeller);

        return () => {
            // Perform cleanup
            provider.off(filter, trackingSeller);
        };

    }, [fetchAllSeller, trackingSeller, count]);

    return allSeller;
}

export default useGetSeller;