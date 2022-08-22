import * as solanaWeb3 from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, Account, getMint, getAccount } from "@solana/spl-token";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { BaseWalletAdapter } from "@solana/wallet-adapter-base";

function MintToken() {

    const network = "Devnet";
    const connection = new solanaWeb3.Connection(network, "confirmed");

    const wallet= useAnchorWallet();
    const baseAccount = solanaWeb3.Keypair.generate();

    const toWallet = new solanaWeb3.PublicKey("7RWzfVNW9psot1Q5pJZVnYsw18yhSKvwng6fFFkVYDcm");
    let fromTokenAccount: Account;
    let mint: solanaWeb3.PublicKey;

    async function createToken() {
        const fromAirdropSignature = await connection.requestAirdrop(baseAccount.publicKey, 2*solanaWeb3.LAMPORTS_PER_SOL);

        mint = await createMint(
            connection, 
            baseAccount, 
            baseAccount.publicKey, 
            null, 
            9
        );
        console.log('Create Token:, ${mint.toBase58()}');

        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            baseAccount,
            mint,
            baseAccount.publicKey
        );

        console.log('Create Token Account: ${fromTokenAccount.address.toBase58()}')
    }

    async function mintToken() {
        const signature = await mintTo(
            connection,
            baseAccount,
            mint,
            fromTokenAccount.address,
            baseAccount.publicKey,
            1000000000
        );

        console.log('Signature: ${signature');
    }

    async function checkBalance() {
        const mintInfo = await getMint(connection, mint);
        console.log('Supply: ${mintInfo.supply}');

        const tokenAccountInfo = await getAccount(connection, fromTokenAccount.address);
        console.log('Amount in token Account: ${tokenAccountInfo.supply}');
    }

    async function sendToken() {
        const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            baseAccount,
            mint,
            toWallet
        )
        console.log("Receiver's Address: $toTokenAccount.address");

        const signature = await transfer(
            connection,
            baseAccount,
            fromTokenAccount.address,
            toTokenAccount.address,
            baseAccount.publicKey,
            1000000000
        );

        console.log('Transfer Completed: ${signature');
    }

    return (
        <div>
            Mint Token Section
            <div>
                <button onClick={() =>  createToken()   }>Create Token</button>
                <button onClick={() =>  mintToken()     }>Mint Token</button>
                <button onClick={() =>  checkBalance()  }>Check Balance</button>
                <button onClick={() =>  sendToken()     }>Send Token</button>
            </div>
        </div>
    );
}


export default MintToken;
