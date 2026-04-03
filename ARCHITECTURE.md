# SURGIFLOW Modular Architecture Documentation

## Overview
This document describes the systematic modular architecture implemented for the SURGIFLOW doctor patient management application. The codebase is organized with clear separation of concerns across both frontend and backend.

## Frontend Architecture

### Directory Structure
```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with PWA config
│   ├── page.tsx            # Main authentication & dashboard component
│   └── globals.css         # Global styles
├── lib/
│   ├── constants.ts        # Centralized configuration & messages
│   ├── types.ts            # TypeScript type definitions
│   ├── validations.ts      # Pure validation functions
│   ├── storage.ts          # LocalStorage utilities
│   └── api/
│       ├── auth.ts         # Authentication API client
│       └── patients.ts     # Patient management API client
├── hooks/
│   └── useAuth.ts          # Custom React hook for auth state
├── public/
│   ├── manifest.json       # PWA manifest
│   └── service-worker.js   # Service worker for offline support
├── .env.local              # Environment variables
└── tsconfig.json           # TypeScript configuration
```

### Module Responsibilities

#### `lib/constants.ts`
**Purpose**: Single source of truth for all application constants
- API endpoint URL
- Validation rules and constraints
- Error messages
- Success messages
- LocalStorage keys

**Usage**:
```typescript
import { API_URL, ERROR_MESSAGES, VALIDATION_RULES } from '@/lib/constants';
```

#### `lib/types.ts`
**Purpose**: Centralized TypeScript interfaces and types
- User interface with first_name, last_name, email, phone, etc.
- Patient interface with medical history and details
- API response types (AuthResponse, LoginCredentials)
- Form data types (RegisterFormData)
- Validation error types

**Usage**:
```typescript
import { User, Patient, AuthResponse, ValidationErrors } from '@/lib/types';
```

#### `lib/validations.ts`
**Purpose**: Pure validation functions with no side effects
- Email format validation
- Password strength validation (min 8 chars, 1 uppercase, 1 number)
- Phone number format validation
- Name field validation
- Username validation
- Confirm password matching

**Return Format**:
```typescript
interface ValidationResult {
  isValid: boolean;
  error?: string;
}
```

**Usage**:
```typescript
import { validateEmail, validatePassword, validatePhone } from '@/lib/validations';

const emailValidation = validateEmail(email);
if (!emailValidation.isValid) {
  // show error: emailValidation.error
}
```

#### `lib/storage.ts`
**Purpose**: Abstraction layer for localStorage (browser storage)
- Safe save/retrieve of authentication tokens
- User data persistence
- Clear all auth data on logout
- Check authentication status

**Functions**:
- `saveAuthToken(token)`: Save JWT token
- `getAuthToken()`: Retrieve JWT token
- `saveUserData(user)`: Save user object
- `getUserData()`: Retrieve user object
- `clearAuthData()`: Remove all auth data
- `isAuthenticated()`: Check if user is logged in

**Usage**:
```typescript
import { saveAuthToken, getAuthToken, clearAuthData, isAuthenticated } from '@/lib/storage';

saveAuthToken(jwtToken);
const token = getAuthToken();
clearAuthData(); // on logout
```

#### `lib/api/auth.ts`
**Purpose**: API client for authentication endpoints
- Encapsulates all auth API calls
- Handles Bearer token in Authorization header
- Manages request/response formatting

**Methods**:
- `register(formData)`: POST /auth/register
- `login(credentials)`: POST /auth/login
- `getProfile(token)`: GET /auth/profile

**Usage**:
```typescript
import { authAPI } from '@/lib/api/auth';

const response = await authAPI.login({ username, password });
const profile = await authAPI.getProfile(token);
```

#### `lib/api/patients.ts`
**Purpose**: API client for patient management endpoints
- Patient CRUD operations
- Manages authorization headers

**Methods**:
- `getAll(token)`: Fetch all patients
- `create(token, patientData)`: Create new patient
- `getById(token, patientId)`: Fetch specific patient
- `update(token, patientId, data)`: Update patient
- `delete(token, patientId)`: Delete patient

**Usage**:
```typescript
import { patientAPI } from '@/lib/api/patients';

const patients = await patientAPI.getAll(token);
const newPatient = await patientAPI.create(token, { name: '...' });
```

#### `hooks/useAuth.ts`
**Purpose**: Custom React hook for authentication state management
- Manages global auth state (user, token, loading, error)
- Restores session from localStorage on mount
- Provides login, register, logout methods
- Handles loading states and errors

**State**:
- `user`: Current authenticated user object
- `token`: JWT authentication token
- `isLoading`: Loading indicator for async operations
- `error`: Error message if auth fails
- `isAuthenticated`: Computed boolean

**Methods**:
- `login(username, password)`: Authenticate user
- `register(formData)`: Create new account
- `logout()`: Clear auth state and logout

**Usage**:
```typescript
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    // Show login form
  }

  const handleLogin = async () => {
    await auth.login(username, password);
  };

  return <div>{auth.user?.username}</div>;
}
```

---

## Backend Architecture

### Directory Structure
```
backend/
├── config/
│   └── database.js         # SQLite database setup
├── models/
│   └── User.js             # User and Patient model classes
├── controllers/
│   ├── authController.js   # Auth endpoints
│   └── patientController.js # Patient endpoints
├── services/
│   ├── authService.js      # Auth business logic
│   └── patientService.js   # Patient business logic
├── middleware/
│   └── auth.js             # JWT verification middleware
├── utils/
│   ├── validators.js       # Validation functions
│   ├── jwt.js              # JWT token utilities
│   └── errors.js           # Error handling utilities
├── routes/
│   ├── authRoutes.js       # Auth route definitions
│   └── patientRoutes.js    # Patient route definitions
├── server.js               # Express app setup
├── .env                    # Environment variables
└── package.json            # Dependencies
```

### Module Responsibilities

#### `config/database.js`
**Purpose**: SQLite database connection and initialization
- Creates database connection pool
- Initializes database tables (users, patients)
- Exports database instance

**Tables**:
- `users`: id, username, email, password_hash, first_name, last_name, phone, specialization, clinic_name
- `patients`: id, doctor_id (FK), name, email, phone, age, gender, details, medical_history

#### `models/User.js`
**Purpose**: Data persistence layer for users and patients
- User class with static methods for CRUD
- Patient-related methods
- Password verification
- Database queries

**Methods**:
- `User.create()`: Create new user
- `User.findById()`: Fetch user by ID
- `User.findByUsername()`: Fetch user by username
- `User.findByEmail()`: Fetch user by email
- `User.verifyPassword()`: Compare password with hash
- Patient-related CRUD methods

#### `utils/validators.js`
**Purpose**: Validation functions (same as frontend)
- Email format validation
- Password strength validation
- Phone number validation
- Name field validation

**Usage**:
```javascript
const { validateEmail, validatePassword, validatePhone } = require('../utils/validators');

if (!validateEmail(email)) {
  throw new AppError('Invalid email', 400);
}
```

#### `utils/jwt.js`
**Purpose**: JWT token utilities
- Generate tokens with user ID
- Verify tokens
- Handle token errors

**Functions**:
- `generateToken(userId)`: Create JWT token
- `verifyToken(token)`: Validate and decode token

#### `utils/errors.js`
**Purpose**: Error handling and standardization
- Custom AppError class
- Error message constants
- Error formatting utility

**Usage**:
```javascript
const { AppError, ERROR_MESSAGES } = require('../utils/errors');

throw new AppError(ERROR_MESSAGES.INVALID_EMAIL, 400);
```

#### `services/authService.js`
**Purpose**: Business logic for authentication
- Encapsulates registration logic
- Encapsulates login logic
- Validates user data
- Checks for duplicate emails/usernames

**Functions**:
- `registerUser(userData)`: Create account
- `loginUser(username, password)`: Authenticate
- `getUserProfile(userId)`: Fetch user profile

#### `services/patientService.js`
**Purpose**: Business logic for patient management
- Patient CRUD operations
- Authorization checks (doctor ownership)
- Data validation

**Functions**:
- `getPatients(doctorId)`: Fetch all patients
- `createPatient(doctorId, data)`: Create patient
- `getPatientById(patientId, doctorId)`: Fetch patient with auth check
- `updatePatient(patientId, doctorId, data)`: Update patient
- `deletePatient(patientId, doctorId)`: Delete patient

#### `controllers/authController.js`
**Purpose**: HTTP request handlers for auth
- Delegates to service layer
- Formats HTTP responses
- Handles errors

**Endpoints**:
- `POST /auth/register` → `register()`
- `POST /auth/login` → `login()`
- `GET /auth/profile` → `getProfile()`

#### `controllers/patientController.js`
**Purpose**: HTTP request handlers for patients
- Delegates to service layer
- HTTP response formatting

**Endpoints**:
- `GET /patients` → `getPatients()`
- `POST /patients` → `createPatient()`
- `GET /patients/:id` → `getPatient()`
- `PUT /patients/:id` → `updatePatient()`
- `DELETE /patients/:id` → `deletePatient()`

#### `middleware/auth.js`
**Purpose**: JWT verification middleware
- Extracts token from Authorization header
- Verifies token validity
- Adds userId to request object

**Usage**:
```javascript
router.get('/profile', authenticateToken, getProfile);
```

---

## Data Flow Examples

### Registration Flow
```
Frontend (page.tsx)
  → validateEmail/Password/Phone (lib/validations.ts)
  ↓
  useAuth.register() (hooks/useAuth.ts)
    → authAPI.register() (lib/api/auth.ts)
      ↓
      Backend: POST /auth/register
        → authController.register()
          → authService.registerUser()
            → validateEmail/Password/Phone (utils/validators.js)
            → User.create() (models/User.js)
            → generateToken() (utils/jwt.js)
          ← Response: { user, token }
      ↓
    → saveAuthToken/saveUserData() (lib/storage.ts)
    → setUser/setToken() (useAuth state)
  ↓
Page redirects to dashboard
```

### Patient Fetch Flow
```
Frontend (page.tsx)
  useEffect → fetchPatients()
    → patientAPI.getAll(token) (lib/api/patients.ts)
      ↓
      Backend: GET /patients
        → Middleware: authenticateToken (middleware/auth.js)
        → patientController.getPatients()
          → patientService.getPatients(doctorId)
            → User.getPatientsByDoctorId() (models/User.js)
          ← Response: { patients: [...] }
      ↓
    → setPatients(...) (page.tsx state)
  ↓
Render patient list
```

---

## Key Architectural Principles

### 1. **Separation of Concerns**
- **Frontend**: UI layer separate from business logic
- **Backend**: Controllers (HTTP) separate from Services (business logic) separate from Models (data)

### 2. **Single Responsibility**
- Each file/module has one clear purpose
- Constants in one place, validations in another, API calls in another

### 3. **DRY (Don't Repeat Yourself)**
- Validation logic shared between frontend and backend
- Error messages centralized
- API calls abstracted into client layer

### 4. **Type Safety**
- Frontend: TypeScript interfaces prevent runtime errors
- Backend: Consistent error handling with AppError class

### 5. **Reusability**
- Validation functions can be used in any component
- API clients can be used anywhere in the app
- Services can be used by different controllers if needed

### 6. **Security**
- Passwords hashed with bcryptjs (10-round salt)
- JWT tokens for stateless authentication
- Authorization checks in services (ownership verification)
- Sensitive data stored in environment variables

---

## Best Practices for Development

### Adding a New Feature

1. **Define Types** → Add to `lib/types.ts` (frontend) and use interfaces in models
2. **Add Validations** → Add to `lib/validations.ts` (frontend) and `utils/validators.js` (backend)
3. **Create API Client** → Add to `lib/api/[feature].ts`
4. **Create Service** → Add to `services/[feature]Service.js` (backend)
5. **Create Controller** → Add endpoints to `controllers/[feature]Controller.js`
6. **Add Routes** → Define in `routes/[feature]Routes.js`
7. **Create Custom Hook** → Add to `hooks/use[Feature].ts` if needed
8. **Build UI Components** → Use the hook and API client

### Modifying Validation Rules

- **Frontend**: Edit `lib/constants.ts` (VALIDATION_RULES) and `lib/validations.ts`
- **Backend**: Edit `utils/validators.js`
- Keep both in sync!

### Adding Error Messages

- **Frontend**: Add to `lib/constants.ts` (ERROR_MESSAGES)
- **Backend**: Add to `utils/errors.js` (ERROR_MESSAGES)

### Adding API Endpoints

1. Create/update service in `services/`
2. Create/update controller in `controllers/`
3. Add routes in `routes/`
4. Create/update API client in `lib/api/` (frontend)
5. Create/update custom hook if needed

---

## Testing Strategy

### Frontend
- Test validation functions independently: `validateEmail`, `validatePassword`, etc.
- Test API clients with mock responses
- Test components with different auth states
- Test form submission with validation

### Backend
- Test services with different inputs
- Test controllers with mocked services
- Test middleware with valid/invalid tokens
- Test database queries

---

## Migration Notes

### From SQLite to PostgreSQL
To migrate from SQLite to PostgreSQL:

1. Update `config/database.js` to use `pg` package
2. Update connection string in `.env`
3. Update User.js queries to PostgreSQL syntax
4. Run migrations to create tables

The service/controller layer doesn't need changes!

---

## Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Backend (`.env`)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=doctor_app
DB_USER=postgres
DB_PASSWORD=yourpassword
PORT=5000
JWT_SECRET=your-secret-key
```

---

## Summary

This modular architecture provides:
- ✅ Clear separation of concerns
- ✅ Easy to test
- ✅ Easy to maintain
- ✅ Easy to scale
- ✅ Consistent code organization
- ✅ Reusable components and functions
- ✅ Type-safe development
- ✅ Centralized configuration

Follow these patterns when adding new features!
