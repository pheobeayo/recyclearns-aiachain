import React, { useState, useEffect } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Link } from "react-router-dom";
import useGetSeller from "../Hooks/useGetSeller";
import UseGetAllProduct from "../Hooks/UseGetAllProduct";
import LoadingSpinner from "./Loader/LoadingSpinner";
import { formatUnits } from "ethers";
import emptyCart from "../assets/cart.png";

const UserSellerProfile = () => {
  const allProduct = UseGetAllProduct();
  const allSeller = useGetSeller();
  const { address } = useWeb3ModalAccount();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (allProduct.length > 0 && allSeller.length > 0) {
      setIsLoading(false);
    }
  }, [allProduct, allSeller]);

  const convertToWholeNumber = (formattedNumber) => {
    const number = parseFloat(formattedNumber);
    return Math.floor(number);
  };

  const userSeller = allSeller.find((data) => data?.address === address);
  const userProducts = allProduct.filter((info) => info?.address === address);

  return (
    <div>
      <h2 className="font-titiliumweb text-[20px] text-[#0F160F] lg:text-[24px] md:text-[24px] font-[700] mt-2">
        Listed Products
      </h2>
      <div className="flex mb-6 text-[#0F160F] items-center">
        <img
          src="https://img.freepik.com/free-psd/abstract-background-design_1297-86.jpg?t=st=1719630441~exp=1719634041~hmac=3d0adf83dadebd27f07e32abf8e0a5ed6929d940ed55342903cfc95e172f29b5&w=2000"
          alt=""
          className="w-[40px] h-[40px] rounded-full"
        />
        {userSeller ? (
          <p className="ml-4 font-bold">{userSeller.name}</p>
        ) : (
          <p>Unregistered.</p>
        )}
      </div>
      <div className="flex flex-col lg:flex-row justify-between flex-wrap md:flex-row">
        {isLoading ? (
          <LoadingSpinner />
        ) : userProducts.length === 0 ? (
          <div className="flex flex-col items-center w-full text-[rgb(15,22,15)]">
            <img src={emptyCart} alt="" className="w-[300px] h-[300px]" />
            <h2 className="text-[18px] lg:text-[24px] md:text-[24px] mb-4 text-center">
              No Product yet!
            </h2>
          </div>
        ) : (
          userProducts.map((info, index) => (
            <div
              key={index}
              className="w-[100%] lg:w-[31%] md:w-[31%] rounded-lg border border-bg-ash/35 bg-bg-gray p-4 mt-6"
            >
              <Link
                to={`/dashboard/market_place/${info.id}`}
                className="text-[#0F160F]"
              >
                <img
                  src={info.image}
                  alt=""
                  className="w-[100%] h-[237px] object-cover object-center rounded-lg"
                />
                <h3 className="font-bold mt-4 lg:text-[20px] md:text-[20px] text-[18px] capitalize">
                  {info.name}
                </h3>
                <p className="flex justify-between my-4">
                  Quantity <span>{Number(info.weight)}</span>
                </p>
                <p className="flex justify-between my-4">
                  Seller's location <span>{info.location}</span>
                </p>
                <p className="flex justify-between my-4 font-bold">
                  Price{" "}
                  <span>
                    {convertToWholeNumber(formatUnits(info.price))} ETH
                  </span>{" "}
                </p>
                <button className="my-4 border w-[100%] py-2 px-4 border-[#427142] text-[#427142] rounded-lg">
                  View details
                </button>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserSellerProfile;
