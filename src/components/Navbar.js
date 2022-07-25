import React, { useState, useEffect } from "react";
import { useMetamask, useDisconnect } from "@thirdweb-dev/react";
import { GiAmethyst } from "react-icons/gi";
import { SiHiveBlockchain } from "react-icons/si";

const Navbar = () => {
  const connectWallet = useMetamask();
  const disconnectWallet = useDisconnect();

  return (
    <div className="top-0 absolute py-4 w-full flex items-center">
      <div className="flex items-center">
        <GiAmethyst className="text-2xl" />
        <h2 className="pl-4 text-md font-semibold">Breaking Bad DAO</h2>
      </div>
      <div className="flex items-center">
        <SiHiveBlockchain />
        <h2>Rinkeby</h2>
        <button
          className="bg-gray-900 hover:bg-black-800 py-2 px-3 rounded-lg"
          onClick={connectWallet}
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Navbar;
