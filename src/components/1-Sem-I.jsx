import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AnimatedBackground from './AnimatedBackground';
import { FaCog } from 'react-icons/fa';

function PdfModal({ open, url, filename, onClose, isDark }) {
  const [messages, setMessages] = React.useState([
    { from: 'bot', text: 'Hello! Have a doubt or question about this file? Ask me.' }
  ]);
  const [input, setInput] = React.useState('');
  const [showChatbot, setShowChatbot] = React.useState(true);
  const chatEndRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setMessages([{ from: 'bot', text: 'Hello! Have a doubt or question about this file? Ask me.' }]);
      setInput('');
      setShowChatbot(true);
    }
  }, [open, url]);

  React.useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(msgs => [
      ...msgs,
      { from: 'user', text: trimmed },
      { from: 'bot', text: '...'} // loading placeholder
    ]);
    setInput('');
    try {
      const res = await fetch('http://localhost:5000/chat-groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed })
      });
      const data = await res.json();
      setMessages(msgs => {
        // Remove the last '...' placeholder
        const newMsgs = msgs.slice(0, -1);
        if (data.reply) {
          return [...newMsgs, { from: 'bot', text: data.reply }];
        } else {
          return [...newMsgs, { from: 'bot', text: 'Error: ' + (data.error || 'No reply') }];
        }
      });
    } catch (err) {
      setMessages(msgs => {
        const newMsgs = msgs.slice(0, -1);
        return [...newMsgs, { from: 'bot', text: 'Error: Could not reach server' }];
      });
    }
  };

  const fileExt = filename.split('.').pop().toLowerCase();
  let viewerContent;
  if (fileExt === 'pdf') {
    viewerContent = (
      <iframe
        src={url}
        title={filename}
        style={{
          width: '90%', maxWidth: 600, height: '75vh',
          border: '1px solid #ccc', borderRadius: 8, background: '#fafafa', marginLeft: 32, marginBottom: 32
        }}
        allow="autoplay"
      />
    );
  } else if (fileExt === 'docx' || fileExt === 'ppt' || fileExt === 'pptx') {
    const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
    viewerContent = (
      <iframe
        src={officeUrl}
        title={filename}
        style={{
          width: '90%', maxWidth: 600, height: '75vh',
          border: '1px solid #ccc', borderRadius: 8, background: '#fafafa', marginLeft: 32, marginBottom: 32
        }}
        allow="autoplay"
      />
    );
  } else {
    viewerContent = (
      <div style={{
        width: '90%', maxWidth: 600, height: '75vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        border: '1px solid #eee', borderRadius: 8, background: '#fafafa', marginLeft: 32, marginBottom: 32
      }}>
        <div style={{fontSize: 18, color: '#444', marginBottom: 18, textAlign: 'center'}}>Preview not supported for this file type.<br/>You can download the file below.</div>
        <a href={url} download={filename} target="_blank" rel="noopener noreferrer" style={{
          background: '#a7f3d0', color: '#222', fontWeight: 600, fontSize: 16, borderRadius: 8, padding: '10px 28px', textDecoration: 'none', boxShadow: '0 1px 4px #0001', border: 'none', cursor: 'pointer', marginTop: 8
        }}>Download</a>
      </div>
    );
  }

  if (!open || !url) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.7)', zIndex: 2000, display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 24,
        maxWidth: 1200, width: '90vw', height: '92vh',
        justifyContent: 'center', alignItems: 'stretch'
      }}>
        {/* File Viewer Card */}
        <div style={{
          background: isDark ? '#232a39' : '#fff',
          color: isDark ? '#fff' : '#222',
          borderRadius: 14, boxShadow: '0 2px 24px #0002',
          padding: 0, width: 0, flex: '0 0 50%', minWidth: 0, maxWidth: 680, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '92vh',
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, right: 16, fontSize: 28,
            background: 'none', border: 'none', cursor: 'pointer', zIndex: 10
          }}>&times;</button>
          <div style={{margin: '32px 0 12px 32px', fontWeight: 600, fontSize: 20, color: isDark ? '#fff' : '#222', alignSelf: 'flex-start'}}>{filename}</div>
          {viewerContent}
        </div>
        {/* Chatbot Card */}
        {showChatbot && (
        <div style={{
          background: isDark ? '#232a39' : '#fff',
          color: isDark ? '#fff' : '#222',
          borderRadius: 14, boxShadow: '0 2px 24px #0002',
          width: 0, flex: '0 0 50%', minWidth: 0, maxWidth: 520, display: 'flex', flexDirection: 'column', height: '92vh', position: 'relative'}}>
          <button onClick={() => setShowChatbot(false)} style={{
            position: 'absolute', top: 12, right: 16, fontSize: 24,
            background: 'none', border: 'none', cursor: 'pointer', zIndex: 10, color: isDark ? '#fff' : '#888'
          }}>&times;</button>
          <div style={{padding: '24px 24px 12px 24px', borderBottom: '1.5px solid #eee', fontWeight: 700, fontSize: 18, color: isDark ? '#fff' : '#222', background: isDark ? '#232a39' : '#f1f5f9', borderTopLeftRadius: 14, borderTopRightRadius: 14}}>Chatbot</div>
          <div style={{flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 16}}>
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start',
                  background: msg.from === 'user' ? (isDark ? '#334155' : '#dbeafe') : (isDark ? '#14532d' : '#e0fce0'),
                  color: isDark ? '#fff' : '#222',
                  borderRadius: 12,
                  padding: '12px 18px',
                  fontSize: 15,
                  boxShadow: '0 1px 4px #0001',
                  maxWidth: '90%'
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form style={{padding: '16px 24px', borderTop: '1.5px solid #eee', background: isDark ? '#232a39' : '#f1f5f9', borderBottomLeftRadius: 14, borderBottomRightRadius: 14, display: 'flex', gap: 8}} onSubmit={handleSend}>
            <input
              type="text"
              placeholder="Type your question..."
              style={{width: '100%', padding: '10px 14px', borderRadius: 8, border: isDark ? '1px solid #444' : '1px solid #ccc', fontSize: 15, outline: 'none', background: isDark ? '#32394a' : '#fff', color: isDark ? '#fff' : '#222'}}
              value={input}
              onChange={e => setInput(e.target.value)}
              autoFocus
            />
            <button type="submit" style={{background:isDark?'#fca5a5':'#fca5a5',color:isDark?'#222':'#222',border:'none',borderRadius:8,padding:'0 18px',fontWeight:600,fontSize:15,cursor:'pointer'}}>Send</button>
          </form>
        </div>
        )}
      </div>
    </div>
  );
}

function BeePdfPopup({ open, onClose, isDark }) {
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState('');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfToView, setPdfToView] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');

  useEffect(() => {
    if (!open) return;
    fetch('http://localhost:5000/list-pdfs')
      .then(res => res.json())
      .then(data => {
        setPdfs(data);
        setError('');
        setPdfModalOpen(false);
        setPdfToView('');
        setPdfFilename('');
      })
      .catch(err => {
        setError('Failed to load PDFs.');
        setPdfs([]);
        setPdfModalOpen(false);
        setPdfToView('');
        setPdfFilename('');
      });
  }, [open]);

  const openPdf = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      setPdfToView(`http://localhost:5000/proxy-pdf?url=${encodeURIComponent(url)}`);
    } else {
      setPdfToView(url);
    }
    setPdfFilename(url.split('/').pop());
    setPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setPdfModalOpen(false);
    setPdfToView('');
    setPdfFilename('');
  };

  if (!open) return null;

  return (
    <>
      <div style={{position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{background:isDark?'#232a39':'#fff', color:isDark?'#fff':'#222', borderRadius:12, padding:24, width:'90vw', maxWidth:800, maxHeight:'90vh', overflow:'auto', position:'relative'}}>
          <button onClick={onClose} style={{position:'absolute', top:12, right:16, fontSize:24, background:'none', border:'none', cursor:'pointer'}}>&times;</button>
          <h1 style={{color:isDark?'#fff':'#333', fontSize:28, marginBottom:16}}>📄 BEE Resources</h1>
          <div style={{marginBottom:20, display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'center', alignItems:'center', gap:16}}>
            {error && <p style={{ color: 'red', width: '100%' }}>{error}</p>}
            {pdfs.map(url => {
              const filename = url.split('/').pop();
              const proxyUrl = `http://localhost:5000/proxy-pdf?url=${encodeURIComponent(url)}`;
              return (
                <div key={url} style={{display: 'inline-flex', alignItems: 'center', margin: 0, gap: 8}}>
                  <button
                    onClick={() => openPdf(url)}
                    style={{
                      margin: 0,
                      padding: '10px 28px',
                      background: '#fca5a5',
                      color: '#222',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      minWidth: 120,
                      maxWidth: 200,
                      marginBottom: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {filename}
                  </button>
                  <a
                    href={url}
                    download
                    style={{
                      display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0
                    }}
                    title={`Download ${filename}`}
                    onClick={e => e.stopPropagation()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:32}}>
            <button
              style={{
                background:'#98f59e',
                color:'#222',
                border:'none',
                borderRadius:7,
                padding:'8px 18px',
                fontWeight:600,
                fontSize:15,
                cursor:'pointer',
                boxShadow:'0 2px 8px #98f59e22',
                transition:'background 0.2s',
              }}
              onClick={()=>alert('Test feature coming soon!')}
            >
              Take a Test
            </button>
          </div>
        </div>
      </div>
      <PdfModal open={pdfModalOpen} url={pdfToView} filename={pdfFilename} onClose={closePdfModal} isDark={isDark} />
    </>
  );
}

function Pps1PdfPopup({ open, onClose, isDark }) {
  const [pdfs, setPdfs] = useState([]);
  const [error, setError] = useState('');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfToView, setPdfToView] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');

  useEffect(() => {
    if (!open) return;
    fetch('http://localhost:5000/list-pps1-pdfs')
      .then(res => res.json())
      .then(data => {
        setPdfs(data);
        setError('');
        setPdfModalOpen(false);
        setPdfToView('');
        setPdfFilename('');
      })
      .catch(err => {
        setError('Failed to load PDFs.');
        setPdfs([]);
        setPdfModalOpen(false);
        setPdfToView('');
        setPdfFilename('');
      });
  }, [open]);

  const openPdf = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      setPdfToView(`http://localhost:5000/proxy-pdf?url=${encodeURIComponent(url)}`);
    } else {
      setPdfToView(url);
    }
    setPdfFilename(url.split('/').pop());
    setPdfModalOpen(true);
  };

  const closePdfModal = () => {
    setPdfModalOpen(false);
    setPdfToView('');
    setPdfFilename('');
  };

  if (!open) return null;

  return (
    <>
      <div style={{position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{background:isDark?'#232a39':'#fff', color:isDark?'#fff':'#222', borderRadius:12, padding:24, width:'90vw', maxWidth:800, maxHeight:'90vh', overflow:'auto', position:'relative'}}>
          <button onClick={onClose} style={{position:'absolute', top:12, right:16, fontSize:24, background:'none', border:'none', cursor:'pointer'}}>&times;</button>
          <h1 style={{color:isDark?'#fff':'#333', fontSize:28, marginBottom:16}}>📄 PPS-1 Resources</h1>
          <div style={{marginBottom:20, display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'center', alignItems:'center', gap:16}}>
            {error && <p style={{ color: 'red', width: '100%' }}>{error}</p>}
            {pdfs.map(url => {
              const filename = url.split('/').pop();
              const proxyUrl = `http://localhost:5000/proxy-pdf?url=${encodeURIComponent(url)}`;
              return (
                <div key={url} style={{display: 'inline-flex', alignItems: 'center', margin: 0, gap: 8}}>
                  <button
                    onClick={() => openPdf(url)}
                    style={{
                      margin: 0,
                      padding: '10px 28px',
                      background: '#fca5a5',
                      color: '#222',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      minWidth: 120,
                      maxWidth: 200,
                      marginBottom: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {filename}
                  </button>
                  <a
                    href={url}
                    download
                    style={{
                      display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0
                    }}
                    title={`Download ${filename}`}
                    onClick={e => e.stopPropagation()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:32}}>
            <button
              style={{
                background:'#98f59e', // pistachio green from image
                color:'#222',
                border:'none',
                borderRadius:7,
                padding:'8px 18px',
                fontWeight:600,
                fontSize:15,
                cursor:'pointer',
                boxShadow:'0 2px 8px #98f59e22',
                transition:'background 0.2s',
              }}
              onClick={()=>alert('Test feature coming soon!')}
            >
              Take a Test
            </button>
          </div>
        </div>
      </div>
      <PdfModal open={pdfModalOpen} url={pdfToView} filename={pdfFilename} onClose={closePdfModal} isDark={isDark} />
    </>
  );
}

function Maths1PdfPopup({ open, onClose, isDark }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfToView, setPdfToView] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');

  useEffect(() => {
    if (!open) return;
    fetch('http://localhost:5000/list-maths1-files')
      .then(res => res.json())
      .then(data => {
        setFiles(data);
        setError('');
        setPdfModalOpen(false);
        setPdfToView('');
        setPdfFilename('');
      })
      .catch(err => {
        setError('Failed to load files.');
        setFiles([]);
        setPdfModalOpen(false);
        setPdfToView('');
        setPdfFilename('');
      });
  }, [open]);

  const openPdf = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      setPdfToView(`http://localhost:5000/proxy-pdf?url=${encodeURIComponent(url)}`);
    } else {
      setPdfToView(url);
    }
    setPdfFilename(url.split('/').pop());
    setPdfModalOpen(true);
  };

  const downloadFile = (url) => {
    window.open(url, '_blank');
  };

  const closePdfModal = () => {
    setPdfModalOpen(false);
    setPdfToView('');
    setPdfFilename('');
  };

  if (!open) return null;

  return (
    <>
      <div style={{position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{background:isDark?'#232a39':'#fff', color:isDark?'#fff':'#222', borderRadius:12, padding:24, width:'90vw', maxWidth:800, maxHeight:'90vh', overflow:'auto', position:'relative'}}>
          <button onClick={onClose} style={{position:'absolute', top:12, right:16, fontSize:24, background:'none', border:'none', cursor:'pointer'}}>&times;</button>
          <h1 style={{color:isDark?'#fff':'#333', fontSize:28, marginBottom:16}}>📄 Maths-1 Resources</h1>
          <div style={{marginBottom:20, display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'center', alignItems:'center', gap:16}}>
            {error && <p style={{ color: 'red', width: '100%' }}>{error}</p>}
            {files.map(url => {
              const filename = url.split('/').pop();
              const ext = filename.split('.').pop().toLowerCase();
              const isPdf = ext === 'pdf';
              const isDocx = ext === 'docx';
              const isPpt = ext === 'ppt' || ext === 'pptx';
              let bg = isPdf ? '#fca5a5' : isDocx ? '#a5d8fc' : isPpt ? '#fcd5a5' : '#eee';
              let icon = isPdf ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              ) : isDocx ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" /></svg>
              ) : isPpt ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M12 8v8" /></svg>
              ) : null;
              return (
                <div key={url} style={{display: 'inline-flex', alignItems: 'center', margin: 0, gap: 8}}>
                  <button
                    onClick={() => openPdf(url)}
                    style={{
                      margin: 0,
                      padding: '10px 28px',
                      background: bg,
                      color: '#222',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      minWidth: 120,
                      maxWidth: 200,
                      marginBottom: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {filename}
                    {icon}
                  </button>
                  <a
                    href={url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0
                    }}
                    title={`Download ${filename}`}
                    onClick={e => e.stopPropagation()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:32}}>
            <button
              style={{
                background:'#98f59e', // pistachio green from image
                color:'#222',
                border:'none',
                borderRadius:7,
                padding:'8px 18px',
                fontWeight:600,
                fontSize:15,
                cursor:'pointer',
                boxShadow:'0 2px 8px #98f59e22',
                transition:'background 0.2s',
              }}
              onClick={()=>alert('Test feature coming soon!')}
            >
              Take a Test
            </button>
          </div>
        </div>
      </div>
      <PdfModal open={pdfModalOpen} url={pdfToView} filename={pdfFilename} onClose={closePdfModal} isDark={isDark} />
    </>
  );
}

function AppliedPhysicsFilesPopup({ open, onClose, isDark }) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfToView, setPdfToView] = useState('');
  const [pdfFilename, setPdfFilename] = useState('');

  useEffect(() => {
    if (!open) return;
    fetch('http://localhost:5000/list-applied-physics-files')
      .then(res => res.json())
      .then(data => {
        setFiles(data);
        setError('');
        setPdfModalOpen(false);
        setPdfToView('');
        setPdfFilename('');
      })
      .catch(err => {
        setError('Failed to load files.');
        setFiles([]);
        setPdfModalOpen(false);
        setPdfToView('');
        setPdfFilename('');
      });
  }, [open]);

  const openPdf = (url) => {
    const ext = url.split('.').pop().toLowerCase();
    if (ext === 'pdf') {
      setPdfToView(`http://localhost:5000/proxy-pdf?url=${encodeURIComponent(url)}`);
    } else {
      setPdfToView(url);
    }
    setPdfFilename(url.split('/').pop());
    setPdfModalOpen(true);
  };

  const downloadFile = (url) => {
    window.open(url, '_blank');
  };

  const closePdfModal = () => {
    setPdfModalOpen(false);
    setPdfToView('');
    setPdfFilename('');
  };

  if (!open) return null;

  return (
    <>
      <div style={{position: 'fixed', top:0, left:0, width:'100vw', height:'100vh', background:'rgba(0,0,0,0.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <div style={{background:isDark?'#232a39':'#fff', color:isDark?'#fff':'#222', borderRadius:12, padding:24, width:'90vw', maxWidth:800, maxHeight:'90vh', overflow:'auto', position:'relative'}}>
          <button onClick={onClose} style={{position:'absolute', top:12, right:16, fontSize:24, background:'none', border:'none', cursor:'pointer'}}>&times;</button>
          <h1 style={{color:isDark?'#fff':'#333', fontSize:28, marginBottom:16}}>📄 Applied-Physics Resources</h1>
          <div style={{marginBottom:20, display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'center', alignItems:'center', gap:16}}>
            {error && <p style={{ color: 'red', width: '100%' }}>{error}</p>}
            {files.map(url => {
              const filename = url.split('/').pop();
              const ext = filename.split('.').pop().toLowerCase();
              const isPdf = ext === 'pdf';
              const isDocx = ext === 'docx';
              const isPpt = ext === 'ppt' || ext === 'pptx';
              let bg = isPdf ? '#fca5a5' : isDocx ? '#a5d8fc' : isPpt ? '#fcd5a5' : '#eee';
              let icon = isPdf ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              ) : isDocx ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" /></svg>
              ) : isPpt ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8M12 8v8" /></svg>
              ) : null;
              return (
                <div key={url} style={{display: 'inline-flex', alignItems: 'center', margin: 0, gap: 8}}>
                  <button
                    onClick={() => isPdf ? openPdf(url) : downloadFile(url)}
                    style={{
                      margin: 0,
                      padding: '10px 28px',
                      background: bg,
                      color: '#222',
                      border: 'none',
                      borderRadius: 8,
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'center',
                      minWidth: 120,
                      maxWidth: 200,
                      marginBottom: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8
                    }}
                  >
                    {filename}
                    {icon}
                  </button>
                  <a
                    href={url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', padding: 0
                    }}
                    title={`Download ${filename}`}
                    onClick={e => e.stopPropagation()}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
                    </svg>
                  </a>
                </div>
              );
            })}
          </div>
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:32}}>
            <button
              style={{
                background:'#98f59e', // pistachio green from image
                color:'#222',
                border:'none',
                borderRadius:7,
                padding:'8px 18px',
                fontWeight:600,
                fontSize:15,
                cursor:'pointer',
                boxShadow:'0 2px 8px #98f59e22',
                transition:'background 0.2s',
              }}
              onClick={()=>alert('Test feature coming soon!')}
            >
              Take a Test
            </button>
          </div>
        </div>
      </div>
      <PdfModal open={pdfModalOpen} url={pdfToView} filename={pdfFilename} onClose={closePdfModal} isDark={isDark} />
    </>
  );
}

export default function OneSemI() {
  const [showBeePopup, setShowBeePopup] = useState(false);
  const [showPps1Popup, setShowPps1Popup] = useState(false);
  const [showMaths1Popup, setShowMaths1Popup] = useState(false);
  const [showAppliedPhysicsPopup, setShowAppliedPhysicsPopup] = useState(false);
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = React.useState(false);
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'dark');
  React.useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);
  const isDark = theme === 'dark';
  return (
    <div className={`min-h-screen w-full ${isDark ? 'bg-[#181e29]' : 'bg-gray-100'}`} style={{position:'relative',overflow:'hidden'}}>
      <AnimatedBackground />
      <button
        className="absolute top-4 left-4 bg-gray-200 text-black px-4 py-2 rounded-lg shadow hover:bg-gray-300"
        onClick={() => navigate(-1)}
        style={{zIndex: 10}}
      >
        &#8592; Back
      </button>
      <div className="flex items-center justify-center min-h-screen">
        <div className={`${isDark ? 'bg-[#232a39] border-[#232a39]' : 'bg-white border-gray-200'} border p-8 rounded-2xl w-full max-w-2xl shadow-xl relative`}>
          <button onClick={() => setShowSettings(true)} style={{position:'absolute',top:18,right:18,background:'none',border:'none',cursor:'pointer',zIndex:2}}>
            <FaCog size={22} color={isDark ? '#fff' : '#222'} />
          </button>
          <h2 className={`${isDark ? 'text-white' : 'text-black'} text-2xl font-bold mb-8`}>1st Year - Semester I Subjects</h2>
          <div className="flex flex-col gap-4">
            <button className="py-3 bg-red-300 text-black rounded-lg font-semibold hover:bg-red-400 transition duration-300" onClick={() => setShowBeePopup(true)}>BEE</button>
            <button className="py-3 bg-red-300 text-black rounded-lg font-semibold hover:bg-red-400 transition duration-300" onClick={() => setShowPps1Popup(true)}>PPS-1</button>
            <button className="py-3 bg-red-300 text-black rounded-lg font-semibold hover:bg-red-400 transition duration-300" onClick={() => setShowMaths1Popup(true)}>Maths-1</button>
            <button className="py-3 bg-red-300 text-black rounded-lg font-semibold hover:bg-red-400 transition duration-300" onClick={() => setShowAppliedPhysicsPopup(true)}>Applied-Physics</button>
          </div>
        </div>
      </div>
      <BeePdfPopup open={showBeePopup} onClose={() => setShowBeePopup(false)} isDark={isDark} />
      <Pps1PdfPopup open={showPps1Popup} onClose={() => setShowPps1Popup(false)} isDark={isDark} />
      <Maths1PdfPopup open={showMaths1Popup} onClose={() => setShowMaths1Popup(false)} isDark={isDark} />
      <AppliedPhysicsFilesPopup open={showAppliedPhysicsPopup} onClose={() => setShowAppliedPhysicsPopup(false)} isDark={isDark} />
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