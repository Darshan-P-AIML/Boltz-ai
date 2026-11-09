import React from 'react';
import HackathonCard from './HackathonCard';
import { SkeletonGrid } from './SkeletonLoader';

export default function HomeSections({ 
  sections, 
  bookmarks, 
  onToggleBookmark, 
  onSelectHackathon 
}) {
  if (!sections) {
    return <SkeletonGrid count={6} />;
  }

  const renderSectionRow = (title, subtitle, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-primary)' }}>
              {title}
            </h2>
            {subtitle && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="hackathons-grid">
          {items.map((hackathon) => (
            <HackathonCard
              key={hackathon.id}
              hackathon={hackathon}
              isBookmarked={bookmarks.includes(hackathon.id)}
              onToggleBookmark={onToggleBookmark}
              onSelect={onSelectHackathon}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 1. Trending in India */}
      {renderSectionRow(
        "🔥 Trending in India",
        "Popular builder competitions and high prize pool events happening across India",
        sections.trending
      )}

      {/* 2. Closing Soon */}
      {renderSectionRow(
        "⏰ Closing Soon",
        "Registration deadlines ending in the next few days",
        sections.closingSoon
      )}

      {/* 3. AI & Machine Learning */}
      {renderSectionRow(
        "🤖 AI & Machine Learning",
        "Build autonomous AI agents, LLM frameworks, and computer vision tools",
        sections.aiMl
      )}

      {/* 4. Software & Web */}
      {renderSectionRow(
        "💻 Software & Web",
        "Full-stack web applications, microservices, and mobile app sprints",
        sections.softwareWeb
      )}

      {/* 5. Cybersecurity */}
      {renderSectionRow(
        "🔐 Cybersecurity",
        "CTF challenges, defensive security tools, and vulnerability assessments",
        sections.cybersecurity
      )}

      {/* 6. Cloud & DevOps */}
      {renderSectionRow(
        "☁️ Cloud & DevOps",
        "Kubernetes operators, serverless tooling, and CI/CD pipeline automation",
        sections.cloudDevops
      )}

      {/* 7. Web3 */}
      {renderSectionRow(
        "🌐 Web3",
        "Decentralized protocols, Ethereum layer-2 scaling, and account abstraction",
        sections.web3
      )}

      {/* 8. Student Hackathons */}
      {renderSectionRow(
        "🏫 Student Hackathons",
        "Tailored for Indian university students, college developers, and indie hackers",
        sections.student
      )}

      {/* 9. Hackathons Near You */}
      {renderSectionRow(
        "📍 Hackathons Near You",
        "Live venue hackathons in Bengaluru, Mumbai, Delhi NCR, Hyderabad, Chennai, Pune, Kolkata & Kochi",
        sections.nearYou
      )}
    </div>
  );
}
