import  { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { getProvider }from '../constants/providers'
import { isSupportedChain } from '../connection/index'
import { getGreenEarnContract } from '../constants/contract';
import { IoClose } from "react-icons/io5";
import { ethers } from "ethers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    color: 'white',
    transform: 'translate(-50%, -50%)',
    width: 400,
    borderRadius: 10,
    boxShadow: 24,
    border: '1px solid #42714262',
    backgroundColor: '#1E1D34',
    p: 4,
  };

const EditProduct = ({id}) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [showForm, setShowForm] = useState(false)
    const [showUpload, setShowUpload] = useState(true)
    const [selectedFile, setSelectedFile] = useState();
    const [imageUrl, setImageUrl] = useState('')
    const [productName, setProductName] = useState('')
    const [productWeight, setProductWeight] = useState('')
    const [productDesc, setProductDesc] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [error, setError] = useState('');

    const { chainId } = useWeb3ModalAccount();
    const { walletProvider } = useWeb3ModalProvider()
    const [isConnected, setIsConnected] = useState(false);
  
   const handleCloseModal = () => {
      setShowForm(false);
   };

    const changeHandler = (event) => {
      const file = event.target.files[0];
      if (file) {
        const fileSizeInMB = file.size / (1024 * 1024); // Convert file size to MB
        if (fileSizeInMB > 1) {
          setError('File size exceeds 1MB. Please choose a smaller file.');
          setSelectedFile(null);
        } else {
          setError('');
          setSelectedFile(file);
        }
      }
    };
    
      useEffect(() => {
        if (walletProvider) {
          setIsConnected(true);
        }
      }, [walletProvider]);
  
    const handleSubmission = async () => {
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        const metadata = JSON.stringify({
          name: "Avatar",
        });
        formData.append("pinataMetadata", metadata);
        setShowForm(true)
        setShowUpload(false)
  
        const options = JSON.stringify({
          cidVersion: 0,
        });
        formData.append("pinataOptions", options);
  
        const res = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
            },
            body: formData,
          }
        );
        const resData = await res.json();
        setImageUrl(`ipfs://${resData.IpfsHash}`);
     
        toast.success("Image Upload Successful", {
          position: "top-center",
        }) 
      } catch (error) {
        toast.error("Image Upload Failed", {
            position: "top-center",
          }) 
        console.log(error);
      }
    };

    async function handleEditProduct() {
      if (!isSupportedChain(chainId)) return console.error("Wrong network");
      const readWriteProvider = getProvider(walletProvider);
      const signer = await readWriteProvider.getSigner();
  
      const contract = getGreenEarnContract(signer);
  
      try {
        const _amount = ethers.parseUnits(productPrice)
        const transaction = await contract.updateProduct(id, productName, imageUrl, productDesc, _amount, productWeight);
        console.log("transaction: ", transaction);
        const receipt = await transaction.wait();
  
        console.log("receipt: ", receipt);
  
        if (receipt.status) {
          return toast.success("Product edit successful!", {
            position: "top-center",
          });
        }
  
        toast.error("Product edit failed", {
          position: "top-center",
        });
      } catch (error) {
        console.error(error);
        toast.error("Product edit failed!", {
          position: "top-center",
        });
      } finally {
        setImageUrl("")
        setProductDesc("")
        setProductName("")
        setProductWeight("")
        setProductPrice("")
  
        setOpen(false)
      }
    };
  

  return (
    <div>
    <div className=''>
      <button className='bg-[#015C28] py-2 text-white mb-4 ppx-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold'  onClick={handleOpen}>Edit Information</button>
    {showUpload && (<Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <label className="form-label font-bold text-[20px] font-titiliumweb">Select a Product Image</label>
          <p>File must not be more than 100KB </p>
          <input type="file" onChange={changeHandler} className='my-4'/>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button className="bg-white text-[#427142] py-2 px-4 rounded-lg font-bold text-[16px] w-[100%] my-2 hover:bg-bg-ash hover:text-darkGrey hover:font-bold" onClick={handleSubmission}>Submit</button>  
        </Box>
      </Modal>)}
       {showForm && (<div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-75'>
           <div className='p-8 rounded-lg text-[#0F160F] flex flex-col items-center bg-[#2a2a2a] lg:w-[30%] md:w-[30%] w-[90%] mx-auto'>
            <IoClose  className='self-end mb-4 font-bold text-2xl text-white' onClick={handleCloseModal} />
          <input type="text" placeholder='Product Id' className="rounded-lg w-[100%] text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none" value={id} readOnly/>
          <input type="text" placeholder='Product Name' className="rounded-lg w-[100%] text-white p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none" onChange={(e) => setProductName(e.target.value)} />
          <input type="text" placeholder='Image Url' className="rounded-lg w-[100%] text-white border border-white/50 p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" value={imageUrl} readOnly />
          <input type="text" placeholder='Description' className="rounded-lg w-[100%] border text-white border-white/50 p-4 bg-[#ffffff23] backdrop-blur-lg mb-4 outline-none" onChange={(e) => setProductDesc(e.target.value)} />
          <input type="text" placeholder='Weight' onChange={(e) => setProductWeight(e.target.value)}  className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none" />
          <input type="text" placeholder='Price' onChange={(e) => setProductPrice(e.target.value)}  className="text-white rounded-lg w-[100%] p-4 bg-[#ffffff23] border border-white/50 backdrop-blur-lg mb-4 outline-none" />
          <button className="bg-[#427142] text-[white] py-2 px-4 rounded-lg lg:text-[20px] md:text-[20px] font-bold text-[16px] w-[100%] my-4" onClick={handleEditProduct}>Edit Product &rarr;</button>
       </div>
       </div>)}
    </div>
  </div>
  )
}

export default EditProduct