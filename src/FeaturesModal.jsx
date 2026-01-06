import React from 'react';
import { ChevronDown, Grid3x3, MapPin, Clock } from 'lucide-react';

const FeaturesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      id: 'scenario',
      title: 'Scenario Simulator',
      icon: Grid3x3,
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      description: 'Simulate different scenarios'
    },
    {
      id: 'virtual-tour',
      title: 'Virtual Tour',
      icon: MapPin,
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      description: 'Take a virtual tour'
    },
    {
      id: 'life-in-day',
      title: 'Life in a Day',
      icon: Clock,
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      description: 'Experience daily life'
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={onClose}
      />

      {/* Close Button - Outside Modal at Very Top */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed',
          top: '32px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          background: '#10b981',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 1001
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(16, 185, 129, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
        }}
      >
        <ChevronDown size={28} color="white" strokeWidth={3} />
      </button>

      {/* Modal - Very Tall */}
      <div style={{
        position: 'fixed',
        top: '120px',
        left: 0,
        right: 0,
        bottom: 0,
        background: 'white',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        zIndex: 1000,
        padding: '3rem 2rem',
        paddingBottom: '3rem',
        animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)',
        overflowY: 'auto'
      }}>
        {/* Content */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          padding: '2rem 1rem',
          minHeight: '100%'
        }}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <button
                key={feature.id}
                style={{
                  width: '1800px',
                  height: '2000px',
                  border: 'none',
                  borderRadius: '16px',
                  background: feature.gradient,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }}
                onClick={() => {
                  console.log(`Clicked: ${feature.title}`);
                  // Add your navigation logic here
                }}
              >
                {/* Background Pattern */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1
                }}>
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id={`pattern-${feature.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="15" fill="white" opacity="0.3"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill={`url(#pattern-${feature.id})`}/>
                  </svg>
                </div>

                {/* Icon Container */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  zIndex: 1
                }}>
                  <Icon size={40} color="white" strokeWidth={2} />
                </div>

                {/* Title */}
                <span style={{
                  color: 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textAlign: 'center',
                  zIndex: 1,
                  lineHeight: '1.3'
                }}>
                  {feature.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .features-container {
            gap: 1.5rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default FeaturesModal;