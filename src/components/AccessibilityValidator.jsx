import React, { useState, useEffect } from 'react';

/**
 * AccessibilityValidator Component
 * Validates color contrast and accessibility compliance for role-based themes
 */
export default function AccessibilityValidator({ isVisible, onClose }) {
  const [contrastResults, setContrastResults] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // WCAG AA compliance requires 4.5:1 for normal text, 3:1 for large text
  const WCAG_AA_NORMAL = 4.5;
  const WCAG_AA_LARGE = 3.0;

  // Calculate relative luminance
  const getLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      const sRGB = c / 255;
      return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Calculate contrast ratio
  const getContrastRatio = (color1, color2) => {
    const l1 = getLuminance(...color1);
    const l2 = getLuminance(...color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  };

  // Analyze accessibility compliance
  const analyzeAccessibility = () => {
    setIsAnalyzing(true);
    
    // Define role-based color schemes
    const roleThemes = {
      athlete: {
        name: 'Athlete (Vibrant)',
        background: [255, 111, 97], // #ff6f61 coral
        text: [255, 255, 255], // white
        accent: [107, 72, 255], // #6b48ff purple
      },
      sponsor: {
        name: 'Sponsor (Professional)',
        background: [44, 62, 80], // #2c3e50 slate
        text: [255, 255, 255], // white
        accent: [52, 152, 219], // #3498db blue
      },
      fan: {
        name: 'Fan (Community)',
        background: [255, 154, 158], // #ff9a9e pink
        text: [51, 51, 51], // dark gray
        accent: [250, 208, 196], // #fad0c4 peach
      },
      default: {
        name: 'Default (Unauthenticated)',
        background: [248, 249, 250], // light gray
        text: [33, 37, 41], // dark
        accent: [0, 123, 255], // blue
      }
    };

    const results = [];

    Object.entries(roleThemes).forEach(([role, theme]) => {
      // Test text on background
      const textContrast = getContrastRatio(theme.text, theme.background);
      const textAccessible = textContrast >= WCAG_AA_NORMAL;
      
      // Test accent on background
      const accentContrast = getContrastRatio(theme.accent, theme.background);
      const accentAccessible = accentContrast >= WCAG_AA_NORMAL;

      // Test accent on text (for buttons/links)
      const accentTextContrast = getContrastRatio(theme.accent, theme.text);
      const accentTextAccessible = accentTextContrast >= WCAG_AA_NORMAL;

      results.push({
        role,
        theme: theme.name,
        tests: [
          {
            name: 'Body text on background',
            ratio: textContrast.toFixed(2),
            accessible: textAccessible,
            standard: 'WCAG AA (4.5:1)',
            colors: `rgb(${theme.text.join(',')}) on rgb(${theme.background.join(',')})`
          },
          {
            name: 'Accent color on background',
            ratio: accentContrast.toFixed(2),
            accessible: accentAccessible,
            standard: 'WCAG AA (4.5:1)',
            colors: `rgb(${theme.accent.join(',')}) on rgb(${theme.background.join(',')})`
          },
          {
            name: 'Accent elements visibility',
            ratio: accentTextContrast.toFixed(2),
            accessible: accentTextContrast >= WCAG_AA_LARGE, // More lenient for accent elements
            standard: 'WCAG AA Large (3:1)',
            colors: `rgb(${theme.accent.join(',')}) with rgb(${theme.text.join(',')})`
          }
        ]
      });
    });

    setContrastResults(results);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (isVisible) {
      analyzeAccessibility();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #eee',
          paddingBottom: '15px'
        }}>
          <h2 style={{ margin: 0, color: '#333' }}>♿ Accessibility Compliance Report</h2>
          <button 
            onClick={onClose}
            style={{
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>

        {isAnalyzing ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>Analyzing color contrast ratios...</p>
          </div>
        ) : (
          <div>
            {contrastResults.map((result, index) => (
              <div key={index} style={{
                marginBottom: '25px',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: '#f8f9fa'
              }}>
                <h3 style={{ 
                  margin: '0 0 15px 0', 
                  color: '#333',
                  textTransform: 'capitalize'
                }}>
                  {result.theme}
                </h3>
                
                {result.tests.map((test, testIndex) => (
                  <div key={testIndex} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px',
                    margin: '5px 0',
                    background: 'white',
                    borderRadius: '6px',
                    border: `2px solid ${test.accessible ? '#27ae60' : '#e74c3c'}`
                  }}>
                    <div>
                      <strong>{test.name}</strong>
                      <br />
                      <small style={{ color: '#666' }}>{test.colors}</small>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        background: test.accessible ? '#27ae60' : '#e74c3c',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        marginRight: '10px'
                      }}>
                        {test.accessible ? '✓ PASS' : '✗ FAIL'}
                      </span>
                      <br />
                      <small>
                        {test.ratio}:1 (needs {test.standard})
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#e8f4f8',
              borderRadius: '8px',
              border: '1px solid #bee5eb'
            }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>
                📋 Accessibility Standards
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#0c5460' }}>
                <li><strong>WCAG AA Normal Text:</strong> 4.5:1 contrast ratio minimum</li>
                <li><strong>WCAG AA Large Text:</strong> 3:1 contrast ratio minimum</li>
                <li><strong>Best Practice:</strong> Higher contrast improves readability for all users</li>
                <li><strong>Testing:</strong> Use browser dev tools or screen readers for validation</li>
              </ul>
            </div>

            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button
                onClick={analyzeAccessibility}
                style={{
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  marginRight: '10px'
                }}
              >
                Re-analyze
              </button>
              <small style={{ color: '#666', fontStyle: 'italic' }}>
                Last updated: {new Date().toLocaleTimeString()}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}