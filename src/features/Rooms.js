import { useContext, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
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

export default function Rooms() {
  const navigate = useNavigate();
  const { userInfo } = useContext(AppContext);

  const [rooms, setRooms] = useState(null);

  useEffect(() => {
    const db = getFirestore();
    const collectionRef = collection(db, "rooms");
    const q = query(collectionRef, where("uid", "==", userInfo.uid));

    getDocs(q).then((snapshot) => {
      const newRooms = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        newRooms.push({ ...data, id: doc.id });
      });
      setRooms(newRooms);
    });
  }, [userInfo.uid]);

  return (
    <div className="relative w-full p-6 bg-white rounded-xl max-w-screen-sm mx-auto mt-6 mb-32">
      <h2 className="text-xl w-full text-center font-semibold">Мои комнаты</h2>
      {rooms === null && (
        <p className="text-sm w-full text-center text-pink-500">Загружаем...</p>
      )}
      {rooms && rooms.length === 0 && (
        <p className="text-sm w-full text-center text-pink-500">
          Вы еще не создавали комнат
        </p>
      )}
      {rooms && rooms.length > 0 && (
        <div className="flex flex-col mt-2">
          {rooms.map((room) => {
            return (
              <div
                key={room.id}
                className="w-full flex border-t pt-4 mt-4 items-center"
              >
                <div className="flex flex-col mr-2">
                  <h3 className="text-base font-semibold">{room.name}</h3>
                  <p className="text-xs text-pink-500">{room.code}</p>
                </div>
                <button
                  onClick={() => navigate(`/room/${room.code}`)}
                  className="ml-auto flex-shrink-0 w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
