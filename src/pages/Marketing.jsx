import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Cpu, Radio, Sun } from 'lucide-react';
import solarFarmImage from '../assets/solar-farm.png';
import '../styles/marketing.css';

const services = [
  { icon: Sun, title: 'Dual-axis Solar Tracking', text: 'Follow the sun across the sky with a panel that moves on both axes.' },
  { icon: Radio, title: 'Light-sensing Control', text: 'Four LDR sensors help the ESP32 find the brightest direction.' },
  { icon: Activity, title: 'Solar Monitoring', text: 'See panel power, voltage, current, and tracker readings together.' },
];

export default function Marketing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 80);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  return (
    <div className="marketing-site">
      <main>
        <section className="site-hero" id="home" aria-label="AutoLar dual-axis solar tracking">
          <img className="hero-background" src={solarFarmImage} alt="A clear view across a solar farm in the morning sun" />
          <div className="hero-shade" />
          <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
            <Link className="site-brand" to="/" aria-label="AutoLar home"><img className="site-brand-logo" src="/logo.png" alt="" /><span>AutoLar</span></Link>
            <nav className="site-nav" aria-label="Main navigation">
              <a href="#home">Home</a><a href="#services">Product</a><a href="#impact">Purpose</a><a href="#about">About Us</a>
              <Link className="site-nav-cta" to="/signup">Get started <ArrowRight size={14} /></Link>
            </nav>
            <div className="site-header-actions"><Link className="site-signin" to="/login">Sign in</Link><Link className="contact-button" to="/signup">Get started <ArrowRight size={14} /></Link></div>
          </header>

          <div className="hero-copy">
            <h1>Harness Clean<br /><span>Solar Energy</span></h1>
            <p>Follow the sun with a solar panel that moves on two axes. AutoLar brings tracking and system readings into one clear view.</p>
            <Link className="hero-cta" to="/signup">Get started <ArrowRight size={15} /></Link>
          </div>

          <article className="hero-project-card">
            <div className="project-card-copy"><span className="project-kicker"><Cpu size={13} /> AUTOLAR TRACKER</span><h2>Smarter solar, following the light.</h2><p>Light sensors guide the panel throughout the day.</p><a href="#services">Explore the system <ArrowRight size={13} /></a></div>
          </article>
          <div className="hero-bottom-line"><span /> SOLAR THAT MOVES WITH THE SUN</div>
        </section>

        <section className="impact-section" id="impact">
          <h2>Built around the way sunlight moves</h2>
          <div className="impact-stats">
            <article><strong>2</strong><span>Tracking axes</span></article>
            <article><strong>4</strong><span>LDR light sensors</span></article>
            <article><strong>1</strong><span>Clear system dashboard</span></article>
          </div>
        </section>

        <section className="services-section" id="services">
          <div className="services-heading"><span>// HOW AUTOLAR WORKS</span><h2>Clean solar tracking<br />built around the sun.</h2></div>
          <div className="services-grid">
            {services.map(({ icon: Icon, title, text }, index) => (
              <article className="service-card" key={title}>
                <div className="service-card-top"><span className="service-icon"><Icon size={20} strokeWidth={1.8} /></span><span className="service-number">0{index + 1}</span></div>
                <div><h3>{title}</h3><p>{text}</p></div>
                <span className="service-card-arrow"><ArrowRight size={16} /></span>
              </article>
            ))}
          </div>
        </section>

        <section className="about-strip" id="about">
          <span className="about-sun"><Sun size={22} /></span><div><span className="about-kicker">ABOUT AUTOLAR</span><h2>A solar tracker with a clear purpose.</h2><p>Move the panel toward the brightest light, measure its output, and make the system easy to understand.</p></div><Link to="/signup" className="about-link">Meet AutoLar <ArrowRight size={15} /></Link>
        </section>
      </main>
      <footer className="site-footer"><Link className="site-brand" to="/" aria-label="AutoLar home"><img className="site-brand-logo" src="/logo.png" alt="" /><span>AutoLar</span></Link><span>Dual-axis solar tracking</span><span>{'\u00a9'} {new Date().getFullYear()} AutoLar</span></footer>
    </div>
  );
}
