//! Escrow type script — v1 protocol (see `plan/rust-escrow-rewrite-spec.md`).
#![cfg_attr(test, allow(dead_code))]
#![cfg_attr(not(test), no_std)]
#![cfg_attr(not(test), no_main)]

use ckb_hash::blake2b_256;
use k256::ecdsa::{Signature as K256Signature, VerifyingKey};
use signature::hazmat::PrehashVerifier;

#[cfg(not(test))]
use ckb_std::ckb_constants::Source;
#[cfg(not(test))]
use ckb_std::high_level::{
    load_cell, load_input_since, load_script, load_tx_hash, load_witness_args,
};
#[cfg(not(test))]
use molecule::prelude::Reader;

/// Called from `main.rs` VM entry.
#[cfg(not(test))]
pub fn run_contract() -> i8 {
    match run() {
        Ok(()) => 0,
        Err(code) => code,
    }
}

pub const ERR_ARGS: i8 = 1;
pub const ERR_WITNESS: i8 = 2;
pub const ERR_UNKNOWN_TAG: i8 = 3;
pub const ERR_SIG: i8 = 4;
pub const ERR_OUTPUT: i8 = 5;
pub const ERR_SINCE: i8 = 6;

const TAG_RELEASE: u8 = 1;
const TAG_DISPUTE: u8 = 2;
const TAG_TIMEOUT: u8 = 3;

const SIG_LEN: usize = 64;
const PUBKEY_LEN: usize = 33;
pub const ESCROW_PAYLOAD_LEN: usize = 169;
const ESCROW_VERSION: u8 = 1;

#[cfg(not(test))]
fn run() -> Result<(), i8> {
    let script = load_script().map_err(|_| ERR_ARGS)?;
    let args = script.as_reader().args().raw_data();
    let payload = parse_escrow_payload(args)?;
    let dep = depositor_pk_hash(&payload);
    let recp = recipient_pk_hash(&payload);
    let arb = arbiter_pk_hash(&payload);
    let recipient_lock_h = recipient_lock_hash(&payload);
    let depositor_lock_h = depositor_lock_hash(&payload);
    let min_since = min_since_u64(&payload);

    // Funding: no cell in GroupInput for this type script → accept.
    if load_cell(0, Source::GroupInput).is_err() {
        return Ok(());
    }

    let msg: [u8; 32] = load_tx_hash().map_err(|_| ERR_ARGS)?;

    let witness_args = load_witness_args(0, Source::GroupInput).map_err(|_| ERR_WITNESS)?;
    let lock_reader = witness_args.as_reader().lock();
    if lock_reader.is_none() {
        return Err(ERR_WITNESS);
    }
    let lock_bytes = lock_reader.to_opt().ok_or(ERR_WITNESS)?.raw_data();

    if lock_bytes.is_empty() {
        return Err(ERR_WITNESS);
    }
    let tag = lock_bytes[0];

    let out_lock_hash = lock_hash_group_output_0()?;

    match tag {
        TAG_RELEASE => {
            let need = 1 + (SIG_LEN + PUBKEY_LEN) * 2;
            if lock_bytes.len() < need {
                return Err(ERR_WITNESS);
            }
            let mut o = 1;
            let sig_a = &lock_bytes[o..o + SIG_LEN];
            o += SIG_LEN;
            let pk_a = &lock_bytes[o..o + PUBKEY_LEN];
            o += PUBKEY_LEN;
            let sig_r = &lock_bytes[o..o + SIG_LEN];
            o += SIG_LEN;
            let pk_r = &lock_bytes[o..o + PUBKEY_LEN];

            if !verify_sig_and_pk_hash(sig_a, &msg, pk_a, &arb)
                || !verify_sig_and_pk_hash(sig_r, &msg, pk_r, &recp)
            {
                return Err(ERR_SIG);
            }
            if out_lock_hash != recipient_lock_h {
                return Err(ERR_OUTPUT);
            }
            Ok(())
        }
        TAG_DISPUTE => {
            let need = 1 + (SIG_LEN + PUBKEY_LEN) * 2;
            if lock_bytes.len() < need {
                return Err(ERR_WITNESS);
            }
            let mut o = 1;
            let sig_a = &lock_bytes[o..o + SIG_LEN];
            o += SIG_LEN;
            let pk_a = &lock_bytes[o..o + PUBKEY_LEN];
            o += PUBKEY_LEN;
            let sig_d = &lock_bytes[o..o + SIG_LEN];
            o += SIG_LEN;
            let pk_d = &lock_bytes[o..o + PUBKEY_LEN];

            if !verify_sig_and_pk_hash(sig_a, &msg, pk_a, &arb)
                || !verify_sig_and_pk_hash(sig_d, &msg, pk_d, &dep)
            {
                return Err(ERR_SIG);
            }
            if out_lock_hash != depositor_lock_h {
                return Err(ERR_OUTPUT);
            }
            Ok(())
        }
        TAG_TIMEOUT => {
            let need = 1 + SIG_LEN + PUBKEY_LEN;
            if lock_bytes.len() < need {
                return Err(ERR_WITNESS);
            }
            let sig_d = &lock_bytes[1..1 + SIG_LEN];
            let pk_d = &lock_bytes[1 + SIG_LEN..1 + SIG_LEN + PUBKEY_LEN];

            if !verify_sig_and_pk_hash(sig_d, &msg, pk_d, &dep) {
                return Err(ERR_SIG);
            }
            let since = load_input_since(0, Source::GroupInput).map_err(|_| ERR_SINCE)?;
            if since < min_since {
                return Err(ERR_SINCE);
            }
            if out_lock_hash != depositor_lock_h {
                return Err(ERR_OUTPUT);
            }
            Ok(())
        }
        _ => Err(ERR_UNKNOWN_TAG),
    }
}

#[cfg(not(test))]
fn lock_hash_group_output_0() -> Result<[u8; 32], i8> {
    let cell = load_cell(0, Source::GroupOutput).map_err(|_| ERR_OUTPUT)?;
    let lock = cell.as_reader().lock();
    let raw = lock.as_slice();
    Ok(blake2b_256(raw))
}

pub fn parse_escrow_payload(args: &[u8]) -> Result<[u8; ESCROW_PAYLOAD_LEN], i8> {
    if args.len() < ESCROW_PAYLOAD_LEN {
        return Err(ERR_ARGS);
    }
    let start = args.len() - ESCROW_PAYLOAD_LEN;
    let mut out = [0u8; ESCROW_PAYLOAD_LEN];
    out.copy_from_slice(&args[start..start + ESCROW_PAYLOAD_LEN]);
    if out[168] != ESCROW_VERSION {
        return Err(ERR_ARGS);
    }
    Ok(out)
}

fn depositor_pk_hash(p: &[u8; ESCROW_PAYLOAD_LEN]) -> [u8; 32] {
    p[0..32].try_into().unwrap()
}

fn recipient_pk_hash(p: &[u8; ESCROW_PAYLOAD_LEN]) -> [u8; 32] {
    p[32..64].try_into().unwrap()
}

fn arbiter_pk_hash(p: &[u8; ESCROW_PAYLOAD_LEN]) -> [u8; 32] {
    p[64..96].try_into().unwrap()
}

fn recipient_lock_hash(p: &[u8; ESCROW_PAYLOAD_LEN]) -> [u8; 32] {
    p[96..128].try_into().unwrap()
}

fn depositor_lock_hash(p: &[u8; ESCROW_PAYLOAD_LEN]) -> [u8; 32] {
    p[128..160].try_into().unwrap()
}

fn min_since_u64(p: &[u8; ESCROW_PAYLOAD_LEN]) -> u64 {
    u64::from_le_bytes(p[160..168].try_into().unwrap())
}

pub fn verify_sig_and_pk_hash(
    sig64: &[u8],
    msg32: &[u8; 32],
    pk33: &[u8],
    expected_pk_hash: &[u8; 32],
) -> bool {
    if pk33.len() != PUBKEY_LEN {
        return false;
    }
    let pk_h: [u8; 32] = blake2b_256(pk33);
    if pk_h != *expected_pk_hash {
        return false;
    }
    let sig = match K256Signature::from_slice(sig64) {
        Ok(s) => s,
        Err(_) => return false,
    };
    // CKB hashes raw tx to 32 bytes — verify that digest only (not SHA256(msg) again).
    // Low-S: k256 rejects high-S; normalize so matches typical chain checks.
    let sig = sig.normalize_s().unwrap_or(sig);
    let vk = match VerifyingKey::from_sec1_bytes(pk33) {
        Ok(v) => v,
        Err(_) => return false,
    };
    vk.verify_prehash(msg32, &sig).is_ok()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn payload_trailing_and_version() {
        let mut buf = [0u8; 200];
        buf.fill(0xab);
        let mut payload = [0u8; ESCROW_PAYLOAD_LEN];
        payload[168] = 1;
        buf[200 - ESCROW_PAYLOAD_LEN..].copy_from_slice(&payload);
        let parsed = parse_escrow_payload(&buf).unwrap();
        assert_eq!(parsed[168], ESCROW_VERSION);
    }
}
