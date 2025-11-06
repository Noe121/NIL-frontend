import { useContext, useMemo } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { getSchoolColor, getSchoolName, DEFAULT_LOGO_COLOR } from '../config/schoolColors';

/**
 * Custom hook to get school colors for the current user
 * Returns the school color for the dynamic logo superscript 'x'
 *
 * @returns {Object} Object containing school color information
 */
export function useSchoolColors() {
  const { user } = useContext(AuthContext);

  const schoolInfo = useMemo(() => {
    // If no user or no university/school affiliation, return default
    if (!user || !user.university) {
      return {
        schoolKey: null,
        primaryColor: DEFAULT_LOGO_COLOR.primary,
        secondaryColor: DEFAULT_LOGO_COLOR.secondary,
        schoolName: DEFAULT_LOGO_COLOR.name,
        hasSchool: false
      };
    }

    // Normalize university name to schoolKey format
    // e.g., "University of Alabama" -> "alabama"
    // "Ohio State University" -> "ohio-state"
    const schoolKey = normalizeSchoolName(user.university);

    return {
      schoolKey,
      primaryColor: getSchoolColor(schoolKey, false),
      secondaryColor: getSchoolColor(schoolKey, true),
      schoolName: getSchoolName(schoolKey),
      hasSchool: true,
      rawUniversity: user.university
    };
  }, [user]);

  return schoolInfo;
}

/**
 * Normalize university name to match schoolColors.js keys
 * @param {string} universityName - Full university name
 * @returns {string} Normalized key
 */
function normalizeSchoolName(universityName) {
  if (!universityName) return null;

  const name = universityName.toLowerCase().trim();

  // Direct mappings for common variations
  const mappings = {
    // SEC
    'university of alabama': 'alabama',
    'alabama': 'alabama',
    'crimson tide': 'alabama',
    'auburn university': 'auburn',
    'auburn': 'auburn',
    'war eagle': 'auburn',
    'university of florida': 'florida',
    'florida': 'florida',
    'gators': 'florida',
    'university of georgia': 'georgia',
    'georgia': 'georgia',
    'bulldogs': 'georgia',
    'uga': 'georgia',
    'university of kentucky': 'kentucky',
    'kentucky': 'kentucky',
    'wildcats': 'kentucky',
    'louisiana state university': 'lsu',
    'lsu': 'lsu',
    'tigers': 'lsu',
    'university of mississippi': 'ole-miss',
    'ole miss': 'ole-miss',
    'rebels': 'ole-miss',
    'mississippi state university': 'mississippi-state',
    'mississippi state': 'mississippi-state',
    'miss state': 'mississippi-state',
    'bulldogs': 'mississippi-state',
    'university of missouri': 'missouri',
    'missouri': 'missouri',
    'mizzou': 'missouri',
    'university of south carolina': 'south-carolina',
    'south carolina': 'south-carolina',
    'gamecocks': 'south-carolina',
    'university of tennessee': 'tennessee',
    'tennessee': 'tennessee',
    'vols': 'tennessee',
    'volunteers': 'tennessee',
    'texas a&m university': 'texas-am',
    'texas a&m': 'texas-am',
    'tamu': 'texas-am',
    'aggies': 'texas-am',
    'vanderbilt university': 'vanderbilt',
    'vanderbilt': 'vanderbilt',
    'commodores': 'vanderbilt',
    'university of arkansas': 'arkansas',
    'arkansas': 'arkansas',
    'razorbacks': 'arkansas',

    // Big Ten
    'ohio state university': 'ohio-state',
    'ohio state': 'ohio-state',
    'osu': 'ohio-state',
    'buckeyes': 'ohio-state',
    'university of michigan': 'michigan',
    'michigan': 'michigan',
    'wolverines': 'michigan',
    'penn state university': 'penn-state',
    'penn state': 'penn-state',
    'psu': 'penn-state',
    'nittany lions': 'penn-state',
    'university of wisconsin': 'wisconsin',
    'wisconsin': 'wisconsin',
    'badgers': 'wisconsin',
    'university of iowa': 'iowa',
    'iowa': 'iowa',
    'hawkeyes': 'iowa',
    'university of nebraska': 'nebraska',
    'nebraska': 'nebraska',
    'cornhuskers': 'nebraska',
    'huskers': 'nebraska',
    'michigan state university': 'michigan-state',
    'michigan state': 'michigan-state',
    'msu': 'michigan-state',
    'spartans': 'michigan-state',
    'northwestern university': 'northwestern',
    'northwestern': 'northwestern',
    'purdue university': 'purdue',
    'purdue': 'purdue',
    'boilermakers': 'purdue',
    'indiana university': 'indiana',
    'indiana': 'indiana',
    'hoosiers': 'indiana',
    'university of minnesota': 'minnesota',
    'minnesota': 'minnesota',
    'golden gophers': 'minnesota',
    'university of maryland': 'maryland',
    'maryland': 'maryland',
    'terrapins': 'maryland',
    'terps': 'maryland',
    'rutgers university': 'rutgers',
    'rutgers': 'rutgers',
    'scarlet knights': 'rutgers',
    'university of illinois': 'illinois',
    'illinois': 'illinois',
    'fighting illini': 'illinois',

    // Big 12
    'university of texas': 'texas',
    'texas': 'texas',
    'ut': 'texas',
    'longhorns': 'texas',
    'university of oklahoma': 'oklahoma',
    'oklahoma': 'oklahoma',
    'ou': 'oklahoma',
    'sooners': 'oklahoma',
    'oklahoma state university': 'oklahoma-state',
    'oklahoma state': 'oklahoma-state',
    'ok state': 'oklahoma-state',
    'cowboys': 'oklahoma-state',
    'university of kansas': 'kansas',
    'kansas': 'kansas',
    'ku': 'kansas',
    'jayhawks': 'kansas',
    'kansas state university': 'kansas-state',
    'kansas state': 'kansas-state',
    'k-state': 'kansas-state',
    'texas tech university': 'texas-tech',
    'texas tech': 'texas-tech',
    'red raiders': 'texas-tech',
    'baylor university': 'baylor',
    'baylor': 'baylor',
    'bears': 'baylor',
    'texas christian university': 'tcu',
    'tcu': 'tcu',
    'horned frogs': 'tcu',
    'iowa state university': 'iowa-state',
    'iowa state': 'iowa-state',
    'cyclones': 'iowa-state',
    'west virginia university': 'west-virginia',
    'west virginia': 'west-virginia',
    'wvu': 'west-virginia',
    'mountaineers': 'west-virginia',

    // ACC
    'clemson university': 'clemson',
    'clemson': 'clemson',
    'florida state university': 'florida-state',
    'florida state': 'florida-state',
    'fsu': 'florida-state',
    'seminoles': 'florida-state',
    'university of miami': 'miami',
    'miami': 'miami',
    'hurricanes': 'miami',
    'the u': 'miami',
    'university of north carolina': 'north-carolina',
    'north carolina': 'north-carolina',
    'unc': 'north-carolina',
    'tar heels': 'north-carolina',
    'duke university': 'duke',
    'duke': 'duke',
    'blue devils': 'duke',
    'north carolina state university': 'nc-state',
    'nc state': 'nc-state',
    'ncsu': 'nc-state',
    'wolfpack': 'nc-state',
    'university of virginia': 'virginia',
    'virginia': 'virginia',
    'uva': 'virginia',
    'cavaliers': 'virginia',
    'virginia tech': 'virginia-tech',
    'vt': 'virginia-tech',
    'hokies': 'virginia-tech',
    'georgia institute of technology': 'georgia-tech',
    'georgia tech': 'georgia-tech',
    'gt': 'georgia-tech',
    'yellow jackets': 'georgia-tech',
    'university of notre dame': 'notre-dame',
    'notre dame': 'notre-dame',
    'nd': 'notre-dame',
    'fighting irish': 'notre-dame',
    'university of louisville': 'louisville',
    'louisville': 'louisville',
    'cardinals': 'louisville',
    'university of pittsburgh': 'pittsburgh',
    'pittsburgh': 'pittsburgh',
    'pitt': 'pittsburgh',
    'panthers': 'pittsburgh',
    'syracuse university': 'syracuse',
    'syracuse': 'syracuse',
    'orange': 'syracuse',
    'boston college': 'boston-college',
    'bc': 'boston-college',
    'eagles': 'boston-college',

    // Pac-12
    'university of southern california': 'usc',
    'southern california': 'usc',
    'usc': 'usc',
    'trojans': 'usc',
    'university of california, los angeles': 'ucla',
    'ucla': 'ucla',
    'bruins': 'ucla',
    'university of oregon': 'oregon',
    'oregon': 'oregon',
    'ducks': 'oregon',
    'university of washington': 'washington',
    'washington': 'washington',
    'uw': 'washington',
    'huskies': 'washington',
    'stanford university': 'stanford',
    'stanford': 'stanford',
    'cardinal': 'stanford',
    'university of colorado': 'colorado',
    'colorado': 'colorado',
    'cu': 'colorado',
    'buffaloes': 'colorado',
    'buffs': 'colorado',
    'university of utah': 'utah',
    'utah': 'utah',
    'utes': 'utah',
    'university of arizona': 'arizona',
    'arizona': 'arizona',
    'wildcats': 'arizona',
    'arizona state university': 'arizona-state',
    'arizona state': 'arizona-state',
    'asu': 'arizona-state',
    'sun devils': 'arizona-state',
    'university of california, berkeley': 'cal',
    'uc berkeley': 'cal',
    'cal': 'cal',
    'golden bears': 'cal',
    'washington state university': 'washington-state',
    'washington state': 'washington-state',
    'wsu': 'washington-state',
    'cougars': 'washington-state',
    'oregon state university': 'oregon-state',
    'oregon state': 'oregon-state',
    'beavers': 'oregon-state',

    // Other major schools
    'brigham young university': 'byu',
    'byu': 'byu',
    'cougars': 'byu',
    'university of cincinnati': 'cincinnati',
    'cincinnati': 'cincinnati',
    'bearcats': 'cincinnati',
    'university of central florida': 'ucf',
    'ucf': 'ucf',
    'knights': 'ucf',
    'university of houston': 'houston',
    'houston': 'houston',
    'uh': 'houston',
    'cougars': 'houston',

    // HBCU
    'howard university': 'howard',
    'howard': 'howard',
    'bison': 'howard',
    'morehouse college': 'morehouse',
    'morehouse': 'morehouse',
    'maroon tigers': 'morehouse',
    'spelman college': 'spelman',
    'spelman': 'spelman',
    'jaguars': 'spelman',
    'florida a&m university': 'famu',
    'famu': 'famu',
    'rattlers': 'famu',
    'jackson state university': 'jackson-state',
    'jackson state': 'jackson-state',
    'grambling state university': 'grambling',
    'grambling': 'grambling',
    'southern university': 'southern',
    'southern': 'southern',
    'jaguars': 'southern',
    'prairie view a&m university': 'prairie-view',
    'prairie view': 'prairie-view',
    'panthers': 'prairie-view',
    'north carolina a&t state university': 'north-carolina-at',
    'nc a&t': 'north-carolina-at',
    'hampton university': 'hampton',
    'hampton': 'hampton',
    'pirates': 'hampton'
  };

  // Check direct mapping first
  if (mappings[name]) {
    return mappings[name];
  }

  // Fallback: convert to kebab-case and remove common words
  return name
    .replace(/university of |state university|university|\bcollege\b/gi, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

