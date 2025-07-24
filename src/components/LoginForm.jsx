import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

export default function LoginForm() {
  const [userType, setUserType] = useState('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSubmit = () => {
    if (!username || !password) {
      setError('Please fill in all fields!');
      return;
    }

    const credentials = {
      student: { username: 'student1', password: 'password1' },
      faculty: { username: 'faculty1', password: 'password1' },
    };

    const cred = credentials[userType];
    if (username !== cred.username || password !== cred.password) {
      setError('Wrong credentials.');
      return;
    }

    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (userType === 'student') {
        navigate('/student');
      } else {
        navigate('/choose_subjects');
      }
    }, 1500);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center justify-center min-h-screen px-4 ${isDark ? 'bg-[#181e29]' : 'bg-gray-100'}`} style={{position:'relative',overflow:'hidden'}}>
      <style>{`
        @keyframes floatY {
          0% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
          100% { transform: translateY(0); }
        }
        @keyframes floatX {
          0% { transform: translateX(0); }
          50% { transform: translateX(18px); }
          100% { transform: translateX(0); }
        }
        @keyframes floatXY {
          0% { transform: translate(0,0); }
          50% { transform: translate(12px, -12px); }
          100% { transform: translate(0,0); }
        }
      `}</style>
      {/* Decorative background SVGs with animation */}
      <svg style={{position:'absolute',top:40,left:40,opacity:0.36,zIndex:0,animation:'floatY 6s ease-in-out infinite'}} width="120" height="120" viewBox="0 0 24 24" fill="#fca5a5" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4v16c0 .55.45 1 1 1h13v-2H8V4H6zm15-2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h13v16z"/>
        <rect x="10" y="7" width="7" height="2" rx="1" fill="#f87171"/>
        <rect x="10" y="11" width="5" height="2" rx="1" fill="#f87171"/>
      </svg>
      <svg style={{position:'absolute',bottom:60,right:60,opacity:0.32,zIndex:0,animation:'floatX 7s ease-in-out infinite'}} width="160" height="160" viewBox="0 0 24 24" fill="#fca5a5" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4v16c0 .55.45 1 1 1h13v-2H8V4H6zm15-2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h13v16z"/>
        <rect x="10" y="7" width="7" height="2" rx="1" fill="#f87171"/>
        <rect x="10" y="11" width="5" height="2" rx="1" fill="#f87171"/>
      </svg>
      <svg style={{position:'absolute',top:'50%',left:-60,transform:'translateY(-50%)',opacity:0.38,zIndex:0,animation:'floatXY 8s ease-in-out infinite'}} width="180" height="180" viewBox="0 0 24 24" fill="#fca5a5" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4v16c0 .55.45 1 1 1h13v-2H8V4H6zm15-2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h13v16z"/>
        <rect x="10" y="7" width="7" height="2" rx="1" fill="#f87171"/>
        <rect x="10" y="11" width="5" height="2" rx="1" fill="#f87171"/>
      </svg>
      {/* Graduation Cap Icon */}
      <svg style={{position:'absolute',top:30,right:80,opacity:0.34,zIndex:0,animation:'floatY 9s ease-in-out infinite'}} width="90" height="90" viewBox="0 0 24 24" fill="#fca5a5" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3L1 9l11 6 9-4.91V17a1 1 0 0 1-2 0v-3.09l-7 3.91-9-5 1.18-.66L12 15l8.82-4.91L23 9l-11-6z"/>
      </svg>
      {/* Pencil Icon */}
      <svg style={{position:'absolute',bottom:40,left:100,opacity:0.33,zIndex:0,animation:'floatX 10s ease-in-out infinite'}} width="100" height="100" viewBox="0 0 24 24" fill="#fca5a5" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm2.92.92l8.06-8.06 1.83 1.83-8.06 8.06H5.92v-1.83zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
      </svg>
      {/* Main login card */}
      <div className={`${isDark ? 'bg-[#232a39] border-[#232a39]' : 'bg-white border-gray-200'} border p-8 rounded-2xl w-full max-w-md shadow-xl`} style={{zIndex:1, position:'relative'}}>
        {/* Settings gear */}
        <button onClick={() => setShowSettings(true)} style={{position:'absolute',top:18,right:18,background:'none',border:'none',cursor:'pointer',zIndex:2}}>
          <FaCog size={22} color={isDark ? '#fff' : '#222'} />
        </button>
        <div className="mb-6 text-center">
          {/* Book Icon */}
          <div className="flex justify-center mb-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#fca5a5" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 4v16c0 .55.45 1 1 1h13v-2H8V4H6zm15-2H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H8V4h13v16z"/>
              <rect x="10" y="7" width="7" height="2" rx="1" fill="#f87171"/>
              <rect x="10" y="11" width="5" height="2" rx="1" fill="#f87171"/>
            </svg>
          </div>
          <h1 className={`${isDark ? 'text-white' : 'text-black'} text-3xl font-bold tracking-tight`}>
            {userType === 'student' ? 'Student Portal' : 'Faculty Portal'}
          </h1>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-sm mt-2`}>
            Sign in to continue
          </p>
        </div>
        <div className={`flex ${isDark ? 'bg-[#232a39]' : 'bg-white'} p-1 rounded-xl mb-6 transition border ${isDark ? 'border-[#232a39]' : 'border-gray-200'}`}>
          {['student', 'faculty'].map((type) => (
          <button
              key={type}
              onClick={() => setUserType(type)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                userType === type
                  ? 'bg-red-300 text-black shadow'
                  : isDark ? 'text-gray-400 hover:bg-[#232a39]' : 'text-gray-500 hover:bg-red-100'
            }`}
          >
              {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
          ))}
        </div>
        <input
          type="text"
          placeholder={userType === 'student' ? 'Student ID / Email' : 'Faculty ID / Email'}
          className={`w-full mb-4 px-4 py-3 rounded-lg ${isDark ? 'bg-[#232a39] text-white placeholder-gray-400 border-[#232a39]' : 'bg-gray-100 text-black placeholder-gray-400 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-300`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={`w-full mb-6 px-4 py-3 rounded-lg ${isDark ? 'bg-[#232a39] text-white placeholder-gray-400 border-[#232a39]' : 'bg-gray-100 text-black placeholder-gray-400 border-gray-300'} border focus:outline-none focus:ring-2 focus:ring-red-300`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="w-full mb-4 text-center text-red-600 font-semibold text-sm">{error}</div>
        )}
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-red-300 text-black font-semibold rounded-lg hover:bg-red-400 transition duration-300"
        >
          {loading ? 'Signing In...' : `Sign In as ${userType === 'student' ? 'Student' : 'Faculty'}`}
        </button>
        <p className={`mt-6 text-sm text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          {userType === 'student'
            ? 'New student? Contact admin to register.'
            : 'New faculty? Contact admin for access.'}
        </p>
      </div>
      {/* Settings Modal */}
      {showSettings && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.25)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:isDark?'#232a39':'#fff',borderRadius:18,padding:32,minWidth:340,boxShadow:'0 2px 24px #0002',position:'relative'}}>
            <button onClick={()=>setShowSettings(false)} style={{position:'absolute',top:18,right:18,fontSize:22,background:'none',border:'none',cursor:'pointer',color:isDark?'#fff':'#222'}}>&times;</button>
            <div style={{fontWeight:700,fontSize:20,marginBottom:24,color:isDark?'#fff':'#222'}}>Settings</div>
            <div style={{marginBottom:18}}>
              <label style={{fontWeight:500,fontSize:15,color:isDark?'#fff':'#222'}}>Language</label>
              <select disabled value="English" style={{width:'100%',marginTop:8,padding:'10px 12px',borderRadius:8,border:'1px solid #ccc',background:isDark?'#232a39':'#f3f4f6',color:isDark?'#fff':'#222',fontSize:15}}>
                <option>English</option>
              </select>
            </div>
            <div style={{marginBottom:18}}>
              <label style={{fontWeight:500,fontSize:15,color:isDark?'#fff':'#222'}}>Theme</label>
              <div style={{display:'flex',gap:16,marginTop:8}}>
                <button
                  onClick={()=>setTheme('light')}
                  style={{
                    flex:1,padding:'10px 0',borderRadius:8,border:'1.5px solid #ccc',background:!isDark?'#e0e7ef':'#232a39',color:!isDark?'#222':'#aaa',fontWeight:600,fontSize:15,cursor:'pointer',boxShadow:!isDark?'0 1px 4px #0001':'none'
                  }}
                >Light</button>
                <button
                  onClick={()=>setTheme('dark')}
                  style={{
                    flex:1,padding:'10px 0',borderRadius:8,border:'1.5px solid #ccc',background:isDark?'#232a39':'#e0e7ef',color:isDark?'#fff':'#222',fontWeight:600,fontSize:15,cursor:'pointer',boxShadow:isDark?'0 1px 4px #0001':'none'
                  }}
                >Dark</button>
              </div>
            </div>
            <button onClick={()=>setShowSettings(false)} style={{marginTop:12,width:'100%',padding:'12px 0',borderRadius:8,background:'#2563eb',color:'#fff',fontWeight:600,fontSize:16,border:'none',cursor:'pointer'}}>Save Settings</button>
          </div>
        </div>
      )}
    </div>
  );
}
