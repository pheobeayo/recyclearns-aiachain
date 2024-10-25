import { useState } from "react";
import emailjs from '@emailjs/browser';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Subscriber() {
  const [address, setAddress] = useState("");

  const handleChange = (e) => {
    setAddress(e.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (address.trim() === "") {
      toast.error("Please enter an email address");
      return;
    }

    const isValidEmail = address.includes("@") && address.includes(".com");

    if (isValidEmail) {
      try {
        // Send email using emailjs
        await emailjs.send(
          "service_1v8l5j4",
          "template_twj7zn9",
          {
            to_email: "pheobeayo@gmail.com",
            from_name: address,
            message: "Hello, I am a GreenRewards subscriber!",
          },
          "EK04mlc-t5tm-hZjF"
        );

        // Reset form field
        setAddress("");

        // Display success message or perform any other actions
        toast.success("Subscription added successfully!");
      } catch (error) {
        console.error("Error adding email:", error);
        // Display error message or perform any other error handling
        toast.error("Error adding. Please try again later.");
      }
    } else {
      toast.error("Please add a valid email");
    }
  };

  return (
    <div>
      <div className="">
        <form
          onSubmit={handleFormSubmit}
          className=" pt-[30px]"
        >
      <div className="flex">
            <input
              type="text"
              className="sm:mr-2 px-[6px] sm:px-[60px] 
              sm:py-3 border 
            border-gray-300 rounded-l-md 
            focus:outline-none focus:border-blue-500 bg-transparent font-mono"
              placeholder="Email Address"
              value={address}
              onChange={handleChange}
            />
            <button
              className="px-2 sm:px-4 py-2 bg-[#8BC34A] text-black
            rounded-r-md hover:bg-[#2A382A] 
            focus:outline-none font-mono"
              type="submit"
            >
              Subscribe
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}