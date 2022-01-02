import { signOut } from "firebase/auth";
import { useContext } from "react";
import { Edit, LogOut, PlusCircle, UserPlus } from "react-feather";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../app/AppContext";

export default function Main() {
  const { userInfo, auth } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="relative w-full bg-transparent rounded-xl max-w-screen-sm mx-auto mt-16 pt-16 mb-32">
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
        style={{ backgroundImage: `url(${userInfo.photo})` }}
        onClick={() => navigate("/profile")}
        className="cursor-pointer absolute w-24 h-24 rounded-full border-2 border-white bg-cover bg-gray-100 -top-12 left-1/2 -ml-12"
      />

      <div className="flex flex-col w-full">
        <button
          onClick={() => navigate("/profile")}
          className="px-6 py-3 bg-white text-pink-500 text-sm font-semibold rounded-full relative flex items-center"
        >
          <Edit size={16} className="mr-2" /> Изменить профиль
        </button>
        <button
          onClick={() => navigate("/create")}
          className="mt-4 px-6 py-3 bg-white text-pink-500 text-sm font-semibold rounded-full relative flex items-center"
        >
          <PlusCircle size={16} className="mr-2" /> Создать комнату
        </button>
        <button
          onClick={() => navigate("/join")}
          className="mt-4 px-6 py-3 bg-white text-pink-500 text-sm font-semibold rounded-full relative flex items-center"
        >
          <UserPlus size={16} className="mr-2" /> Подключиться к комнате
        </button>
      </div>
    </div>
  );
}
