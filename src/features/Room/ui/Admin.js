import { useContext, useEffect, useState } from "react";
import { ArrowLeft, Check, X } from "react-feather";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../app/AppContext";
import QRCode from "qrcode.react";
import {
  arrayUnion,
  doc,
  getFirestore,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Button } from "../../../shared/Button";
import { Input } from "../../../shared/Input";

export default function Admin({ roomInfo }) {
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext);
  const [tab, setTab] = useState("players");
  const [playersCounter, setPlayersCounter] = useState(0);

  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState("plus");
  const [transactionReciever, setTransactionReciever] = useState(null);

  const [audio] = useState(new Audio("/assets/tune.wav"));

  useEffect(() => {
    if (playersCounter !== roomInfo.players.length) {
      setPlayersCounter(roomInfo.players.length);
      audio.currentTime = 0;
      audio.play();
    }
  }, [audio, playersCounter, roomInfo.players]);

  const moderate = (uid, status) => {
    const db = getFirestore();

    const newPlayers = roomInfo.players.map((p) => {
      if (p.uid === uid) {
        return {
          ...p,
          connected: status,
        };
      }
      return p;
    });

    updateDoc(doc(db, "rooms", roomInfo.id), {
      players: newPlayers,
    });
  };

  const transactionRecieverUser = roomInfo.players.find(
    (p) => p.uid === transactionReciever
  );
  const canSendTransaction =
    transactionRecieverUser && transactionAmount && transactionType;

  const sendTransaction = () => {
    const db = getFirestore();
    const transaction = {
      from: "bank",
      to: transactionReciever,
      amount:
        transactionType === "plus"
          ? parseInt(transactionAmount)
          : -1 * parseInt(transactionAmount),
      createdAt: Timestamp.fromDate(new Date()),
    };

    updateDoc(doc(db, "rooms", roomInfo.id), {
      transactions: arrayUnion(transaction),
    });

    setTransactionAmount("");
    setTransactionReciever(null);
  };

  return (
    <>
      <div className="relative w-full p-6 bg-white rounded-xl max-w-screen-sm mx-auto mt-16 pt-16">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="absolute left-0 -top-10 text-white w-7 h-10 flex items-center justify-center flex-shrink-0"
        >
          <ArrowLeft size={16} />
        </button>
        <button
          style={{ backgroundImage: `url(${userInfo.photo})` }}
          onClick={() => navigate("/profile")}
          className="cursor-pointer absolute w-24 h-24 rounded-full border-2 border-white bg-cover bg-gray-100 -top-12 left-1/2 -ml-12"
        />

        <h1 className="text-xl w-full text-center font-semibold">
          {roomInfo.name}
        </h1>
        <p className="text-sm w-full text-center mb-4">
          Стартовый баланс <b className="text-pink-500">{roomInfo.starter}</b>
        </p>

        <div className="flex w-full rounded-full bg-gray-100 items-center mb-4 p-1">
          <button
            onClick={() => setTab("players")}
            className={`${
              tab === "players" ? "bg-pink-500 text-white" : "text-pink-500"
            } w-1/2 px-2 py-3 text-xs font-semibold uppercase rounded-full relative flex items-center justify-center tracking-wide`}
          >
            Игроки
            {!!roomInfo.players.length && (
              <span
                style={{ fontSize: 10 }}
                className="w-4 h-4 bg-white rounded-full text-pink-500 flex items-center justify-center ml-2"
              >
                {roomInfo.players.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab("join")}
            className={`${
              tab === "join" ? "bg-pink-500 text-white" : "text-pink-500"
            } w-1/2 px-2 py-3 text-xs font-semibold uppercase rounded-full relative flex items-center justify-center tracking-wide`}
          >
            Подключение
          </button>
        </div>

        {tab === "join" && (
          <div className="w-full border rounded-lg p-4">
            <QRCode
              className="w-full h-40 mt-2"
              renderAs="svg"
              value={`${window.location.origin}/room/${roomInfo.code}`}
            />
            <p className="text-2xl font-mono font-bold text-center w-full mt-4">
              {roomInfo.code}
            </p>
            <p className="text-sm text-center w-full mt-2">
              Код для подключения к комнате
            </p>
          </div>
        )}

        {tab === "players" && (
          <div className="w-full flex flex-col">
            {roomInfo.players.map((p) => {
              let connectStatus = "Ждет одобрения";
              if (p.connected) connectStatus = "Подключен";
              if (p.connected === false) connectStatus = "Отклонен";

              const labelClasses = ["text-xs"];
              if (p.connected) labelClasses.push("text-green-600");
              if (p.connected === false) labelClasses.push("text-red-500");
              if (p.connected === null) labelClasses.push("text-pink-500");

              return (
                <div key={p.uid} className="w-full flex items-center mt-2">
                  <div
                    style={{ backgroundImage: `url(${p.photo})` }}
                    className="w-8 h-8 rounded-full bg-cover mr-2"
                  />
                  <div className="flex flex-col mr-2">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className={labelClasses.join(" ")}>{connectStatus}</p>
                  </div>
                  <button
                    onClick={() => moderate(p.uid, true)}
                    className={`${
                      p.connected || p.connected === null ? "" : "opacity-30"
                    } w-8 h-8 bg-green-500 rounded-full flex-shrink-0 ml-auto text-white flex items-center justify-center`}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => moderate(p.uid, false)}
                    className={`${
                      p.connected === false || p.connected === null
                        ? ""
                        : "opacity-30"
                    } w-8 h-8 bg-red-500 rounded-full flex-shrink-0 ml-2 text-white flex items-center justify-center`}
                  >
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="relative w-full p-6 bg-white rounded-xl max-w-screen-sm mx-auto mt-8">
        <Input
          name="starter"
          type="number"
          title="Сумма перевода"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(e.target.value)}
        />
        <div className="w-full flex flex-col">
          <div className="ml-1 text-sm font-medium mb-2 text-gray-600">
            Тип операции
          </div>

          <div className="flex w-full rounded-full bg-gray-100 items-center mb-4 p-1">
            <button
              onClick={() => setTransactionType("plus")}
              className={`${
                transactionType === "plus"
                  ? "bg-pink-500 text-white"
                  : "text-pink-500"
              } w-1/2 px-2 py-3 text-xs font-semibold uppercase rounded-full relative flex items-center justify-center tracking-wide`}
            >
              Начислить
            </button>
            <button
              onClick={() => setTransactionType("minus")}
              className={`${
                transactionType === "minus"
                  ? "bg-pink-500 text-white"
                  : "text-pink-500"
              } w-1/2 px-2 py-3 text-xs font-semibold uppercase rounded-full relative flex items-center justify-center tracking-wide`}
            >
              Списать
            </button>
          </div>

          <div className="ml-1 text-sm font-medium mb-2 text-gray-600">
            Кому
          </div>

          <div className="flex h-10 w-full overflow-auto mb-4">
            {roomInfo.players
              .filter((p) => p.connected)
              .map((p) => {
                const classes = [
                  "w-10 h-10 rounded-full bg-cover mr-2 bg-black",
                ];
                if (transactionReciever && p.uid !== transactionReciever)
                  classes.push("opacity-30");
                return (
                  <button
                    key={p.uid}
                    onClick={() =>
                      setTransactionReciever(
                        p.uid === transactionReciever ? null : p.uid
                      )
                    }
                    style={{ backgroundImage: `url(${p.photo})` }}
                    className={classes.join(" ")}
                  ></button>
                );
              })}
          </div>
        </div>
        <Button
          title={
            canSendTransaction
              ? `${transactionRecieverUser.name} ${
                  transactionType === "plus" ? "+" : "-"
                }${parseInt(transactionAmount || 0)}`
              : `Укажите параметры`
          }
          disabled={!canSendTransaction}
          full
          onClick={sendTransaction}
        />
      </div>
    </>
  );
}
