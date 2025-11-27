# Archipelago Groupie - Development Roadmap

## Project Overview

A Nuxt application for managing and organizing Archipelago randomizer game sessions. The admin hosts the application and coordinates with players to collect YAML configurations, which are then exported as a ZIP file for uploading to the Archipelago website.

## Tech Stack

- **Framework**: Nuxt 4 with Vue 3
- **UI**: @nuxt/ui
- **Database**: NuxtHub (SQLite with Drizzle ORM)
- **Authentication**: nuxt-auth-utils
- **Hosting**: NuxtHub (Cloudflare)

## User Roles & Workflow

### Initial Setup (First-Time Onboarding)

1. First person to access the application goes through onboarding
2. Creates their username and password
3. This first account is automatically assigned as admin
4. Onboarding only happens once (when no admin exists)

### Admin Role

1. Logs in with their onboarding credentials
2. Can create players manually (auto-generated credentials)
3. Can toggle global player self-signup setting
4. Sends player credentials to participants
5. Views all players and their upload status
6. Exports all player YAMLs as ZIP when ready

### Player Role

1. Receives login credentials from admin (or self-signs up if enabled)
2. Logs in to player portal
3. Uploads their Archipelago YAML configuration file(s)
4. Can have multiple game slots (multiple YAMLs)
5. Can edit their YAML(s) using an auto-generated form based on YAML structure
6. Can re-upload/replace their YAML file(s) before final export

## Database Schema

### ✅ Tables Designed

#### `players`

- `id` (primary key, auto-increment)
- `username` (unique, not null)
- `password` (hashed, not null)
- `role` ('admin' or 'player')
- `createdAt`, `updatedAt`

#### `games`

Each game represents a player's YAML configuration (one player can have multiple game slots/YAMLs)

- `id` (primary key, auto-increment)
- `playerId` (foreign key → players)
- `name` (not null - game/slot name)
- `yamlContent` (text - the YAML file content)
- `yamlFilename` (text - original filename)
- `uploadedAt` (timestamp - when YAML was uploaded)
- `createdAt`, `updatedAt`

#### `settings`

Application-wide settings (single row)

- `id` (primary key, auto-increment)
- `allowPlayerSignup` (boolean - can players self-register)
- `updatedAt` (timestamp)

---

## Development Checklist

### Phase 1: Database & Authentication

- [x] Design database schema
- [x] Set up authentication utilities
  - [x] Password hashing helper (using nuxt-auth-utils)
  - [x] Login/logout handlers
  - [x] Session management
  - [x] Role-based middleware
  - [x] Check for admin existence (onboarding guard)
- [x] Create onboarding flow for first admin account

### Phase 2: API Endpoints

#### Endpoints

- [x] `GET /api/games` - List all games (all player YAMLs)
- [x] `GET /api/players` - List all players
- [x] `GET /api/player/:playerId/games` - List a player's games/YAMLs
- [x] `GET /api/games/:id` - Get a specific YAML
- [x] `POST /api/player/:playerId/games` - Upload YAML for a player (admin or current user protected)

#### Admin Endpoints

- [x] `GET /api/admin/export` - Export all YAMLs as ZIP
- [x] `POST /api/admin/players` - Create new player (auto-generate password)
- [x] `DELETE /api/admin/players/:id` - Delete player
- [x] `GET /api/admin/settings` - Get app settings (allowPlayerSignup)
- [x] `PATCH /api/admin/settings` - Update app settings

#### Admin or Current User Protected

- [x] `PATCH /api/games/:id` - Update YAML content (from form or file)
- [x] `DELETE /api/games/:id` - Delete a specific YAML
- [x] `GET /api/games/:id/schema` - Get parsed YAML structure for form generation

#### My Endpoints (Convenience Wrappers)

These endpoints get the session user and internally call the `/api/player/:playerId` or `/api/games/:id` endpoints:

- [x] `GET /api/my/games` - List their own games/YAMLs → calls `/api/player/:playerId/games`
- [x] `POST /api/my/games` - Upload new YAML file → calls `/api/player/:playerId/games`
- [x] `GET /api/my/games/:id` - Get a specific YAML → calls `/api/games/:id`
- [x] `PATCH /api/my/games/:id` - Update YAML content → calls `/api/games/:id`
- [x] `DELETE /api/my/games/:id` - Delete their YAML → calls `/api/games/:id`
- [x] `GET /api/my/games/:id/schema` - Get YAML schema → calls `/api/games/:id/schema`

#### Auth Endpoints

- [x] `GET /api/auth/check-onboarding` - Check if admin exists (onboarding needed)
- [x] `POST /api/auth/onboarding` - Create first admin account
- [x] `POST /api/auth/login` - Login (admin or player)
- [x] `POST /api/auth/logout` - Logout
- [x] `GET /api/auth/session` - Get current session
- [x] `POST /api/auth/signup` - Player self-signup (if globally enabled by admin)

### Phase 3: Admin Dashboard


#### Admin-Specific Pages
- [ ] `/players/new` - Create new player
- [ ] `/settings` - App settings (toggle self-signup)
- [ ] `/players/:id/games/:id/edit` - Allows admin to edit specific player games


#### Admin Components

- [ ] PlayerForm component with password generator
- [ ] ExportButton component
- [ ] SettingsForm component

### Phase 4: Player Portal

#### Main Pages

- [ ] `/` - Main application page (shows admin or player view based on role)
- [ ] `/players` - Shows all players
- [ ] `/players/:id/games` - Shows a specific player games
- [ ] `/players/:id/games/:id` - Shows a specific player specific game
- [ ] `/games` - Shows all games
- [x] `/login` - Login page (admin and players)
- [x] `/signup` - Player self-signup page (only if enabled by admin)
- [x] `/onboarding` - First-time setup (create admin account)

#### Components

- [ ] PlayerList component (shows all players and upload status)

##### Game lists, they should reuse the same few components, no duplicate code
- [ ] PlayerGameList component (shows all YAMLs from a player)
- [ ] PlayersGameList component (shows all YAMLs from all players)
- [ ] GameList component (shows all YAMLs)


#### Player-Specific Pages

- [ ] `my/games` - Shows current user games
- [ ] `my/games/` - Creates new game (Upload new YAML)
- [ ] `my/games/:id/edit` - Edit YAML with auto-generated form

#### Auth Components

- [x] LoginForm component
- [x] RegisterForm component (used for both signup and onboarding)

#### Player Components

- [ ] YamlUpload component (file upload with validation)
- [ ] YamlList component
- [ ] YamlEditor component (auto-generated form based on YAML structure)
- [ ] YamlFormField component (dynamic field renderer)

### Phase 5: Core Features

#### Authentication

- [x] Global auth middleware (redirects to /login if not authenticated)
- [x] Onboarding guard (redirect to /onboarding if no admin exists)
- [x] Admin-only route guards (for /players, /settings)
- [x] Role-based content rendering on main page (/)
- [x] Password hashing (using nuxt-auth-utils)
- [x] Auto-generate secure passwords for players

#### File Handling

- [ ] YAML file upload handler
- [ ] YAML validation (basic - check file extension, format)
- [ ] File size limits
- [ ] Store YAML content in database
- [ ] Allow multiple YAMLs per player

#### YAML Editor

- [ ] Parse YAML into structured data (using confbox)
- [ ] Generate form schema from YAML structure
- [ ] Dynamic form rendering based on field types
- [ ] Form validation based on YAML constraints
- [ ] Serialize form data back to YAML (using confbox stringifyYAML)
- [ ] Preserve YAML comments and formatting where possible
- [ ] Handle nested objects and arrays
- [ ] Support common Archipelago YAML field types

#### Export Functionality

- [ ] Collect all YAMLs from all players
- [ ] Generate ZIP file with proper structure
- [ ] Name files appropriately (username_slotname.yaml or similar)
- [ ] Stream ZIP download to admin

### Phase 6: UI/UX Polish

- [ ] Responsive design for all pages
- [ ] Loading states
- [ ] Error handling & notifications
- [ ] Form validation
- [ ] Confirmation modals
- [ ] Success/error toasts
- [ ] Dark mode support (from @nuxt/ui)

### Phase 7: Additional Features (Optional)

- [ ] Email player credentials
- [ ] Player profile page
- [ ] YAML templates/presets
- [ ] Bulk player import
- [ ] Activity logs
- [ ] Game/YAML cloning
- [ ] YAML preview (read-only view)
- [ ] YAML diff (compare versions)
- [ ] YAML validation against Archipelago schemas

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Session secret for nuxt-auth-utils (required)
NUXT_SESSION_PASSWORD=at-least-32-characters-long-random-string
```

Note: Application settings like `allowPlayerSignup` are stored in the database and can be changed by the admin through the UI.

---

## File Structure

```
archipelago-groupie/
├── app/
│   ├── pages/
│   │   ├── index.vue (main app - admin/player view based on role)
│   │   ├── login.vue (login page)
│   │   ├── signup.vue (player registration)
│   │   ├── onboarding.vue (first-time admin setup)
│   │   ├── players/
│   │   │   ├── index.vue (admin only - player management)
│   │   │   └── new.vue (admin only - create player)
│   │   ├── settings.vue (admin only - app settings)
│   │   ├── upload.vue (player - upload YAML)
│   │   └── games/
│   │       └── [id]/
│   │           └── edit.vue (player - edit YAML)
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.vue
│   │   │   └── SignupForm.vue
│   │   ├── admin/
│   │   │   ├── PlayerList.vue
│   │   │   ├── PlayerForm.vue
│   │   │   ├── ExportButton.vue
│   │   │   ├── GameList.vue
│   │   │   └── SettingsForm.vue
│   │   └── player/
│   │       ├── YamlUpload.vue
│   │       ├── YamlCard.vue
│   │       ├── YamlList.vue
│   │       ├── YamlEditor.vue
│   │       └── YamlFormField.vue
│   └── middleware/
│       ├── 01.auth.ts (global - redirect to /login if not authenticated)
│       ├── 02.admin.ts (admin-only routes)
│       └── 02.player.ts (player-only routes if needed)
├── server/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── games/
│   │   │   │   ├── index.get.ts
│   │   │   │   └── [id].delete.ts
│   │   │   ├── players/
│   │   │   │   ├── index.get.ts
│   │   │   │   ├── index.post.ts
│   │   │   │   └── [id].delete.ts
│   │   │   ├── settings/
│   │   │   │   ├── index.get.ts
│   │   │   │   └── index.patch.ts
│   │   │   └── export.get.ts
│   │   ├── player/
│   │   │   └── games/
│   │   │       ├── index.get.ts
│   │   │       ├── index.post.ts
│   │   │       ├── [id]/
│   │   │       │   ├── index.get.ts
│   │   │       │   ├── index.patch.ts
│   │   │       │   ├── index.delete.ts
│   │   │       │   └── schema.get.ts
│   │   └── auth/
│   │       ├── check-onboarding.get.ts
│   │       ├── onboarding.post.ts
│   │       ├── login.post.ts
│   │       ├── logout.post.ts
│   │       ├── session.get.ts
│   │       └── signup.post.ts
│   ├── drizzle/
│   │   └── schema/
│   │       ├── player.ts
│   │       ├── game.ts
│   │       └── settings.ts
│   └── utils/
│       ├── auth.ts
│       ├── password.ts
│       ├── yaml.ts (YAML parsing/serialization)
│       └── zip.ts
└── nuxt.config.ts
```

---

## Testing Checklist

- [ ] First-time visitor is redirected to /onboarding (no admin exists)
- [ ] Onboarding creates admin account successfully
- [ ] Onboarding is not accessible after admin is created
- [ ] Unauthenticated users are redirected to /login
- [ ] Admin sees admin view on main page (/)
- [ ] Player sees player view on main page (/)
- [ ] Admin can access /players and /settings
- [ ] Player cannot access admin-only routes
- [ ] Admin can create players with auto-generated passwords
- [ ] Admin can toggle global self-signup setting
- [ ] Player can log in with generated credentials
- [ ] Player can upload YAML file
- [ ] Player can upload multiple YAML files
- [ ] Player can edit YAML through auto-generated form
- [ ] Player can replace/update their YAML (file upload)
- [ ] Player can delete their YAML
- [ ] YAML editor preserves data structure and types
- [ ] Signup page is accessible when self-signup is enabled
- [ ] Signup page shows error when self-signup is disabled
- [ ] Player self-signup creates account successfully
- [ ] Admin can view all players and their upload status
- [ ] Admin can export ZIP with all YAMLs from all players
- [ ] ZIP contains correctly named files
- [ ] Proper error handling for invalid files
- [ ] Role-based access control works correctly
- [ ] Session persistence works

---

## Dependencies

All major dependencies are already included:

- **@nuxt/ui** - UI components and styling
- **@nuxthub/core** - Database (SQLite) and hosting
- **nuxt-auth-utils** - Authentication and session management
- **drizzle-orm** - Database ORM
- **confbox** - YAML parsing (included with Nuxt)

Additional utilities needed:

- **ZIP generation** - Use built-in Node.js streams or a lightweight library
- **Password hashing** - Consider using Web Crypto API or a library like bcrypt

## Deployment Notes

1. **Database Migrations**: Run `npx drizzle-kit push` to sync schema with database
2. **Environment Variables**: Set `NUXT_SESSION_PASSWORD` in production
3. **NuxtHub Deployment**: Deploy via `npx nuxthub deploy` or connect GitHub repo
4. **Initial Setup**: First visitor will trigger onboarding to create admin account

---

## Next Steps

1. ✅ Complete database schema implementation
2. Build onboarding flow (first-time admin setup)
3. Set up authentication system with middleware
4. Build core API endpoints
5. Create admin dashboard
6. Build player upload interface
7. Implement YAML editor
8. Implement ZIP export
9. Test and polish
