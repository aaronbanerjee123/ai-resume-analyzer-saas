import React from 'react'

export const meta = () => (
    [{title:'Resumind | Auth'},
        {name:'description', content: 'Log into your account'},
    ])

const Auth = () => {
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover bg-cover min-h-screen flex items-center justify-center ">
        <div className="gradient-border shadow-lg">
            <section className="flex flex-col gap-8 bg-white rounded-2xl px-10">
                <h1>Welcome</h1>
                <h2>Log In to Continue your Job Journey</h2>
            </section>
        </div>
    </main>
  )
}

export default Auth