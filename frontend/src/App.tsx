import { ConnectWallet } from "./components/ConnectWallet";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <span className="logo-mark" aria-hidden />
          <div>
            <div className="topbar__title">Escrow</div>
            <div className="topbar__sub">Nervos CKB · Rust escrow + CCC</div>
          </div>
        </div>
        <ConnectWallet />
      </header>

      <main className="main">
        <section className="hero">
          <p className="eyebrow">Decentralized settlement</p>
          <h1>Funds stay on-chain until the rules say otherwise.</h1>
          <p className="lede">
            This app will orchestrate your escrow lock: deposits, releases,
            refunds, and arbiter paths — wired through{" "}
            <strong>CCC</strong> and your{" "}
            <strong>RISC-V escrow script</strong>.
          </p>
          <div className="hero__actions">
            <a
              className="btn-ghost"
              href="https://docs.ckbccc.com/docs/ccc/"
              target="_blank"
              rel="noreferrer"
            >
              CCC docs
            </a>
            <a
              className="btn-ghost"
              href="https://docs.nervos.org/docs/script/"
              target="_blank"
              rel="noreferrer"
            >
              CKB scripts
            </a>
          </div>
        </section>

        <section className="grid3" aria-label="Escrow roles">
          <article className="card">
            <h2>Depositor</h2>
            <p>Locks CKB into the escrow lock. Timeout refund when rules allow.</p>
          </article>
          <article className="card">
            <h2>Recipient</h2>
            <p>Delivers the obligation; release path when signatures match your script.</p>
          </article>
          <article className="card">
            <h2>Arbiter</h2>
            <p>Break-glass co-sign paths for release or refund, as you encode on-chain.</p>
          </article>
        </section>
      </main>

      <footer className="footer">
        <span>Use CKB Testnet from the wallet menu unless you know you need mainnet.</span>
      </footer>
    </div>
  );
}

export default App;
