import { useContext, useEffect, useState } from "react";
import { ArrowLeft, Edit2, LogOut } from "react-feather";
import { AppContext } from "../app/AppContext";
import { Button } from "../shared/Button";
import { Input } from "../shared/Input";
import { getRandomInt } from "../shared/helpers";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Avatars from "./Avatars";

export default function Profile({ onChange }) {
  const { user, userInfo, auth } = useContext(AppContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [chooseAvatars, setChooseAvatars] = useState(false);

  useEffect(() => {
    setName(userInfo.name || "");

    if (!userInfo.photo) {
      setImage(`/assets/avatars/${getRandomInt(1, 95)}.svg`);
    } else {
      setImage(userInfo.photo);
    }
  }, [user.photoURL, userInfo]);

  const saveUser = () => {
    const db = getFirestore();
    const userData = {
      uid: user.uid,
      name,
      photo: image,
    };

    setDoc(doc(db, "users", user.uid), userData, { merge: true })
      .then(() => {
        setLoading(false);
        onChange(userData);
        navigate("/");
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
        setError("Ошибка при сохранении пользователя");
      });
  };

  const submitForm = () => {
    setLoading(true);
    setError(false);
    saveUser();
  };

  const formIsValid = name.length > 2 && !loading;

  return (
    <>
      {chooseAvatars && (
        <Avatars
          onChoose={(url) => {
            setImage(url);
            setChooseAvatars(false);
          }}
          onClose={() => setChooseAvatars(false)}
        />
      )}
      <div className="relative w-full p-6 bg-white rounded-xl shadow-xl max-w-screen-sm mx-auto mt-16 pt-16 mb-32">
        {userInfo && userInfo.uid && (
          <button
            onClick={() => {
              navigate("/");
            }}
            className="absolute left-0 -top-10 text-white w-7 h-10 flex items-center justify-center flex-shrink-0"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <button
          onClick={() => {
            signOut(auth).then(() => {
              window.location.reload();
            });
          }}
          className="absolute right-0 -top-10 text-white w-7 h-10 flex items-center justify-center flex-shrink-0"
        >
          <LogOut size={16} />
        </button>
        <button
          style={{ backgroundImage: `url(${image})` }}
          onClick={() => setChooseAvatars(true)}
          className="cursor-pointer absolute w-24 h-24 rounded-full border-2 border-white bg-cover bg-gray-100 -top-12 left-1/2 -ml-12"
        >
          <div className="w-7 h-7 bg-pink-500 text-white rounded-full absolute right-0 bottom-0 flex items-center justify-center">
            <Edit2 size={14} />
          </div>
        </button>
        <p className="text-sm text-gray-600 text-center mb-4">
          Кликните на аватарку,
          <br />
          чтобы поменять ее
        </p>
        <Input
          name="name"
          type="text"
          title="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button
          onClick={submitForm}
          title="Сохранить"
          full
          disabled={!formIsValid}
          loading={loading}
        />
        {error && (
          <p className="text-sm text-red-500 mt-4 text-center">{error}</p>
        )}
      </div>
    </>
  );
}
