"use client"

import {signIn} from "next-auth/react";

const Login = () => {
    const handleGoogle = () => {
        signIn("google", {
            callbackUrl: "/"
        }).then(() => {

        });
    }
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white max-w-md p-8 rounded-lg shadow-md border border-[#e00885]/30">
                <h1 className="text-4xl font-extrabold text-center text-[#3c2a98] mb-8">Kartikay Signage</h1>
                <button className="flex items-center justify-center w-full h-12 bg-[#e00885] text-white rounded-md border border-transparent hover:bg-[#e00885] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#e00885] focus:ring-opacity-50" onClick={handleGoogle}>
                    <img src="https://i.ibb.co/yYpmGLB/google.png" alt="google" className="w-8 mr-4" />
                    <span className="text-lg">Sign in with Google</span>
                </button>
                <p className="text-sm text-center mt-4 text-gray-600">By signing in, you agree to our Terms and Privacy Policy.</p>
            </div>
        </div>
    );
}

export default Login;