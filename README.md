# Next Theme Toggle

A CLI tool that instantly sets up dark/light theme toggling in your Next.js projects + Tailwind CSS v4 with zero configuration hassle.

[![npm version](https://badge.fury.io/js/next-theme-toggle.svg)](https://badge.fury.io/js/next-theme-toggle)
[![Downloads](https://img.shields.io/npm/dm/next-theme-toggle.svg)](https://npmjs.com/package/next-theme-toggle)

## Features

- **One command setup** - Get theme switching working in seconds
- **Tailwind CSS v4** - Automatically installs/upgrades to latest Tailwind
- **TypeScript & JavaScript** - Full support for both
- **Smooth transitions** - Elegant animations between themes
- **Smart theme toggle** - Uses `next-themes` for system preference detection
- **Responsive design** - Works perfectly on mobile and desktop
- **Non-destructive** - Only adds new files and overwrite few existing files
- **Smart detection** - Automatically detects your project structure
- **Custom components** - Includes Header, ThemeToggle, and ExampleCard
- **Modern styling** - Uses system preferences with manual override
- **Zero configuration** - Works out of the box

## Quick Start

### Prerequisites

- Node.js 16+
- A Next.js project (App Router - recommended)
- npm, yarn, or pnpm

### Dependencies

- `next-themes` - Theme switching logic
- `lucide-react` - Icons for sun/moon
- `tailwindcss@latest` - Styling (v4+)

### Installation & Usage

**Option 1: Direct execution (Recommended)**
```bash
npx next-theme-toggle
```

**Option 2: Install then run**
```bash
npm i next-theme-toggle
```
```bash
next-theme-toggle
```

### Watch Demo

[Watch Demo](https://github.com/user-attachments/assets/6d72b9d3-ef5b-4eff-8988-065f97cb5f7a)


### Expected Output

**Scenario 1: Fresh Tailwind CSS Installation**
```bash
🚀 Setting up Next.js theme toggle...

√ Next.js project detected
[i] Using npm package manager
[i] Installing Tailwind CSS dependencies:
  - tailwindcss
  - @tailwindcss/postcss
  - postcss

√ Packages installed: tailwindcss, @tailwindcss/postcss, postcss
√ Created postcss.config.mjs with Tailwind CSS v4 configuration
√ Complete globals.css copied from template to src\app\globals.css

[i] Installing dependencies:
  - lucide-react
  - next-themes

√ Packages installed: lucide-react, next-themes
√ Dependencies installed successfully

[i] Using app directory: src/app

√ Successfully created component 'ThemeToggle.tsx' in src/app/components
√ Successfully created component 'Header.tsx' in src/app/components/layout
√ Successfully created component 'ExampleCard.tsx' in src/app/components
√ Successfully overwritten layout.tsx in src/app with ThemeProvider
√ Successfully overwritten page.tsx in src/app

Theme toggle setup complete!
```

**Scenario 2: Existing Tailwind CSS Setup**
```bash
🚀 Setting up Next.js theme toggle...

√ Next.js project detected
[i] Using npm package manager
√ Tailwind CSS v4+ already installed

√ Custom theme styles appended to src\app\globals.css

[i] Installing dependencies:
  - lucide-react
  - next-themes

√ Packages installed: lucide-react, next-themes
√ Dependencies installed successfully

[i] Using app directory: src/app

√ Successfully created component 'ThemeToggle.tsx' in src/app/components
√ Successfully created component 'Header.tsx' in src/app/components/layout
√ Successfully created component 'ExampleCard.tsx' in src/app/components
√ Successfully overwritten layout.tsx in src/app with ThemeProvider
√ Successfully overwritten page.tsx in src/app

Theme toggle setup complete!
```

That's it! The tool will automatically:

- Detect your package manager (npm/yarn/pnpm)
- Verify you're in a Next.js project
- Install/upgrade Tailwind CSS to v4
- Inject Tailwind directives into your CSS
- Install required dependencies (`next-themes`, `lucide-react`)
- Create theme toggle components
- Set up your layout with ThemeProvider
- Update your layout and page files
- Configure CSS with smooth transitions

## What Gets Created

### Components Structure

```
src/app/components/          # or app/components/
├── layout/
│   └── Header.tsx          # Navigation with theme toggle
├── ExampleCard.tsx         # Sample card component
└── ThemeToggle.tsx         # The magic toggle button
```

- `components/ThemeToggle.tsx` - The theme toggle button
- `components/layout/Header.tsx` - Header component with the toggle
- `components/ExampleCard.tsx` - Example Card component

### Updated Files

- `layout.tsx` - Wrapped with ThemeProvider
- `page.tsx` - Updated with new components
- `globals.css` - add custom css varient and smooth transition effect
- `postcss.config.mjs` - Configured for Tailwind v4

## Manual Integration

After running the command, your components are ready to use:

```tsx
// In your layout.tsx (automatically done)
import { ThemeProvider } from "next-themes";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

```tsx
// In your page.tsx or any component
import Header from "@/app/components/layout/Header";
import ExampleCard from "@/app/components/ExampleCard";

export default function HomePage() {
  return (
    <div>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ExampleCard />
      </main>
    </div>
  );
}
```

## Command Options

```bash
# Default installation
npx next-theme-toggle

# Skip Tailwind CSS setup (if you have custom setup)
npx next-theme-toggle --no-tailwind
# or
npx next-theme-toggle -T
```

## Customization

### Theme Colors

The tool creates CSS variables you can customize in `globals.css`:

```css
:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
```

### Component Styling

All components use Tailwind classes and can be easily customized:

```tsx
// Example: Customize the theme toggle button
<button className="your-custom-classes">{/* Theme toggle content */}</button>
```

## Troubleshooting

### Common Issues

**Theme not working?**

- Make sure Tailwind's `dark:` classes are in your CSS
- Check that ThemeProvider wraps your app in layout.tsx

**Components not found?**

- Verify the components are copied to your components folder
- Check your import paths match your project structure

**"No package.json found"**

- Make sure you're in your Next.js project root directory

**"This doesn't appear to be a Next.js project"**

- Ensure Next.js is installed in dependencies or devDependencies

**Tailwind styles not working**

- Make sure your `postcss.config.mjs` includes `@tailwindcss/postcss`
- Restart your dev server after installation

**Still having issues?**

- Make sure you're running `npm run dev` after setup
- Check console for any import/export errors

### Manual Path Configuration

If path aliases don't work, update your imports:

```tsx
// Instead of @/app/components/...
import ThemeToggle from "./components/ThemeToggle";
import Header from "./components/layout/Header";
```

## Contributing

We love contributions! Issues and PRs welcome! This tool is designed to be simple and focused - let's keep it that way. Here's how to get started:

### Development Setup

1. **Fork & Clone**

   ```bash
   git clone https://github.com/megh-bari/next-theme-toggle.git
   cd next-theme-toggle
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Test Locally**

   ```bash
   # Link for local testing
   npm link (try running this command in the terminal as an administrator)

   # Test in a Next.js project
   cd /path/to/your-nextjs-project
   npm link next-theme-toggle
   next-theme-toggle
   ```

### Making Changes

1. **Create a Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make Your Changes**

   - Update the main script in `index.js`
   - Add/modify templates in `templates/` directory
   - Update tests if applicable

3. **Test Your Changes**

   ```bash
   # Test with different Next.js setups
   npm run test

   # Test with TypeScript projects
   # Test with JavaScript projects
   # Test with different app structures (src/app vs app)
   ```

4. **Commit & Push**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

5. **Create Pull Request**
   - Provide clear description of changes
   - Include screenshots if UI changes
   - Link any related issues

### Contribution Guidelines

#### Bug Reports

- Use the bug report template
- Include Node.js and Next.js versions
- Provide minimal reproduction steps
- Include error messages and logs

#### Feature Requests

- Use the feature request template
- Explain the use case and benefits
- Consider backward compatibility
- Provide implementation ideas if possible

#### Code Standards

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Include error handling
- Test with both TypeScript and JavaScript projects

#### Testing

Before submitting:

- [ ] Test with fresh Next.js project
- [ ] Test with existing Tailwind setup
- [ ] Test with both `src/app` and `app` structures
- [ ] Test with npm, yarn, and pnpm
- [ ] Verify all generated files work correctly

### Project Structure

```
next-theme-toggle/
├── templates/              # Component templates
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── layout.js
│   │   ├── page.tsx
│   │   └── page.js
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Header.jsx
│   │   ├── ExampleCard.tsx
│   │   ├── ExampleCard.jsx
│   │   ├── ThemeToggle.tsx
│   │   └── ThemeToggle.jsx
│   └── globals.css
├── index.js               # Main CLI script
├── package.json
└── README.md
```

### Release Process

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create release tag
4. Publish to npm

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [next-themes](https://github.com/pacocoursey/next-themes) for theme management
- [Lucide](https://lucide.dev/) for beautiful icons

## Stats

- ⭐ Star this repo if it helped you!
- 🐛 Report issues on [GitHub Issues](https://github.com/megh-bari/next-theme-toggle/issues)
- 💡 Request features on [GitHub Discussions](https://github.com/megh-bari/next-theme-toggle/discussions)

---

## Built By

- Twitter: [@meghtrix](https://x.com/meghtrix)
- GitHub: [@megh-bari](https://github.com/megh-bari)


_Happy theming!_