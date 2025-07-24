import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import StudentYearSemester from './components/StudentYearSemester';
import OneSemI from './components/1-Sem-I';
import OneSemII from './components/1-Sem-II';
import TwoSemI from './components/2-Sem-I';
import TwoSemII from './components/2-Sem-II';
import ChooseSubjects from './components/choose_subjects';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/student" element={<StudentYearSemester />} />
        <Route path="/1-Sem-I" element={<OneSemI />} />
        <Route path="/1-Sem-II" element={<OneSemII />} />
        <Route path="/2-Sem-I" element={<TwoSemI />} />
        <Route path="/2-Sem-II" element={<TwoSemII />} />
        <Route path="/choose_subjects" element={<ChooseSubjects />} />
      </Routes>
    </Router>
  );
}