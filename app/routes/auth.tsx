import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get("next") || "/"; // Default to home page
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated) {
      setTimeout(() => {
        navigate(next, { replace: true });
      }, 100);
    }
  }, [auth.isAuthenticated, next,navigate]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-cover min-h-screen flex items-center justify-center ">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl px-10">
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to Continue your Job Journey</h2>
          </div>
          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in ...</p>
              </button>
            ) : (
              <>
                {auth.isAuthenticated ? (
                  <button className="auth-button" onClick={auth.signOut}>
                    <p>Log out</p>
                  </button>
                ) : (
                  <button className="auth-button" onClick={auth.signIn}>
                    <p>Sign in</p>
                  </button>
                )}
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
