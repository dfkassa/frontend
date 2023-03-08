import React from "react";
import * as wagmi from "wagmi";

const WagmiClient = React.createContext<undefined | ReturnType<typeof wagmi.createClient>>(undefined);

export default WagmiClient;
