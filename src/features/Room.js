import { useContext, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../app/AppContext";
import QRCode from "qrcode.react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

export default function Room() {
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext);
  const { roomId } = useParams();

  const [roomInfo, setRoomInfo] = useState(null);
  const [tab, setTab] = useState("play");

  useEffect(() => {
    const db = getFirestore();
    const collectionRef = collection(db, "rooms");
    const q = query(collectionRef, where("code", "==", roomId));

    getDocs(q).then((snapshot) => {
      if (snapshot.empty) {
        alert("Комната не найдена");
        return;
      }
      snapshot.forEach((doc) => {
        const data = doc.data();
        setRoomInfo({ ...data, id: doc.id });
      });
    });
  }, [roomId]);

  console.log(roomInfo);

  return (
    <div className="relative w-full p-6 bg-white rounded-xl max-w-screen-sm mx-auto mt-16 pt-16 mb-32">
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

      {roomInfo && (
        <>
          <h1 className="text-xl w-full text-center font-semibold">
            {roomInfo.name}
          </h1>
          <p className="text-sm w-full text-center mb-4">
            Стартовый баланс -{" "}
            <b className="text-pink-500">{roomInfo.starter}</b>
          </p>

          <div className="flex w-full rounded-full bg-gray-100 items-center mb-4 p-1">
            <button
              onClick={() => setTab("play")}
              className={`${
                tab === "play" ? "bg-pink-500 text-white" : "text-pink-500"
              } w-1/2 px-2 py-3 text-xs font-semibold uppercase rounded-full relative flex items-center justify-center tracking-wide`}
            >
              Комната
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
                value={`http://localhost:3000/room/${roomId}`}
              />
              <p className="text-2xl font-mono font-bold text-center w-full mt-4">
                {roomId}
              </p>
              <p className="text-sm text-center w-full mt-2">
                Код для подключения к комнате
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
