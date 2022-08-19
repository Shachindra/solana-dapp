import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider, useAnchorWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolletWalletAdapter,  } from '@solana/wallet-adapter-wallets';
import * as solanaWeb3 from '@solana/web3.js';
import {Program, Provider, web3, BN } from "@project-serum/anchor";
import React, { FC, ReactNode, useMemo } from 'react';
import idl from './dapp.json';

require('./App.css');
require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC = () => {
    return (
        <Context>
            <Content />
        </Context>
    );
};
export default App;

const Context: FC<{ children: ReactNode }> = ({ children }) => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => solanaWeb3.clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            /**
             * Select the wallets you wish to support, by instantiating wallet adapters here.
             *
             * Common adapters can be found in the npm package `@solana/wallet-adapter-wallets`.
             * That package supports tree shaking and lazy loading -- only the wallets you import
             * will be compiled into your application, and only the dependencies of wallets that
             * your users connect to will be loaded.
             */
            new PhantomWalletAdapter(),
            new SolletWalletAdapter({network})
        ],
        []
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Content: FC = () => {
    const wallet= useAnchorWallet();
    const  baseAccount = solanaWeb3.Keypair.generate();

    function getProvider() {
        if (!wallet) {
            return null;
        }
        const network = "";
        const connection = new Connection(network, "processed");

        const provider = new Provider(connection, wallet, {"preFlightCommitment": "processed"});
        return provider;
    }

    async function createCounter() {
        const provider = getProvider();
        if (!provider) {
          throw("No provider");
        }
        const a = JSON.stringify(idl);
        const b = JSON.parse(a);
    
        const program = new Program(b, new solanaWeb3.PublicKey(idl.metadata.address), provider);
    
        try{
            await program.rpc.inititalize({
                accounts: {
                    myAccount: baseAccount.publicKey,
                    user: provider.wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                },
                Signers: [baseAccount]
            });
            
            const account = await program.account.myAccount.fetch(baseAccount.publicKey);
            console.log('Account: ', account);
        } catch(err) {
            console.log('Error: ', err);
        }
    }

    return (
        <div className="App">
            <button onClick = {createCounter}>Initialize</button>
            <button onClick = {createCounter} >Increment</button>
            <button>Decrement</button>
            <button>Update</button>
            <WalletMultiButton />
        </div>
    );

}