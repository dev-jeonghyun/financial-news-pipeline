import React from 'react';

function App() {
  const handleLogin = () => {
    const GOOGLE_CLIENT_ID = '674131826959-3bo3bg1mh8rfnibqfokdd7l6q1n015pj.apps.googleusercontent.com';
    //const redirect_uri = 'http://localhost:8080/auth/google/callback';
    const redirect_uri = 'http://34.22.108.245:8080/auth/google/callback';
    const scope = encodeURIComponent(
      'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'
    );
    const response_type = 'code';

    const auth_url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`;
    window.location.href = auth_url;
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white relative">
      <header className="absolute top-0 w-full text-center py-4 text-xl font-bold bg-gray-100 text-black shadow z-10">
        capdbreak
      </header>

      <div className="mb-12 mt-20 text-center">
        <p className="text-5xl font-semibold">Finance-Flow</p>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">로그인</h1>
        <img
          src="/google_logo.png"
          alt="Sign in with Google"
          className="w-20 h-20 cursor-pointer hover:scale-110 transition-transform duration-300 mx-auto"
          onClick={handleLogin}
        />
      </div>
    </div>
  );
}

export default App;
