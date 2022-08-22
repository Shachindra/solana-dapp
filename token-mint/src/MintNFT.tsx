import * as solanaWeb3 from "@solana/web3.js";
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer, Account, getMint, getAccount, createSetAuthorityInstruction, AuthorityType } from "@solana/spl-token";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { BaseWalletAdapter } from "@solana/wallet-adapter-base";

function MintNFT() {

    const network = "devnet";
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl(network), "confirmed");

    const baseAccount = solanaWeb3.Keypair.generate();

    const toWallet = new solanaWeb3.PublicKey("7RWzfVNW9psot1Q5pJZVnYsw18yhSKvwng6fFFkVYDcm");
    let fromTokenAccount: Account;
    let mint: solanaWeb3.PublicKey;

    async function createNFT() {
        const fromAirdropSignature = await connection.requestAirdrop(baseAccount.publicKey, 2 * solanaWeb3.LAMPORTS_PER_SOL);
        await connection.confirmTransaction(fromAirdropSignature);

        // const extensions = [ExtensionType.MintCloseAuthority];
        // const mintLen = getMintLen(extensions);
        // const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

        mint = await createMint(
            connection, 
            baseAccount, 
            baseAccount.publicKey, 
            null, 
            0 // 1000000000 = 10 SOL
        );
        console.log('Create NFT: ', mint.toBase58());

        fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            baseAccount,
            mint,
            baseAccount.publicKey
        );

        console.log('Create NFT Account: ', fromTokenAccount.address.toBase58());
    }

    async function mintNFT() {
        const signature = await mintTo(
            connection,
            baseAccount,
            mint,
            fromTokenAccount.address,
            baseAccount.publicKey,
            1 // Singleton NFT - Ask in next class?
        );

        console.log('Signature: ', signature);
    }

    async function lockNFT() {
        let transaction = new solanaWeb3.Transaction().add(createSetAuthorityInstruction(
            mint,
            baseAccount.publicKey,
            AuthorityType.MintTokens,
            null
        ));

        const signature = await solanaWeb3.sendAndConfirmTransaction(
            connection,
            transaction,
            [baseAccount]
        );
        console.log('Lock Signature: ', signature);
    }

    return (
        <div>
            Mint NFT Section
            <div>
                <button onClick={() =>  createNFT() }>Create Token</button>
                <button onClick={() =>  mintNFT()   }>Mint NFT</button>
                <button onClick={() =>  lockNFT()   }>Lock NFT</button>
            </div>
        </div>
    );
}

export default MintNFT;