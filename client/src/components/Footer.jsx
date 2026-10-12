import React from 'react';
import { Sparkles, Code2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border-light)',
      padding: '2.5rem 1.25rem 2rem 1.25rem',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--primary)" />
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            Peer<span style={{ color: 'var(--primary)' }}>Skill</span> Exchange Platform
          </span>
        </div>

        <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', maxWidth: '640px' }}>
          An Academic Full-Stack Software Engineering (SEPM) and Web Application Development (WAD) Project.
          Fostering zero-cost, high-impact peer-to-peer learning among undergraduate college students.
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)'
        }}>
          <span>Dual-Engine Persistence (MongoDB / Local Store)</span>
          <span>•</span>
          <span>Rules-Based Matching Algorithm</span>
          <span>•</span>
          <span>Credit Barter Economy</span>
        </div>

        <div style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          borderTop: '1px solid var(--border-subtle)',
          width: '100%',
          paddingTop: '1.25rem',
          marginTop: '0.5rem'
        }}>
          © {new Date().getFullYear()} Peer Skill Exchange Platform. Developed for WAD & SEPM Academic Review.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
