/**
 * Best-effort message signing across CCC signer variants.
 */
export async function signMessageWithSigner(signer: unknown, message: string): Promise<string> {
  const candidate = signer as {
    signMessage?: (msg: string) => Promise<string>;
    sign?: (msg: string) => Promise<string>;
    signPersonalMessage?: (msg: string) => Promise<string>;
  };
  if (candidate.signMessage) return candidate.signMessage(message);
  if (candidate.signPersonalMessage) return candidate.signPersonalMessage(message);
  if (candidate.sign) return candidate.sign(message);
  throw new Error("This wallet does not support message signing.");
}
