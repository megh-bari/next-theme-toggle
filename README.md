# next-theme-toggle

A CLI tool to quickly add dark/light theme toggle to Next.js projects with Tailwind CSS v4.

## Features

- **One command setup** - Get theme switching working in seconds
- **Tailwind CSS v4** - Automatically installs/upgrades to latest Tailwind
- **Smart theme toggle** - Uses `next-themes` for system preference detection
- **Responsive design** - Works perfectly on mobile and desktop
- **Non-destructive** - Only adds new files and overwrite few existing files
- **Zero configuration** - Works out of the box

## Quick Start

```bash
npx next-theme-toggle
```

That's it! The CLI will:

1. Verify you're in a Next.js project
2. Install/upgrade Tailwind CSS to v4 
3. Inject Tailwind directives into your CSS
4. Install `lucide-react` and `next-themes`
5. Add theme toggle components to your project
6. Set up your layout with ThemeProvider

## What Gets Added

### Components
- `components/ThemeToggle.tsx` - The theme toggle button
- `components/layout/Header.tsx` - Header component with the toggle
- `components/ExampleCard.tsx` - Example Card component
- `app/layout.tsx` - Layout wrapped with ThemeProvider
- `app/page.tsx` - updated `page.tsx`
- `app/global.css` - add custom css varient and smooth transition effect


### Dependencies
- `next-themes` - Theme switching logic
- `lucide-react` - Icons for sun/moon
- `tailwindcss@latest` - Styling (v4+)

## Usage After Setup

Import and use the Header component in your pages:

```tsx
import { Header } from '@/components/Header'

export default function HomePage() {
  return (
    <div>
      <Header />
      <main>
        <h1>Your content here</h1>
      </main>
    </div>
  )
}
```

## Options

- `--no-tailwind` or `-T` - Skip Tailwind installation/upgrade

```bash
npx next-theme-toggle --no-tailwind
```

## Requirements

- Node.js 16+
- Next.js project
- App Router (recommended)

## How It Works

The theme toggle uses `next-themes` to:

1. Detect system theme preference
2. Store user's choice in localStorage
3. Apply the appropriate theme class to your HTML
4. Prevent flash of incorrect theme on page load

The toggle button shows:
- 🌙 Moon icon in light mode (click to go dark)
- ☀️ Sun icon in dark mode (click to go light)

## Troubleshooting

**Theme not working?**
- Make sure Tailwind's `dark:` classes are in your CSS
- Check that ThemeProvider wraps your app in layout.tsx

**Components not found?**
- Verify the components are copied to your components folder
- Check your import paths match your project structure

**Still having issues?**
- Make sure you're running `npm run dev` after setup
- Check console for any import/export errors

## License

MIT

## Contributing.

Issues and PRs welcome! This tool is designed to be simple and focused - let's keep it that way.