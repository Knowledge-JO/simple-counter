import { TonConnectButton } from "@tonconnect/ui-react";
import "./App.css";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from "./hooks/useTonConnect";
import { fromNano } from "ton-core";
import WebApp from "@twa-dev/sdk";
function App() {
  const {
    contract_address,
    contract_balance,
    counter_value,
    sendIncrement,
    sendDeposit,
    sendWithdrawalRequest,
  } = useMainContract();

  const { connected } = useTonConnect();

  const showAlert = () => {
    WebApp.showAlert("HI, there");
  };

  return (
    <div className="">
      <div>
        <TonConnectButton />
      </div>

      <div>
        <div className="Card">
          <b>{WebApp.platform}</b>
          <b>Our contract Address</b>
          <div className="Hint">{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract balance</b>
          {contract_balance && (
            <div className="Hint">{fromNano(String(contract_balance))}</div>
          )}
        </div>

        <div className="Card">
          <b>Counter value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
        {<a onClick={() => showAlert()}>Show alert</a>}
        <br />
        {connected && <a onClick={() => sendIncrement()}>Increment by 5</a>}
        <br />
        {connected && (
          <a onClick={() => sendDeposit()}>Request deposit of 1 ton</a>
        )}
        <br />
        {connected && (
          <a onClick={() => sendWithdrawalRequest()}>
            Request 0.5 TON withdrawal
          </a>
        )}
      </div>
    </div>
  );
}

export default App;
