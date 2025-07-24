import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import { FaCog } from 'react-icons/fa';

export default function StudentYearSemester() {
  const [year, setYear] = useState('1st');
  const [semester, setSemester] = useState('I');
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = React.useState(false);
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'dark');
  const isDark = theme === 'dark';

  React.useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (year === '1st' && semester === 'I') {
      navigate('/1-Sem-I');
    } else if (year === '1st' && semester === 'II') {
      navigate('/1-Sem-II');
    } else if (year === '2nd' && semester === 'I') {
      navigate('/2-Sem-I');
    } else if (year === '2nd' && semester === 'II') {
      navigate('/2-Sem-II');
    } else {
      alert(`Selected: ${year} year, Semester ${semester}`);
    }
  };

  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-[#181e29]' : 'bg-gray-100'}`} style={{position:'relative',overflow:'hidden'}}>
      {/* Floating SVGs (reuse from LoginForm) */}
      {/* ... SVGs ... */}
      <AnimatedBackground />
      <div className="flex items-center justify-center min-h-screen">
        <button
          className="absolute top-4 left-4 bg-gray-200 text-black px-4 py-2 rounded-lg shadow hover:bg-gray-300"
          onClick={() => navigate(-1)}
          style={{zIndex: 10}}
        >
          &#8592; Back
        </button>
        <div className={`${isDark ? 'bg-[#232a39] border-[#232a39]' : 'bg-white border-gray-200'} border p-8 rounded-2xl w-full max-w-2xl shadow-xl relative`}>
          <button onClick={() => setShowSettings(true)} style={{position:'absolute',top:18,right:18,background:'none',border:'none',cursor:'pointer',zIndex:2}}>
            <FaCog size={22} color={isDark ? '#fff' : '#222'} />
          </button>
          <h2 className={`${isDark ? 'text-white' : 'text-black'} text-xl font-bold mb-6 text-center`}>Select Year & Semester</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className={`${isDark ? 'text-white' : 'text-black'} block mb-2`}>Year</label>
              <select
                className={`w-full px-4 py-3 rounded-lg border border-gray-300 ${isDark ? 'bg-[#32394a] text-white' : 'bg-gray-200 text-black'}`}
                value={year}
                onChange={e => setYear(e.target.value)}
              >
                <option value="1st">1st</option>
                <option value="2nd">2nd</option>
                <option value="3rd">3rd</option>
                <option value="4th">4th</option>
              </select>
            </div>
            <div className="mb-6">
              <label className={`${isDark ? 'text-white' : 'text-black'} block mb-2`}>Semester</label>
              <select
                className={`w-full px-4 py-3 rounded-lg border border-gray-300 ${isDark ? 'bg-[#32394a] text-white' : 'bg-gray-200 text-black'}`}
                value={semester}
                onChange={e => setSemester(e.target.value)}
              >
                <option value="I">I</option>
                <option value="II">II</option>
              </select>
            </div>
            <button type="submit" className="w-full py-3 bg-red-300 text-black font-semibold rounded-lg hover:bg-red-400 transition duration-300">
              Submit
            </button>
          </form>
        </div>
      </div>
      {/* Settings Modal (reuse from LoginForm) */}
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
                <button onClick={()=>setTheme('light')} style={{flex:1,padding:'10px 0',borderRadius:8,border:'1.5px solid #ccc',background:!isDark?'#e0e7ef':'#232a39',color:!isDark?'#222':'#aaa',fontWeight:600,fontSize:15,cursor:'pointer',boxShadow:!isDark?'0 1px 4px #0001':'none'}}>Light</button>
                <button onClick={()=>setTheme('dark')} style={{flex:1,padding:'10px 0',borderRadius:8,border:'1.5px solid #ccc',background:isDark?'#232a39':'#e0e7ef',color:isDark?'#fff':'#222',fontWeight:600,fontSize:15,cursor:'pointer',boxShadow:isDark?'0 1px 4px #0001':'none'}}>Dark</button>
              </div>
            </div>
            <button onClick={()=>setShowSettings(false)} style={{marginTop:12,width:'100%',padding:'12px 0',borderRadius:8,background:'#2563eb',color:'#fff',fontWeight:600,fontSize:16,border:'none',cursor:'pointer'}}>Save Settings</button>
          </div>
        </div>
      )}
    </div>
  );
} 