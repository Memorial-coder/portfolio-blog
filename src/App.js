import { useRef, lazy, Suspense, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import NavBar from './components/NavBar'
import Home from './components/Home'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contacts from './components/Contacts'
import { Routes, Route } from 'react-router-dom';
import Preloader from './components/Preloader';
import Footer from './components/Footer';
import { OBSERVER_OPTIONS } from './config/constants';

// Lazy load components
const ProjectDetail = lazy(() => import('./components/ProjectDetail'));
const Uses = lazy(() => import('./components/Uses'));
const Blog = lazy(() => import('./components/Blog'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const AdminLogin = lazy(() => import('./components/AdminLogin'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const NotFound = lazy(() => import('./components/NotFound'));


function App() {
  const { theme, language, changeTabActive, registerSection } = useAppContext();

  // No need for dispatch as changeTabActive is directly from context

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  }, [language]);

  // Refs for sections
  const homeRef = useRef(null);
  const skillsRef = useRef(null);
  const projectsRef = useRef(null);
  const contactsRef = useRef(null);

  // Register refs to context
  useEffect(() => {
    registerSection('home', homeRef);
    registerSection('skills', skillsRef);
    registerSection('projects', projectsRef);
    registerSection('contacts', contactsRef);
  }, [registerSection]);

  // Scroll Spy Logic
  const activeSectionRef = useRef(null); // Track locally to avoid re-renders

  useEffect(() => {
    const observerOptions = OBSERVER_OPTIONS.SPY;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (activeSectionRef.current !== entry.target.id) {
            activeSectionRef.current = entry.target.id;
            changeTabActive(entry.target.id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sectionsRefs = [homeRef, skillsRef, projectsRef, contactsRef];
    sectionsRefs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, [changeTabActive]);

  return (
    <Suspense fallback={<div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <Routes>
        <Route path="/" element={
          <main>
            <Preloader />
            <NavBar />
            <Home ref={homeRef} />
            <Skills ref={skillsRef} />
            <Projects ref={projectsRef} />
            <Contacts ref={contactsRef} />
            <Footer />
          </main>
        } />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/uses" element={<Uses />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;
