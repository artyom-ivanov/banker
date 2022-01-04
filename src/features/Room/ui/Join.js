import { useContext, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../app/AppContext";
import {
  arrayUnion,
  doc,
  getFirestore,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { Button } from "../../../shared/Button";

export default function Join({ roomInfo }) {
  const { userInfo, user } = useContext(AppContext);
  const navigate = useNavigate();

  const join = () => {
    const db = getFirestore();
    const playerData = {
      uid: user.uid,
      name: userInfo.name,
      photo: userInfo.photo,
      createdAt: Timestamp.fromDate(new Date()),
      connected: null,
    };

    updateDoc(doc(db, "rooms", roomInfo.id), {
      players: arrayUnion(playerData),
    });
  };

  const myPlayer = roomInfo.players.find((p) => p.uid === user.uid);

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

      {roomInfo ? (
        <>
          <h1 className="text-xl w-full text-center font-semibold">
            {roomInfo.name}
          </h1>
          <p className="text-sm w-full text-center mb-4">
            Стартовый баланс <b className="text-pink-500">{roomInfo.starter}</b>
          </p>
          {!myPlayer && <Button onClick={join} title="Подключиться" full />}
          {myPlayer && myPlayer.connected === null && (
            <>
              <Button onClick={join} title="Подключиться" full loading={true} />
              <p className="text-xs text-gray-600 w-full text-center mt-2">
                Ждем подтверждения входа...
              </p>
            </>
          )}
        </>
      ) : (
        <p className="text-sm text-pink-500 w-full text-center">Загружаем...</p>
      )}
    </div>
  );
}
