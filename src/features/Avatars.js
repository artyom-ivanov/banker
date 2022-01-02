import { X } from "react-feather";

export default function Avatars({ onClose, onChoose }) {
  const getAvatars = () => {
    const avatars = [];
    for (let index = 1; index <= 95; index++) {
      avatars.push(
        <button
          onClick={() => onChoose(`/assets/avatars/${index}.svg`)}
          key={index}
        >
          <img
            src={`/assets/avatars/${index}.svg`}
            className="rounded-full"
            alt="avatar"
          />
        </button>
      );
    }
    return avatars;
  };

  return (
    <div className="fixed w-full h-full left-0 top-0 z-10">
      <button
        onClick={onClose}
        className="bg-black opacity-30 absolute left-0 top-0 w-full h-full"
      ></button>
      <div className="absolute max-w-md mx-auto overflow-auto bg-white rounded-xl left-6 top-6 right-6 px-4 bottom-6">
        <h1 className="mt-6 text-lg font-bold">Выберите фото</h1>
        <button
          onClick={onClose}
          className="flex items-center justify-center absolute right-4 top-4 w-10 h-10 rounded-full"
        >
          <X size={18} />
        </button>
        <div className="my-4 grid grid-cols-4 gap-4">{getAvatars()}</div>
      </div>
    </div>
  );
}
