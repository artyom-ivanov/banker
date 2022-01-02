import { useCallback, useContext, useState } from "react";
import { ArrowLeft } from "react-feather";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../app/AppContext";
import { Button } from "../shared/Button";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { Input } from "../shared/Input";
import { nanoid } from "nanoid";

export default function NewRoom() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [starter, setStarter] = useState(0);
  const [loading, setLoading] = useState(false);

  const formIsValid = name.length > 2;

  const formSubmit = useCallback(() => {
    setLoading(true);

    const db = getFirestore();
    const code = nanoid(6).toUpperCase();
    const roomData = {
      uid: user.uid,
      name,
      starter: parseInt(starter) || 0,
      code,
      createdAt: Timestamp.fromDate(new Date()),
    };

    addDoc(collection(db, "rooms"), roomData)
      .then(() => {
        setLoading(false);
        navigate(`/room/${code}`);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, [name, navigate, starter, user.uid]);

  return (
    <div className="relative w-full p-6 bg-white rounded-xl shadow-xl max-w-screen-sm mx-auto mt-4 mb-32">
      <div className="flex items-center">
        <button
          onClick={() => {
            navigate("/");
          }}
          className="w-7 h-10 flex items-center justify-center flex-shrink-0"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-xl font-semibold">Новая комната</h1>
      </div>
      <div className="flex flex-col w-full mt-6">
        <Input
          name="name"
          type="text"
          title="Название комнаты"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          name="starter"
          type="number"
          title="Начальный баланс"
          value={starter}
          onChange={(e) => setStarter(e.target.value)}
        />
        <Button
          onClick={formSubmit}
          title="Создать комнату"
          full
          disabled={!formIsValid}
          loading={loading}
        />
      </div>
    </div>
  );
}
