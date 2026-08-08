import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth";

import API from "./api";
import { auth } from "./firebase";

const provider = new GoogleAuthProvider();

provider.setCustomParameters({
  prompt: "select_account"
});

export async function loginWithGoogle(role) {
  try {
    const result = await signInWithPopup(auth, provider);

    const firebaseUser = result.user;

    const idToken = await firebaseUser.getIdToken(true);

    const response = await API.post("/auth/login", {
      id_token: idToken,
      role: role
    });

    localStorage.setItem("token", response.data.access_token);

    localStorage.setItem(
      "user",
      JSON.stringify(response.data.user)
    );

    return response.data.user;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function studentLogin(student_id, password) {
  const response = await API.post("/auth/student-login", {
    student_id,
    password,
  });

  localStorage.setItem(
    "token",
    response.data.access_token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  return response.data.user;
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  await signOut(auth);
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");

  if (!user) return null;

  return JSON.parse(user);
}

export function getToken() {
  return localStorage.getItem("token");
}