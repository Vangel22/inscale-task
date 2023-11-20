"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { notifyError } from "@/utils/notify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import style from "./Login.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [code, setCode] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [blocked, setBlocked] = useState(false);

  const router = useRouter();

  const handleLogin = async (data: any) => {
    if (blocked) {
      notifyError("Try again after 30 seconds");
      return;
    }
    try {
      const res = await axios.post(
        "https://tripx-test-functions.azurewebsites.net/api/login",
        data
      );

      if (res.status === 200) {
        const destinationUrl = `/destinations?code=${code}`;
        router.push(destinationUrl);
      }
    } catch (err: any) {
      setFailedAttempts((prevAttempts) => prevAttempts + 1);
      console.log("error", err);
      notifyError(err.response?.data || err.response.statusText || "Error");
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  useEffect(() => {
    if (failedAttempts >= 3) {
      setBlocked(true);
      setTimeout(() => {
        setFailedAttempts(0);
        setBlocked(false);
      }, 30000);
    }
  }, [failedAttempts]);

  return (
    <>
      <form
        className={style["login-form"]}
        onSubmit={handleSubmit(handleLogin)}
      >
        <Image
          height={50}
          width={100}
          src="/inscale-logo.png"
          alt="inscale logo"
        />
        <div>
          <Controller
            name="username"
            control={control}
            defaultValue=""
            rules={{
              required: "Username is required",
            }}
            render={({ field }) => (
              <input
                {...field}
                className={style["input-field"]}
                placeholder="Username"
                type="text"
                id="username"
                name="username"
              />
            )}
          />
          {errors.username && <span>{errors.username.message as string}</span>}
        </div>
        <div>
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: "Password is required",
            }}
            render={({ field }) => (
              <input
                {...field}
                className={style["input-field"]}
                type="password"
                id="password"
                name="password"
                placeholder="Password"
              />
            )}
          />
          {errors.password && <span>{errors.password.message as string}</span>}
        </div>
        <div>
          <input
            onChange={({ target }) => handleCodeChange(target.value)}
            className={style["input-field"]}
            type="text"
            id="code"
            name="code"
            placeholder="Booking code"
          />
        </div>
        <button className={style["login-button"]} type="submit">
          Login
        </button>
      </form>
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ color: "orange", fontFamily: "Arial", fontSize: "14px" }}
      />
    </>
  );
};

export { Login };
