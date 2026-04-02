//! CKB-VM entry (RISC-V executable — deploy this binary to chain).
#![no_std]
#![no_main]

ckb_std::default_alloc!();
ckb_std::entry!(program_entry);

fn program_entry() -> i8 {
    escrow_rust::run_contract()
}
