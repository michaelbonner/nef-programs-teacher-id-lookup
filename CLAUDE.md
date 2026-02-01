# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NEF Programs Teacher ID Lookup is a WordPress plugin with an embedded React single-page application. It provides a 3-step wizard for teachers to find their ID by searching for their school, then their name, enabling form submission workflows for NEF educational programs.

## Commands

- `npm run start` - Start Parcel dev server (typically http://localhost:1234)
- `npm run build` - Build for production (outputs to `dist/`)

## Architecture

### Tech Stack
- **Frontend**: React 19 with Styled Components
- **Build**: Parcel (with `--no-scope-hoist --no-content-hash` flags to avoid variable collisions and ensure consistent filenames)
- **WordPress Integration**: PHP shortcode that enqueues the built JS bundle

### File Structure
- `index.js` - Single React component (`TeacherIDLookup`) containing all UI and logic
- `index.html` - Entry point for Parcel
- `nef-programs-teacher-id-lookup.php` - WordPress plugin file with shortcode registration
- `dist/` - Compiled assets (committed to repo for deployment)

### API Integration
The app connects to different backends based on environment:
- **Local**: `http://localhost/api/open/`
- **Production**: `https://api.programs.nef1.org/api/open/`

Endpoints used:
- `/school-search` - Search schools by name with program/year filters
- `/teacher-search` - Search teachers by school ID and last name

### WordPress Shortcode
```
[nef_programs_teacher_id_lookup]
[nef_programs_teacher_id_lookup program_id="123"]
[nef_programs_teacher_id_lookup program_job_code="abc-xyz"]
[nef_programs_teacher_id_lookup year="2021"]
[nef_programs_teacher_id_lookup program_job_code="abc-xyz" year="2021"]
```

Parameters are passed to React via HTML attributes on the container div.

### CSS Theming
Colors are customizable via CSS custom properties on `#teacher_id_lookup_container`:
- `--nef-teacher-lookup-text-color`
- `--nef-teacher-lookup-light-color`
- `--nef-teacher-lookup-base-color`
- `--nef-teacher-lookup-accent-color`
- `--nef-teacher-lookup-error-color`

## Deployment

1. Run `npm run build`
2. Commit the generated `dist/` files
3. Sync `nef-programs-teacher-id-lookup.php` and `dist/` to WordPress `plugins/teacher-id-lookup/`

Note: When updating the built JS filename, also update the filename reference in `nef-programs-teacher-id-lookup.php` (line 41).
