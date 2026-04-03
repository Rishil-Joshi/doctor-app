# Page Structure Guide

## Directory Organization

```
frontend/app/
├── page.tsx                 # Root (/) - Redirects to login or dashboard
├── login/
│   └── page.tsx            # Login page (/login)
├── register/
│   └── page.tsx            # Registration page (/register)
└── dashboard/
    └── page.tsx            # Dashboard page (/dashboard)

frontend/components/
├── FormField.tsx           # Reusable form input component
└── AuthHeader.tsx          # Reusable auth header component
```

## Page Descriptions

### `/` (Root / Home Page)
**Location**: `app/page.tsx`

**Purpose**: Entry point that redirects based on authentication status

**Behavior**:
- If authenticated → redirects to `/dashboard`
- If not authenticated → redirects to `/login`
- Shows loading screen while checking auth status

**Key Features**:
- Uses `useAuth()` hook to check authentication
- Handles redirect logic via `next/navigation`
- Shows SURGIFLOW branding during load

---

### `/login` (Login Page)
**Location**: `app/login/page.tsx`

**Purpose**: User authentication page

**Form Fields**:
- Username (text input)
- Password (password input)

**Validations**:
- Username is required
- Password must meet strength requirements (8+ chars, 1 uppercase, 1 number)

**Features**:
- Sign in existing doctors
- Link to register page for new users
- Displays validation errors
- Shows loading state during submission
- Redirects to dashboard on successful login
- Displays API errors (invalid credentials)

**Components Used**:
- `AuthHeader` - Branding and navigation
- `FormField` - Input fields

---

### `/register` (Registration Page)
**Location**: `app/register/page.tsx`

**Purpose**: New user account creation

**Form Fields**:
- First Name * (required)
- Last Name * (required)
- Username * (required)
- Email * (required)
- Phone Number * (required, format validation)
- Password * (required, strength validation)
- Confirm Password * (required, match validation)
- Specialization (optional)
- Clinic Name (optional)

**Validations**:
- All required fields checked
- Email format validation
- Password strength (8+ chars, uppercase, number)
- Passwords must match
- Phone number format validation

**Features**:
- Create new doctor account
- Optional professional information
- Full form validation
- Link to login page
- Scrollable form on mobile (auto height)
- Displays server validation errors

**Components Used**:
- `AuthHeader` - Branding and navigation
- `FormField` - Input fields

---

### `/dashboard` (Dashboard Page)
**Location**: `app/dashboard/page.tsx`

**Purpose**: Main application interface for doctors to manage patients

**Sections**:

#### Header
- App branding (SURGIFLOW)
- Logout button
- Redirects to login on logout

#### Profile Card
Displays logged-in doctor information:
- Full name (first + last)
- Username
- Email
- Phone
- Specialization
- Clinic name

#### Patient Statistics
- Total patient count
- Updates when patients are added/deleted

#### Add Patient Form
- Patient Name (required, text input)
- Details (required, textarea)
- Add button
- Error messages for validation

#### Patients List
- Displays all patients for the logged-in doctor
- Each patient card shows:
  - Patient name
  - Medical details/notes
  - Patient ID
  - Delete button
- Empty state message if no patients
- Loading state while fetching

**Features**:
- Auto-fetches patients on page load
- Add new patients with validation
- Delete patients with confirmation simulation
- Responsive grid layout
- Protected route (redirects to login if not authenticated)
- Real-time patient count
- Professional UI with Cards and sections

**Hooks Used**:
- `useAuth()` - Get user and auth status
- `useState` - Manage patient list and form state
- `useCallback` - Efficient patient fetching
- `useRouter` - Navigation control

---

## Component Library

### FormField Component
**File**: `components/FormField.tsx`

**Props**:
```typescript
interface FormFieldProps {
  label: string;
  type?: string;          // 'text' | 'email' | 'password' | 'tel' (default: 'text')
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;         // Shows error message if provided
  helperText?: string;    // Shows helper text below input
}
```

**Usage**:
```jsx
<FormField
  label="Email *"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter your email"
  error={validationErrors.email}
  helperText="We'll never share your email"
/>
```

**Features**:
- Shows label above input
- Displays error message in red if provided
- Shows helper text below input
- Red border when error exists
- Focus ring styling with teal color
- Responsive to mobile

---

### AuthHeader Component
**File**: `components/AuthHeader.tsx`

**Props**:
```typescript
interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  switchText: string;
  switchLink: string;
  switchLinkText: string;
}
```

**Usage**:
```jsx
<AuthHeader
  title="Welcome Back"
  subtitle="Sign in to your account"
  switchText="Don't have an account?"
  switchLink="/register"
  switchLinkText="Register here"
/>
```

**Features**:
- SURGIFLOW branding and logo
- Custom title
- Optional subtitle
- Link to switch between login/register
- Consistent styling across auth pages

---

## User Flow Diagrams

### First Time User
```
/ (redirect) → /register (create account)
  ↓
  [Enter all required info]
  ↓
  [Validation passes]
  ↓
  [Account created, JWT token received]
  ↓
  /dashboard (show user profile & empty patient list)
```

### Returning User
```
/ (redirect) → /login (if not authenticated)
  ↓
  [Enter username & password]
  ↓
  [Validation passes]
  ↓
  [Authenticated, JWT token stored]
  ↓
  /dashboard (show user profile & patient list)
```

### Logout
```
/dashboard
  ↓
  [Click Logout button]
  ↓
  [Token cleared from storage]
  ↓
  [Redirect to /login]
```

---

## Styling Approach

### Color Scheme
- **Primary**: Teal (#14b8a6) - Buttons, focus rings, links
- **Error**: Red (#ef4444) - Error messages, error borders
- **Background**: Slate/Gray - Main backgrounds
- **Text**: Slate-900 for headings, Gray-600 for secondary text

### Layout Patterns
- **Auth Pages**: Centered card (max-width: 28rem)
- **Dashboard**: Full width with max container (max-width: 64rem)
- **Forms**: Vertical stacking with consistent spacing
- **Cards**: White background with subtle shadow

### Responsive Design
- Mobile-first approach
- Padding and margins scale with screen size
- Grid layouts use `md:` breakpoints
- Touch-friendly button sizes

---

## State Management

### Authentication State (Global)
**Hook**: `useAuth()` from `hooks/useAuth.ts`

Manages:
- `user` - Current user object
- `token` - JWT authentication token
- `isAuthenticated` - Boolean flag
- `isLoading` - Loading state
- `error` - Error message

Methods:
- `login(username, password)` - For login page
- `register(formData)` - For register page
- `logout()` - For logout on dashboard

### Page-Level State
Each page manages its own state:
- Form inputs (`useState`)
- Validation errors (`useState`)
- Patient list (`useState`)
- Loading states (`useState`)

---

## Key Differences from Monolithic Page

| Aspect | Before | After |
|--------|--------|-------|
| **Organization** | One 400-line page | Separate pages per feature |
| **Components** | Inline FormField | Reusable FormField component |
| **Routes** | Complex conditional rendering | Simple Next.js routing |
| **Navigation** | Manual state toggling | next/navigation routing |
| **Maintenance** | Hard to modify | Easy to modify individual pages |
| **Scalability** | Limited | Easily add new pages |
| **Code reuse** | Minimal | Components shared across pages |

---

## Security Considerations

### Authentication Flow
1. User logs in → JWT token received
2. Token stored in localStorage via `lib/storage.ts`
3. Token included in all API requests via `Authorization` header
4. Dashboard checks authentication on mount
5. If unauthorized → redirect to login

### Protected Routes
Dashboard page checks `auth.isAuthenticated`:
```typescript
if (!auth.isLoading && !auth.isAuthenticated) {
  router.push('/login');
}
```

### Form Validation
Both client-side and server-side:
- Client: Immediate feedback with FormField errors
- Server: Backend validates all inputs again

---

## Testing Strategies

### Login Page
- ✅ Test with correct credentials
- ✅ Test with wrong credentials
- ✅ Test validation errors
- ✅ Test redirect after login

### Register Page
- ✅ Test with all valid data
- ✅ Test missing required fields
- ✅ Test password mismatch
- ✅ Test invalid email
- ✅ Test invalid phone format
- ✅ Test duplicate username/email

### Dashboard Page
- ✅ Test loads patients on mount
- ✅ Test add patient form
- ✅ Test delete patient
- ✅ Test logout button
- ✅ Test redirect when not authenticated

---

## Future Enhancements

1. **Patient Details Page** - Individual page for each patient
2. **Edit Patient** - Update existing patient information
3. **Patient History** - Timeline of patient visits/records
4. **Search/Filter** - Find patients by name or criteria
5. **Pagination** - Handle large patient lists
6. **Export** - Download patient data as PDF
7. **Notifications** - Toast alerts for actions
8. **Settings Page** - Doctor profile editing

---

## Folder Structure Best Practice

Keep pages organized by feature:
```
app/
├── (auth)/           # Optional: show login/register in simple layout
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── (dashboard)/      # Optional: show dashboard in app layout
│   ├── dashboard/
│   ├── patients/
│   └── layout.tsx
└── page.tsx
```

This can be done using [Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups) if needed in the future.
