use anchor_lang::prelude::*;

declare_id!("GDRakuVwr1yPP2wCdwtp2u6dCmZLWtzachrrLBnLTZJm");

#[program]
mod dapp {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, counter: u64) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.counter = counter;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, counter: u64) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.counter = counter;
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.counter += 1;
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        let my_account = &mut ctx.accounts.my_account;
        my_account.counter -= 1;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub my_account: Account<'info, MyAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,
}

#[derive(Accounts)]
pub struct Decrement<'info> {
    #[account(mut)]
    pub my_account: Account<'info, MyAccount>,
}

#[account]
pub struct MyAccount {
    pub counter: u64,
}
