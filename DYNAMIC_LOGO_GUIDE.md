# NILBˣ Dynamic Logo System

## Overview

The NILBˣ platform features a dynamic logo system where the superscript "x" changes color based on the user's school affiliation, creating a personalized experience that connects with their school pride.

### Trademark Specification

**Mark:** N I L Bˣ

**Description:**
- **"NILB"**: Bold, uppercase, sans-serif typeface with increased letter spacing
- **"x"**: Superscript lowercase, 70% scale, positioned at cap height
- **Letter spacing**: +50 units
- **No space** between "B" and "ˣ"

**Default Colors:**
- **"NILB"**: Pantone Black 6 C (#0A0A0A) or Blue (#3B82F6)
- **"x"**: Pantone 299 C (#00D1FF) - changes based on school

---

## Features

### 🎨 Dynamic School Colors
- Automatically detects user's university affiliation
- Changes superscript "x" color to match school colors
- Supports 70+ major universities across all Power 5 conferences
- Includes HBCU support

### 🏫 Supported Conferences
- **SEC** (14 schools)
- **Big Ten** (14 schools)
- **Big 12** (10 schools)
- **ACC** (14 schools)
- **Pac-12** (12 schools)
- **HBCU** (10+ schools)

---

## Implementation

### 1. Core Files

#### Configuration
```
/frontend/src/config/schoolColors.js
```
Contains color mappings for all supported universities.

#### Components
```
/frontend/src/components/DynamicLogo.jsx
```
Main logo component with multiple variants.

#### Hooks
```
/frontend/src/hooks/useSchoolColors.js
```
Custom hook to access user's school colors.

### 2. Component Variants

#### `DynamicLogo` (Default)
Full logo with icon and text.

```jsx
import DynamicLogo from './components/DynamicLogo';
import { useSchoolColors } from './hooks/useSchoolColors';

function MyComponent() {
  const { schoolKey } = useSchoolColors();

  return (
    <DynamicLogo
      schoolKey={schoolKey}
      size="md"
      variant="full"
    />
  );
}
```

**Props:**
- `schoolKey` (string): School identifier (e.g., 'alabama', 'ohio-state')
- `size` (string): 'xs', 'sm', 'md', 'lg', 'xl', 'hero' (default: 'md')
- `variant` (string): 'full', 'icon', 'text' (default: 'full')
- `showBox` (boolean): Show/hide the NIL box (default: true)
- `useSecondaryColor` (boolean): Use secondary school color (default: false)
- `className` (string): Additional CSS classes

#### `GradientLogo`
Gradient text variant for hero sections.

```jsx
import { GradientLogo } from './components/DynamicLogo';

<GradientLogo
  schoolKey={schoolKey}
  size="hero"
  className="mb-6"
/>
```

**Props:**
- `schoolKey` (string): School identifier
- `size` (string): 'lg', 'xl', 'hero' (default: 'hero')
- `useSecondaryColor` (boolean): Use secondary school color
- `className` (string): Additional CSS classes

#### `GlassLogo`
Glassmorphism variant for hero sections.

```jsx
import { GlassLogo } from './components/DynamicLogo';

<GlassLogo
  schoolKey={schoolKey}
  className="mb-8"
/>
```

**Props:**
- `schoolKey` (string): School identifier
- `useSecondaryColor` (boolean): Use secondary school color
- `className` (string): Additional CSS classes

#### `TextLogo`
Compact text-only variant.

```jsx
import { TextLogo } from './components/DynamicLogo';

<TextLogo
  schoolKey={schoolKey}
  size="md"
  lightMode={false}
/>
```

**Props:**
- `schoolKey` (string): School identifier
- `size` (string): 'sm', 'md', 'lg' (default: 'md')
- `lightMode` (boolean): Use light color scheme (default: false)
- `useSecondaryColor` (boolean): Use secondary school color
- `className` (string): Additional CSS classes

### 3. Using the Hook

The `useSchoolColors` hook provides access to the current user's school information:

```jsx
import { useSchoolColors } from './hooks/useSchoolColors';

function MyComponent() {
  const {
    schoolKey,        // 'alabama', 'ohio-state', etc.
    primaryColor,     // '#9E1B32'
    secondaryColor,   // '#FFFFFF'
    schoolName,       // 'University of Alabama'
    hasSchool,        // true/false
    rawUniversity     // Original university string from user
  } = useSchoolColors();

  return (
    <div style={{ color: primaryColor }}>
      {schoolName}
    </div>
  );
}
```

---

## School Color Configuration

### Adding New Schools

To add a new school, edit [`/frontend/src/config/schoolColors.js`](/frontend/src/config/schoolColors.js):

```javascript
export const SCHOOL_COLORS = {
  // ... existing schools
  'new-school': {
    primary: '#FF0000',
    secondary: '#000000',
    name: 'New School University'
  }
};
```

### School Key Format

School keys use kebab-case format:
- Single word: `'alabama'`, `'clemson'`
- Multiple words: `'ohio-state'`, `'texas-am'`, `'north-carolina'`

### Name Normalization

The `useSchoolColors` hook automatically normalizes university names:

**Examples:**
- "University of Alabama" → `'alabama'`
- "Ohio State University" → `'ohio-state'`
- "Texas A&M" → `'texas-am'`
- "UNC" → `'north-carolina'`

Common variations (team names, abbreviations) are also supported:
- "Crimson Tide" → `'alabama'`
- "Buckeyes" → `'ohio-state'`
- "Aggies" → `'texas-am'`

---

## Usage Examples

### Navigation Bar

```jsx
// NavigationBar.jsx
import DynamicLogo from './DynamicLogo';
import { useSchoolColors } from '../hooks/useSchoolColors';

function NavigationBar() {
  const { schoolKey } = useSchoolColors();

  return (
    <nav>
      <Link to="/">
        <DynamicLogo schoolKey={schoolKey} size="md" variant="full" />
      </Link>
    </nav>
  );
}
```

### Hero Section

```jsx
// Hero.jsx
import { GlassLogo, GradientLogo } from './DynamicLogo';
import { useSchoolColors } from '../hooks/useSchoolColors';

function Hero() {
  const { schoolKey } = useSchoolColors();

  return (
    <section>
      <GlassLogo schoolKey={schoolKey} className="mb-8" />
      <GradientLogo schoolKey={schoolKey} size="hero" />
    </section>
  );
}
```

### Footer

```jsx
// Footer.jsx
import DynamicLogo from './DynamicLogo';
import { useSchoolColors } from '../hooks/useSchoolColors';

function Footer() {
  const { schoolKey } = useSchoolColors();

  return (
    <footer>
      <DynamicLogo
        schoolKey={schoolKey}
        size="lg"
        variant="full"
      />
    </footer>
  );
}
```

### User Profile Badge

```jsx
// ProfileBadge.jsx
import { TextLogo } from './DynamicLogo';
import { useSchoolColors } from '../hooks/useSchoolColors';

function ProfileBadge() {
  const { schoolKey, schoolName, primaryColor } = useSchoolColors();

  return (
    <div className="profile-badge">
      <TextLogo schoolKey={schoolKey} size="sm" />
      <p style={{ color: primaryColor }}>{schoolName}</p>
    </div>
  );
}
```

---

## API Reference

### `schoolColors.js` Exports

#### `SCHOOL_COLORS`
Object mapping school keys to color configurations.

#### `DEFAULT_LOGO_COLOR`
Default color object when no school is affiliated.

```javascript
{
  primary: '#00D1FF',
  secondary: '#0EA5E9',
  name: 'NILBx Default'
}
```

#### `getSchoolColor(schoolKey, useSecondary = false)`
Get school color hex code.

**Parameters:**
- `schoolKey` (string): School identifier
- `useSecondary` (boolean): Return secondary color instead of primary

**Returns:** (string) Hex color code

#### `getSchoolName(schoolKey)`
Get full school name from key.

**Parameters:**
- `schoolKey` (string): School identifier

**Returns:** (string) Full school name

#### `getAllSchools()`
Get array of all available schools.

**Returns:** (Array) School objects with key, name, and colors

```javascript
[
  {
    key: 'alabama',
    name: 'University of Alabama',
    primaryColor: '#9E1B32',
    secondaryColor: '#FFFFFF'
  },
  // ...
]
```

#### `searchSchools(query)`
Search schools by name or key.

**Parameters:**
- `query` (string): Search query

**Returns:** (Array) Matching school objects

---

## Testing

### Manual Testing

1. **Create test users with different universities:**
   ```javascript
   // During registration
   formData.university = 'University of Alabama';
   ```

2. **Check logo color changes:**
   - Alabama → Crimson Red (#9E1B32)
   - Ohio State → Scarlet (#BB0000)
   - Michigan → Navy Blue (#00274C)
   - LSU → Purple (#461D7C)

3. **Test fallback behavior:**
   - No university set → Default cyan (#00D1FF)
   - Unknown university → Default cyan (#00D1FF)

### Automated Testing

```javascript
// schoolColors.test.js
import { getSchoolColor, normalizeSchoolName } from './schoolColors';

test('returns correct color for Alabama', () => {
  expect(getSchoolColor('alabama')).toBe('#9E1B32');
});

test('normalizes university names', () => {
  expect(normalizeSchoolName('University of Alabama')).toBe('alabama');
  expect(normalizeSchoolName('Ohio State University')).toBe('ohio-state');
});

test('returns default for unknown school', () => {
  expect(getSchoolColor('unknown-school')).toBe('#00D1FF');
});
```

---

## Best Practices

### 1. Always Use the Hook
```jsx
// ✅ Good
const { schoolKey } = useSchoolColors();
<DynamicLogo schoolKey={schoolKey} />

// ❌ Bad - hardcoding
<DynamicLogo schoolKey="alabama" />
```

### 2. Handle Non-Authenticated Users
```jsx
function MyComponent() {
  const { schoolKey, hasSchool } = useSchoolColors();

  return (
    <div>
      <DynamicLogo schoolKey={schoolKey} />
      {!hasSchool && (
        <p>Set your school to see your colors!</p>
      )}
    </div>
  );
}
```

### 3. Size Selection
- **Navigation**: Use `size="md"`
- **Hero sections**: Use `size="hero"`
- **Footer**: Use `size="lg"`
- **Buttons/Badges**: Use `size="sm"` or `size="xs"`

### 4. Variant Selection
- **Full branding**: Use `variant="full"`
- **Compact spaces**: Use `variant="text"`
- **Icon only**: Use `variant="icon"`
- **Hero sections**: Use `GradientLogo` or `GlassLogo`

### 5. Performance
The hook uses `useMemo` to prevent unnecessary recalculations. School colors are only computed when user data changes.

---

## Troubleshooting

### Logo not showing school colors

**Problem:** Logo displays default cyan color instead of school color.

**Solutions:**
1. Check that user has `university` field set
2. Verify university name is in `SCHOOL_COLORS` mapping
3. Add university name variation to `normalizeSchoolName()` function

### Colors don't match school brand

**Problem:** Colors are incorrect for a specific school.

**Solutions:**
1. Verify hex codes in `schoolColors.js`
2. Check official school brand guidelines
3. Update `primary` and `secondary` colors in configuration

### Hook returns null

**Problem:** `useSchoolColors()` returns null values.

**Solutions:**
1. Ensure component is wrapped in `<AuthProvider>`
2. Check that `AuthContext` includes user data
3. Verify user object has `university` field

---

## Roadmap

### Future Enhancements

1. **Admin Panel**
   - Allow admins to manage school colors via UI
   - Upload school logos/mascots
   - Configure additional brand assets

2. **User Preferences**
   - Allow users to choose primary or secondary color
   - Custom color override option
   - Accessibility contrast adjustments

3. **Extended Branding**
   - Apply school colors to other UI elements
   - School-themed backgrounds
   - Animated school mascots

4. **Analytics**
   - Track which schools have the most users
   - A/B test color effectiveness
   - Engagement metrics by school

---

## Support

For questions or issues with the dynamic logo system:

1. Check this documentation
2. Review code examples in component files
3. Test with known working schools (Alabama, Ohio State, etc.)
4. Contact the development team

---

## Changelog

### v1.0.0 (2024)
- Initial implementation
- 70+ universities supported
- 5 logo variants
- School color normalization
- Documentation created
