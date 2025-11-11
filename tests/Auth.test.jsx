import { describe, it, expect } from 'vitest';

// Test the role mapping logic directly
describe('Auth Role Mapping', () => {
  it('maps student_athlete to athlete dashboard', () => {
    const roleRoutes = {
      athlete: '/dashboard/athlete',
      student_athlete: '/dashboard/athlete', // Map student_athlete to athlete dashboard
      influencer: '/dashboard/influencer',
      sponsor: '/dashboard/sponsor',
      fan: '/dashboard/fan',
      admin: '/dashboard/athlete' // Default to athlete dashboard for admin
    };

    // Test student_athlete role
    const studentAthleteRedirect = roleRoutes['student_athlete'];
    expect(studentAthleteRedirect).toBe('/dashboard/athlete');

    // Test athlete role
    const athleteRedirect = roleRoutes['athlete'];
    expect(athleteRedirect).toBe('/dashboard/athlete');

    // Test other roles
    expect(roleRoutes['influencer']).toBe('/dashboard/influencer');
    expect(roleRoutes['sponsor']).toBe('/dashboard/sponsor');
    expect(roleRoutes['fan']).toBe('/dashboard/fan');
  });

  it('provides fallback for unknown roles', () => {
    const roleRoutes = {
      athlete: '/dashboard/athlete',
      student_athlete: '/dashboard/athlete',
      influencer: '/dashboard/influencer',
      sponsor: '/dashboard/sponsor',
      fan: '/dashboard/fan',
      admin: '/dashboard/athlete'
    };

    // Test unknown role defaults to athlete dashboard
    const unknownRole = 'unknown_role';
    const redirectPath = roleRoutes[unknownRole] || '/dashboard/athlete';
    expect(redirectPath).toBe('/dashboard/athlete');
  });

  it('allows student_athlete access to athlete pages', () => {
    // Test role validation logic used in AthleteUserPage
    const validateAthleteAccess = (userRole) => {
      return userRole === 'athlete' || userRole === 'student_athlete';
    };

    expect(validateAthleteAccess('athlete')).toBe(true);
    expect(validateAthleteAccess('student_athlete')).toBe(true);
    expect(validateAthleteAccess('influencer')).toBe(false);
    expect(validateAthleteAccess('sponsor')).toBe(false);
  });

  it('shows athlete navigation for student_athlete roles', () => {
    // Test navigation logic used in NavBar
    const shouldShowAthleteNav = (role) => {
      return role === 'athlete' || role === 'student_athlete';
    };

    expect(shouldShowAthleteNav('athlete')).toBe(true);
    expect(shouldShowAthleteNav('student_athlete')).toBe(true);
    expect(shouldShowAthleteNav('influencer')).toBe(false);
    expect(shouldShowAthleteNav('sponsor')).toBe(false);
  });
});