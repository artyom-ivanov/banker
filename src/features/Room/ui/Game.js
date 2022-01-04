import { useContext, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowRightCircle, Users } from "react-feather";
import { AppContext } from "../../../app/AppContext";
import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";

export default function Game({ roomInfo }) {
  const navigate = useNavigate();
  const { userInfo, user } = useContext(AppContext);
  const [oldBalance, setOldBalance] = useState(0);
  const [balance, setBalance] = useState(0);

  const [audio] = useState(new Audio("/assets/coin.wav"));

  useEffect(() => {
    let newBalance = roomInfo.starter;
    roomInfo.transactions
      .filter((t) => t.from === user.uid || t.to === user.uid)
      .forEach((t) => {
        if (t.from === user.uid) {
          newBalance -= t.amount;
        }
        if (t.to === user.uid) {
          newBalance += t.amount;
        }
      });

    if (balance !== newBalance) {
      setOldBalance(balance);
      setBalance(newBalance);
      audio.currentTime = 0;
      audio.play();
    }
  }, [audio, roomInfo.starter, balance, roomInfo.transactions, user.uid]);

  const myTransactions = roomInfo.transactions.filter(
    (t) => t.from === user.uid || t.to === user.uid
  );

  myTransactions.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  return (
    <>
      <button
        onClick={() => {
          navigate("/");
        }}
        className="w-7 h-10 text-white flex items-center justify-center flex-shrink-0"
      >
        <ArrowLeft size={16} />
      </button>
      <p className="text-sm opacity-70 text-white mt-10">Ваш баланс</p>
      <h1
        style={{ fontSize: 40 }}
        className="font-semibold text-white w-full relative flex items-center"
      >
        <div
          style={{ backgroundImage: `url(${userInfo.photo})` }}
          className="w-10 h-10 border-2 border-white bg-cover rounded-full mr-3"
        />
        <CountUp
          start={oldBalance}
          end={balance}
          duration={0.5}
          separator=","
          decimals={2}
          decimal="."
        >
          {({ countUpRef }) => <span ref={countUpRef} />}
        </CountUp>
      </h1>
      <div className="flex w-full mt-4">
        <button className="shadow-xl flex h-12 bg-white text-pink-500 rounded-full px-5 font-semibold text-sm items-center">
          <ArrowRightCircle className="mr-2" size={20} />
          Перевести
        </button>
        <button className="shadow-xl ml-4 flex h-12 bg-white text-pink-500 rounded-full px-5 font-semibold text-sm items-center">
          <Users className="mr-2" size={20} />
          {roomInfo.players.length}
        </button>
      </div>

      <div className="w-fill rounded-xl bg-white p-6 mt-8 shadow-xl">
        <h2 className="text-base font-semibold w-full">Последние операции</h2>
        <div className="flex flex-col w-full divide-y">
          {myTransactions.slice(0, 10).map((t) => {
            if (t.from === "bank") {
              return (
                <div
                  key={t.createdAt.seconds}
                  className="flex w-full items-center mt-2 pt-2"
                >
                  <div
                    style={{ backgroundImage: `url(${userInfo.photo})` }}
                    className="w-8 h-8 bg-cover rounded-full mr-2 flex-shrink-0"
                  />
                  <p className="text-xs font-semibold mr-2">{userInfo.name}</p>
                  <p
                    className={`${
                      t.amount > 0 ? "text-green-500" : "text-red-500"
                    } text-sm font-semibold ml-auto`}
                  >
                    {t.amount > 0 ? "+" : ""}
                    {t.amount}
                  </p>
                </div>
              );
            }
            const otherUser =
              t.from === user.uid
                ? roomInfo.players.find((p) => p.uid === t.to)
                : roomInfo.players.find((p) => p.uid === t.from);
            return (
              <div
                key={t.createdAt.seconds}
                className="flex w-full items-center mt-2 pt-2"
              >
                <div
                  style={{
                    backgroundImage: `url(${
                      t.from === user.uid ? userInfo.photo : otherUser.photo
                    })`,
                  }}
                  className="w-8 h-8 bg-cover rounded-full flex-shrink-0"
                />
                <ArrowRight className="mx-2" size={16} />
                <div
                  style={{
                    backgroundImage: `url(${
                      t.to === user.uid ? userInfo.photo : otherUser.photo
                    })`,
                  }}
                  className="w-8 h-8 bg-cover rounded-full mr-2 flex-shrink-0"
                />
                <p
                  className={`${
                    t.from === user.uid ? "text-red-500" : "text-green-500"
                  } text-sm font-semibold ml-auto`}
                >
                  {t.from === user.uid ? "-" : "+"}
                  {t.amount}
                </p>
              </div>
            );
          })}

          {roomInfo.starter > 0 && myTransactions.length < 10 && (
            <div className="flex w-full items-center mt-2 pt-2">
              <div
                style={{ backgroundImage: `url(${userInfo.photo})` }}
                className="w-8 h-8 bg-cover rounded-full mr-2 flex-shrink-0"
              />
              <p className="text-xs font-semibold mr-2">{userInfo.name}</p>
              <p className="text-sm text-green-500 font-semibold ml-auto">
                +{roomInfo.starter}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
