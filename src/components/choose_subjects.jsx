import React from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import { FaCog } from 'react-icons/fa';

const subjects = [
  // 1st Year 1st Sem
  { sem: '1st Year - Sem I', name: 'BEE' },
  { sem: '1st Year - Sem I', name: 'PPS-1' },
  { sem: '1st Year - Sem I', name: 'Maths-1' },
  { sem: '1st Year - Sem I', name: 'Applied-Physics' },
  // 1st Year 2nd Sem
  { sem: '1st Year - Sem II', name: 'Maths-2' },
  { sem: '1st Year - Sem II', name: 'English' },
  { sem: '1st Year - Sem II', name: 'Chemistry' },
  { sem: '1st Year - Sem II', name: 'PPS-2' },
  // 2nd Year 1st Sem
  { sem: '2nd Year - Sem I', name: 'Data-Structures' },
  { sem: '2nd Year - Sem I', name: 'Digital-Logic-Design' },
  { sem: '2nd Year - Sem I', name: 'Discrete-Maths' },
  { sem: '2nd Year - Sem I', name: 'Probability-Statistics' },
  { sem: '2nd Year - Sem I', name: 'Python' },
  // 2nd Year 2nd Sem
  { sem: '2nd Year - Sem II', name: 'Computer-Organisation' },
  { sem: '2nd Year - Sem II', name: 'FLAT' },
  { sem: '2nd Year - Sem II', name: 'Software-Engineering' },
  { sem: '2nd Year - Sem II', name: 'DBMS' },
  { sem: '2nd Year - Sem II', name: 'OOP' },
];

function UploadPopup({ open, onClose, subject }) {
  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus("");
  };

  const handleFileNameChange = (e) => {
    setFileName(e.target.value);
    setStatus("");
  };

  const handleUploadClick = () => {
    if (!file) {
      setStatus("Please select a file.");
      return;
    }
    if (!fileName.trim()) {
      setStatus("Please enter a file name.");
      return;
    }
    setShowConfirmation(true);
  };

  const handleConfirmUpload = async () => {
    setShowConfirmation(false);
    setLoading(true);
    setStatus("");
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("file", file);
    formData.append("fileName", fileName.trim());
    try {
      const res = await fetch("http://localhost:5000/upload_file", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Upload successful!");
        setFile(null);
        setFileName("");
      } else {
        setStatus(data.error || "Upload failed.");
      }
    } catch (err) {
      setStatus("Upload failed.");
    }
    setLoading(false);
  };

  const handleCancelUpload = () => {
    setShowConfirmation(false);
  };

  if (!open) return null;
  return (
    <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <div style={{background:'#fff',borderRadius:12,padding:32,minWidth:320,maxWidth:400,position:'relative',boxShadow:'0 2px 16px #0002'}}>
        <button onClick={onClose} style={{position:'absolute',top:12,right:16,fontSize:24,background:'none',border:'none',cursor:'pointer'}}>&times;</button>
        <h2 style={{fontSize:22,marginBottom:16,color:'#222',fontWeight:600}}>Upload File for {subject}</h2>
        <input
          type="text"
          placeholder="File Name (e.g. PPS-2 All Units)"
          value={fileName}
          onChange={handleFileNameChange}
          style={{marginBottom:12, width:'100%', padding:8, borderRadius:6, border:'1px solid #ccc'}}
        />
        <input
          type="file"
          accept=".pdf,.docx,.ppt,.pptx"
          onChange={handleFileChange}
          style={{marginBottom:16}}
        />
        <button
          onClick={handleUploadClick}
          disabled={loading}
          style={{width:'100%',padding:'10px 0',background:'#fca5a5',color:'#222',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',fontSize:16,marginBottom:12}}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {status && <div style={{color:status.includes('success')?'green':'red',marginTop:8,fontWeight:500}}>{status}</div>}
      </div>
      {/* Confirmation Popup */}
      {showConfirmation && (
        <div style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.7)',zIndex:3000,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:12,padding:32,minWidth:320,maxWidth:400,position:'relative',boxShadow:'0 4px 24px #0003'}}>
            <h3 style={{fontSize:20,marginBottom:16,color:'#222',fontWeight:600}}>Confirm Upload</h3>
            <div style={{marginBottom:20}}>
              <p style={{marginBottom:8,color:'#555'}}><strong>Subject:</strong> {subject}</p>
              <p style={{marginBottom:8,color:'#555'}}><strong>File:</strong> {file?.name}</p>
              <p style={{marginBottom:8,color:'#555'}}><strong>Custom Name:</strong> {fileName}</p>
              <p style={{marginBottom:8,color:'#555'}}><strong>Size:</strong> {(file?.size / 1024 / 1024).toFixed(2)} MB</p>
              <p style={{marginBottom:8,color:'#555'}}><strong>Type:</strong> {file?.type || 'Unknown'}</p>
            </div>
            <div style={{display:'flex',gap:12}}>
              <button
                onClick={handleConfirmUpload}
                disabled={loading}
                style={{flex:1,padding:'10px 0',background:'#4ade80',color:'white',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',fontSize:16}}
              >
                {loading ? 'Uploading...' : 'Confirm Upload'}
              </button>
              <button
                onClick={handleCancelUpload}
                disabled={loading}
                style={{flex:1,padding:'10px 0',background:'#f87171',color:'white',border:'none',borderRadius:8,fontWeight:600,cursor:'pointer',fontSize:16}}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ChooseSubjects() {
  const navigate = useNavigate();
  const [uploadSubject, setUploadSubject] = React.useState(null);
  const [showSettings, setShowSettings] = React.useState(false);
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'dark');
  React.useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  const isDark = theme === 'dark';
  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-[#181e29]' : 'bg-gray-100'}`} style={{position:'relative',overflow:'hidden'}}>
      {/* Floating SVGs (reuse from LoginForm) */}
      {/* ... SVGs ... */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl flex flex-col items-center">
          <button
            className="mb-4 bg-gray-200 text-black px-4 py-2 rounded-lg shadow hover:bg-gray-300"
            onClick={() => navigate(-1)}
            style={{alignSelf: 'flex-start'}}
          >
            &#8592; Back
          </button>
          <div className={`${isDark ? 'bg-[#232a39] border-[#232a39]' : 'bg-white border-gray-200'} border p-8 rounded-2xl w-full shadow-xl relative`}>
            <button onClick={() => setShowSettings(true)} style={{position:'absolute',top:18,right:18,background:'none',border:'none',cursor:'pointer',zIndex:2}}>
              <FaCog size={22} color={isDark ? '#fff' : '#222'} />
            </button>
            <h2 className={`${isDark ? 'text-white' : 'text-black'} text-2xl font-bold mb-8`}>Choose Subject</h2>
            <div className="flex flex-col gap-2">
              {subjects.map((subj, idx) => (
                <div key={subj.sem + subj.name + idx} className="flex flex-row items-center gap-4">
                  <span className="text-gray-500 text-sm w-48 text-left">{subj.sem}</span>
                  <button className="flex-1 py-3 bg-red-300 text-black rounded-lg font-semibold hover:bg-red-400 transition duration-300" onClick={() => setUploadSubject(subj.name)}>
                    {subj.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
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
      <UploadPopup open={!!uploadSubject} onClose={() => setUploadSubject(null)} subject={uploadSubject} />
    </div>
  );
} 