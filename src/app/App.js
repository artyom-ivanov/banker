import { initializeApp } from "firebase/app";
import { useEffect, useState } from "react";
import { Button } from "../shared/Button";
import { firebaseConfig } from "./config";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
} from "firebase/auth";

import { getFirestore, doc, getDoc } from "firebase/firestore";

import { AppContext } from "./AppContext";
import Profile from "../features/Profile";
import Main from "../features/Main";
import NewRoom from "../features/NewRoom";
import Room from "../features/Room/Room";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function App() {
  const [user, setUser] = useState(false); // false -> null or { user }
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    auth.languageCode = "ru";
    const authObserver = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => authObserver();
  }, []);

  useEffect(() => {
    if (user) {
      const db = getFirestore();
      const docRef = doc(db, "users", user.uid);
      getDoc(docRef)
        .then((doc) => {
          if (doc.exists()) {
            setUserInfo(doc.data());
          } else {
            setUserInfo({});
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [user]);

  const onGoogleAuth = () => {
    signInWithPopup(auth, provider)
      .then(() => {})
      .catch((error) => {
        console.error(error.message, error);
      });
  };

  const onGuestAuth = () => {
    signInAnonymously(auth)
      .then(() => {})
      .catch((error) => {
        console.error(error.message, error);
      });
  };

  if (user === false || (user && userInfo === null)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
        <div
          style={{ borderTopColor: "transparent" }}
          className="fixed left-1/2 top-1/2 -m-6 w-8 h-8 rounded-full border-4 border-white animate-spin"
        />
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
        <div className="container mx-auto px-6 max-w-xl relative">
          <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex w-full flex-col p-4 bg-white rounded-3xl shadow-xl">
              <Button title="Войти через Google" onClick={onGoogleAuth} />
              <div className="my-2"></div>
              <Button title="Войти как гость" onClick={onGuestAuth} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    user &&
    userInfo &&
    !userInfo.uid &&
    window.location.pathname !== "/profile"
  ) {
    window.location.href = "/profile";
  }

  return (
    <AppContext.Provider value={{ user, auth, userInfo }}>
      <div className="min-h-screen bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
        <div className="container mx-auto px-6 py-4">
          <Router>
            <Routes>
              <Route
                path="/profile"
                element={<Profile onChange={setUserInfo} />}
              />
              <Route path="/create" element={<NewRoom />} />
              <Route path="/room/:roomId" element={<Room />} />
              <Route path="/" element={<Main />} />
            </Routes>
          </Router>
        </div>
      </div>
    </AppContext.Provider>
  );
}
