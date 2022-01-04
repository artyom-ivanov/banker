import { useContext, useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../app/AppContext";
import QRCode from "qrcode.react";
import {
  arrayUnion,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Button } from "../../shared/Button";
import Admin from "./ui/Admin";
import Join from "./ui/Join";
import Game from "./ui/Game";

export default function Room() {
  const navigate = useNavigate();
  const { userInfo, user } = useContext(AppContext);
  const { roomId } = useParams();

  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    const db = getFirestore();
    const collectionRef = collection(db, "rooms");
    const q = query(collectionRef, where("code", "==", roomId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        alert("Комната не найдена");
        return;
      }
      snapshot.forEach((doc) => {
        const data = doc.data();
        setRoomInfo({ ...data, id: doc.id });
      });
    });

    return () => unsubscribe();
  }, [roomId]);

  // Load room
  if (!roomInfo) {
    return (
      <div
        style={{ borderTopColor: "transparent" }}
        className="fixed left-1/2 top-1/2 -m-6 w-8 h-8 rounded-full border-4 border-white animate-spin"
      />
    );
  }

  // Admin of room
  if (roomInfo.uid === userInfo.uid) {
    return <Admin roomInfo={roomInfo} />;
  }

  // Joiner of room
  const myPlayer = roomInfo.players.find((p) => p.uid === user.uid);
  if (!myPlayer || (myPlayer && myPlayer.connected === null)) {
    return <Join roomInfo={roomInfo} />;
  }

  if (myPlayer) {
    return <Game roomInfo={roomInfo} />;
  }
}
