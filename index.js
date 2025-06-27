#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execa } from "execa";
import chalk from "chalk";
import ora from "ora";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// logging colors
const log = {
  info: (msg) => console.log(chalk.hex("#61DAFB")("[i]"), msg),
  success: (msg) => console.log(chalk.green("√"), msg),
  warn: (msg) => console.log(chalk.yellow("!"), msg),
  error: (msg) => console.log(chalk.red("×"), msg),
  title: (msg) => console.log(chalk.bold.cyan(msg)),
};

// detect package manager
function detectPackageManager() {
  if (fs.existsSync("pnpm-lock.yaml")) return "pnpm";
  if (fs.existsSync("yarn.lock")) return "yarn";
  return "npm"; // by default goes with
}

// run package manager commands safely
async function runCommand(packageManager, args, cwd = process.cwd()) {
  const commandStr = `${packageManager} ${args.join(" ")}`;
  const packages = args.slice(1).join(", ");

  const spinner = ora({
    text: `Installing packages: ${commandStr}`,
    symbols: {
      tick: chalk.green("√"),
      cross: chalk.red("×"),
    },
  }).start();

  try {
    await execa(packageManager, args, { cwd });
    spinner.stop();
    log.success(`Packages installed: ${packages}`);
    // console.log();
    // spinner.succeed(`Packages installed: ${packages}`);
  } catch (error) {
    spinner.stop();
    log.error("Failed to install packages");
    // spinner.fail("Failed to install packages");
    throw error;
  }
}

// check if we're in a Next.js project or not
function checkNextJsProject() {
  const packageJsonPath = path.join(process.cwd(), "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    log.error(
      "No package.json found. Please run this command in a Next.js project root."
    );
    process.exit(1);
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

  if (!packageJson.dependencies?.next && !packageJson.devDependencies?.next) {
    log.error(
      "This doesn't appear to be a Next.js project. Next.js dependency not found."
    );
    process.exit(1);
  }

  log.success("Next.js project detected");
  console.log(); // adds one blank line
  return packageJson;
}

// check if project uses TS or not else JS
function isTypeScriptProject() {
  return fs.existsSync("tsconfig.json") || fs.existsSync("next.config.ts");
}

// get tailwindcss version
function getTailwindVersion() {
  try {
    const packageJsonPath = path.join(process.cwd(), "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    const tailwindVersion =
      packageJson.dependencies?.tailwindcss ||
      packageJson.devDependencies?.tailwindcss;

    if (!tailwindVersion) return null;

    // extract tailwindcss version number
    const versionMatch = tailwindVersion.match(/(\d+)/);
    return versionMatch ? parseInt(versionMatch[1]) : null;
  } catch (error) {
    return null;
  }
}

// install or upgrade tailwindcss
async function setupTailwind(packageManager) {
  const currentVersion = getTailwindVersion();

  if (!currentVersion) {
    const tailwindDeps = ["tailwindcss", "@tailwindcss/postcss", "postcss"];
    const prettyList = tailwindDeps.map((d) => `  - ${d}`).join("\n");

    log.info(`Installing Tailwind CSS dependencies:\n${prettyList}\n`);
    await runCommand(packageManager, ["install", ...tailwindDeps]);

    createPostCSSConfig();
    log.success("Tailwind CSS installed and configured");
    // console.log();
    return { freshInstall: true };
  } else if (currentVersion < 4) {
    const upgradeDeps = ["tailwindcss@latest", "@tailwindcss/postcss@latest"];
    const prettyList = upgradeDeps.map((d) => `  - ${d}`).join("\n");

    log.info(`Upgrading Tailwind CSS to v4:\n${prettyList}`);
    await runCommand(packageManager, ["install", ...upgradeDeps]);

    updatePostCSSConfigForV4();
    log.success("Tailwind CSS upgraded to v4");
    console.log();
    return { freshInstall: false };
  } else {
    // Tailwind v4+ already installed
    log.success("Tailwind CSS v4+ already installed");
    // console.log();

    // Return flag to indicate existing installation
    return { freshInstall: false };
  }
}

// handle globals.css with custom dark mode approach
function setupGlobalsCss(isFreshTailwindInstall = false) {
  const appDir = getAppDirectory();
  const possiblePaths = [
    path.join(appDir, "globals.css"),
    "styles/globals.css",
  ];

  let globalsCssPath = null;

  for (const cssPath of possiblePaths) {
    if (fs.existsSync(cssPath)) {
      globalsCssPath = cssPath;
      break;
    }
  }

  if (!globalsCssPath) {
    // create globals.css in the detected app directory
    if (!fs.existsSync(appDir)) {
      fs.mkdirSync(appDir, { recursive: true });
    }
    globalsCssPath = path.join(appDir, "globals.css");
  }

  if (isFreshTailwindInstall) {
    // Fresh Tailwind installation - copy complete globals.css from template
    const templateDir = path.join(__dirname, "templates");
    const templateGlobalsCss = path.join(templateDir, "globals.css");

    if (fs.existsSync(templateGlobalsCss)) {
      // Copy complete template globals.css
      const templateContent = fs.readFileSync(templateGlobalsCss, "utf8");
      fs.writeFileSync(globalsCssPath, templateContent);
      log.success(
        `Complete globals.css copied from template to ${globalsCssPath}`
      );
    } else {
      // Fallback: create basic globals.css with Tailwind directives + custom CSS
      const basicTailwindCss = `@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}
* {
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;
}
.transition-all {
  transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}
`;

      fs.writeFileSync(globalsCssPath, basicTailwindCss);
      log.success(
        `Basic globals.css created with Tailwind directives at ${globalsCssPath}`
      );
      console.log();
    }
  } else {
    // Existing Tailwind setup - just append custom CSS
    let existingContent = "";
    if (fs.existsSync(globalsCssPath)) {
      existingContent = fs.readFileSync(globalsCssPath, "utf8");
    }

    // custom CSS to append for light/dark theme and smooth transition
    const customCss = `
@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

* {
  transition: background-color 0.3s ease, border-color 0.3s ease,
    color 0.3s ease;
}
.transition-all {
  transition: all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}`;

    // check if our custom styles are already present or not
    if (
      !existingContent.includes("@variant dark") ||
      !existingContent.includes('data-theme="dark"')
    ) {
      // append our custom CSS to existing content
      const newContent = existingContent + customCss;
      fs.writeFileSync(globalsCssPath, newContent);
      log.success(`Custom theme styles appended to ${globalsCssPath}`);
      console.log(); // this to insert a blank line
    } else {
      log.success("Custom theme styles already present in globals.css");
    }
  }
}

// Create PostCSS configuration file - ONLY for fresh installations (No Tailwind)
function createPostCSSConfig() {
  const configFileName = "postcss.config.mjs";

  const configContent = `const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
`;

  fs.writeFileSync(configFileName, configContent);
  log.success(`Created ${configFileName} with Tailwind CSS v4 configuration`);
}

// Update existing PostCSS config for v4 - for upgrade
function updatePostCSSConfigForV4() {
  const existingConfigs = [
    "postcss.config.js",
    "postcss.config.mjs",
    "postcss.config.ts",
    "postcss.config.cjs",
  ];

  const existingConfig = existingConfigs.find((config) =>
    fs.existsSync(config)
  );

  if (existingConfig) {
    try {
      const existingContent = fs.readFileSync(existingConfig, "utf8");

      // Check if it already has @tailwindcss/postcss
      if (!existingContent.includes("@tailwindcss/postcss")) {
        log.warn(
          `${existingConfig} exists but needs manual update for Tailwind v4.`
        );
        log.warn(
          "Please add '@tailwindcss/postcss': {} to your plugins configuration."
        );
      } else {
        log.success("PostCSS config already configured for Tailwind v4");
      }
    } catch (error) {
      log.warn(
        `Could not read ${existingConfig}. Please verify it includes @tailwindcss/postcss plugin.`
      );
    }
  } else {
    log.warn(
      "No PostCSS config found. This might cause issues with Tailwind v4."
    );
  }
}

// install dependencies → lucide-react and next-themes
async function installDependencies(packageJson, packageManager) {
  const depsToInstall = [];

  if (
    !packageJson.dependencies?.["lucide-react"] &&
    !packageJson.devDependencies?.["lucide-react"]
  ) {
    depsToInstall.push("lucide-react");
  }

  if (
    !packageJson.dependencies?.["next-themes"] &&
    !packageJson.devDependencies?.["next-themes"]
  ) {
    depsToInstall.push("next-themes");
  }

  if (depsToInstall.length > 0) {
    // format
    // -
    // -
    const prettyList = depsToInstall.map((d) => `  - ${d}`).join("\n");

    log.info(`Installing dependencies:\n${prettyList}\n`);
    await runCommand(packageManager, ["install", ...depsToInstall]);
    log.success("Dependencies installed successfully");
    console.log(); // adds one blank line
  } else {
    log.success("Required dependencies already installed");
  }
}

// detect the correct app directory structure
function getAppDirectory() {
  if (fs.existsSync("src/app")) {
    return "src/app";
  } else if (fs.existsSync("app")) {
    return "app";
  } else {
    // default to src/app if neither exists
    return "src/app";
  }
}

// copy template files with TypeScript/JavaScript handling - Always overwrite
function copyTemplateFiles() {
  const isTS = isTypeScriptProject();
  const templateDir = path.join(__dirname, "templates");

  // determine file extensions is TS or JS
  const ext = isTS ? ".tsx" : ".jsx";
  const layoutExt = isTS ? ".tsx" : ".js";

  // detect correct app directory structure
  const appDir = getAppDirectory();
  const componentsDir = path.join(appDir, "components");
  const layoutDir = path.join(componentsDir, "layout");

  log.info(`Using app directory: ${appDir}`);
  console.log();
  // create directories
  [appDir, componentsDir, layoutDir].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // copy ThemeToggle component
  const themeToggleSrc = path.join(
    templateDir,
    "components", // sub-folder
    `ThemeToggle${isTS ? ".tsx" : ".jsx"}`
  );

  const themeToggleDest = path.join(componentsDir, `ThemeToggle${ext}`);

  // Fallback: if .jsx not found for JS, try .tsx
  if (!fs.existsSync(themeToggleSrc) && !isTS) {
    themeToggleSrc = path.join(templateDir, "components", "ThemeToggle.tsx");
    if (fs.existsSync(themeToggleSrc)) {
      console.warn(
        "Warning: No .jsx template found. Copying .tsx file as-is. This may cause errors in JS projects!"
      );
    }
  }

  if (fs.existsSync(themeToggleSrc)) {
    let content = fs.readFileSync(themeToggleSrc, "utf8");
    // if (!isTS) {
    //   // remove TS types for JS projects
    //   // content = content.replace(/: [A-Za-z<>[\]|{}]+/g, "");

    //   // strip `import type …` lines
    //   content = content.replace(/^import\s+type.*\n/gm, "");
    //   // Only strip type annotations in function params and variable declarations
    //   content = content.replace(/(\w+)\s*:\s*[^=;,\)\(]+(?=[,\)\s;])/g, "$1");
    // }
    fs.writeFileSync(themeToggleDest, content);
    log.success(
      `Successfully created component 'ThemeToggle${ext}' in ${componentsDir.replace(
        /\\/g,
        "/"
      )}`
    );
  } else {
    log.warn("ThemeToggle template component not found, skipping");
  }

  // copy Header component
  const headerSrc = path.join(
    templateDir,
    "components", // sub-folder
    "layout", // nested inside components
    `Header${ext}`
  );

  const headerDest = path.join(layoutDir, `Header${ext}`);

  if (fs.existsSync(headerSrc)) {
    let content = fs.readFileSync(headerSrc, "utf8");
    if (!isTS) {
      // remove TS types for JS projects
      content = content.replace(/: [A-Za-z<>[\]|{}]+/g, "");
    }
    fs.writeFileSync(headerDest, content);
    log.success(
      `Successfully created component 'Header${ext} in ${layoutDir.replace(
        /\\/g,
        "/"
      )}`
    );
  } else {
    log.warn("Header template component not found, skipping");
  }

  // copy ExampleCard component
  const exampleCardSrc = path.join(
    templateDir,
    "components", // sub-folder
    `ExampleCard${ext}`
  );

  const exampleCardDest = path.join(componentsDir, `ExampleCard${ext}`);

  if (fs.existsSync(exampleCardSrc)) {
    let content = fs.readFileSync(exampleCardSrc, "utf8");

    if (!isTS) {
      // remove TS types for JS projects
      content = content.replace(/: [A-Za-z<>[\]|{}]+/g, "");
    }

    fs.writeFileSync(exampleCardDest, content);
    log.success(
      `Successfully created component 'ExampleCard${ext}' in ${componentsDir.replace(
        /\\/g,
        "/"
      )}`
    );
  } else {
    log.warn("ExampleCard template not found, skipping");
  }

  // handle layout file (this file are always overwrite)
  const layoutPath = path.join(appDir, `layout${layoutExt}`);
  const layoutSrc = path.join(templateDir, "app", `layout${layoutExt}`);

  if (fs.existsSync(layoutSrc)) {
    let content = fs.readFileSync(layoutSrc, "utf8");
    if (!isTS) {
      content = content.replace(/: [A-Za-z<>[\]|{}]+/g, "");
      content = content.replace(/import type.*\n/, "");
    }
    fs.writeFileSync(layoutPath, content);
    log.success(
      `Successfully overwritten layout${layoutExt} in ${appDir} with ThemeProvider`
    );
  } else {
    log.warn("Layout template code not found, skipping");
  }

  // copy page file (always overwrite)
  const pagePath = path.join(appDir, `page${layoutExt}`);
  const pageSrc = path.join(templateDir, "app", `page${layoutExt}`);

  if (fs.existsSync(pageSrc)) {
    let content = fs.readFileSync(pageSrc, "utf8");
    if (!isTS) {
      content = content.replace(/: [A-Za-z<>[\]|{}]+/g, "");
    }
    fs.writeFileSync(pagePath, content);
    log.success(`Successfully overwritten page${layoutExt} in ${appDir}`);
  } else {
    log.warn("Page template code not found, skipping");
  }

  return { appDir, componentsDir };
}

// print success message
function printSuccessMessage(packageManager, appDir) {
  const isTS = isTypeScriptProject();
  const ext = isTS ? "" : "";

  const importHeaderPath =
    appDir === "src/app"
      ? "@/src/app/components/layout/Header"
      : "@/app/components/layout/Header";

  const importExampleCardPath =
    appDir === "src/app"
      ? "@/src/app/components/ExampleCard"
      : "@/app/components/ExampleCard";

  // success msg
  console.log("\n" + chalk.green.bold("Theme toggle setup complete!"));

  // ---------- Next steps ----------

  console.log("\n" + chalk.bold("Next steps:") + "\n");

  // Step 1: ThemeProvider
  console.log(
    chalk.yellow(
      "1. Wrap your application with ThemeProvider (unless you love chaos):"
    )
  );
  console.log(chalk.gray("   // Typically added in layout.tsx"));

  // Step 2: Header import
  console.log(
    "\n" +
      chalk.yellow(
        "2. Import the Header component (fix the path if it cries):"
      )
  );
  console.log(chalk.gray(`   import Header from "${importHeaderPath}${ext}"`));
  console.log(chalk.gray("   // If path aliases are not configured, use:"));
  console.log(
    chalk.gray('   // import Header from "./components/layout/Header"')
  );

  // Step 3: ExampleCard import
  console.log(
    "\n" +
      chalk.yellow(
        "3. Import the ExampleCard component (yes, another path check):"
      )
  );
  console.log(
    chalk.gray(`   import ExampleCard from "${importExampleCardPath}${ext}"`)
  );
  console.log(
    chalk.gray('   // Alt: import ExampleCard from "./components/ExampleCard"')
  );

  // Step 4: Use the components
  console.log(
    "\n" +
      chalk.yellow(
        "4. Add <Header /> and <ExampleCard /> into page.tsx."
      )
  );

  // Step 5: global.css confirmation
  console.log(
    "\n" +
      chalk.yellow(
        "5. global.css has been updated (if not already present):"
      )
  );
  console.log(
    chalk.gray(
      '   • Added dark variant support (@variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));'
    )
  );
  console.log(
    chalk.gray("   • Added Smooth transitions (so your eyes don’t bleed)")
  );
  console.log(
    chalk.gray(
      "   • Feel free to adjust or remove these styles to suit your needs."
    )
  );

  // Step 6: Run Dev Server
  console.log("\n" + chalk.yellow("6. Run your development server:"));
  console.log(
    chalk.gray(
      "   npm run dev   |   yarn dev   |   pnpm dev | whatever makes you happy"
    )
  );

  // console.log(
  //   "\n" +
  //     chalk.green(
  //       "The theme toggle now lives in the header with dark/light mode switching!"
  //     )
  // );
  console.log(
    "\n" +
      chalk.green.bold(
        "The theme toggle now lives in the header with dark/light mode switching!"
      )
  );

  // console.log(
  //   chalk.yellow(
  //     `All files dumped into ${appDir}/components/ (existing files overwritten)`
  //   )
  // );
}

// main function
async function main() {
  try {
    const args = process.argv.slice(2);
    const skipTailwind = args.includes("--no-tailwind") || args.includes("-T");

    log.title("\n🚀 Setting up Next.js theme toggle...\n");

    // Step 1: Verify Next.js project
    const packageJson = checkNextJsProject();
    const packageManager = detectPackageManager();
    log.info(`Using ${packageManager} package manager`);

    let isFreshTailwindInstall = false;

    // Step 2: Handle Tailwind (unless skipped)
    if (!skipTailwind) {
      const tailwindResult = await setupTailwind(packageManager);
      isFreshTailwindInstall = tailwindResult?.freshInstall || false;

      // Setup globals.css based on whether it's a fresh install or existing
      setupGlobalsCss(isFreshTailwindInstall);
    } else {
      log.warn("Skipping Tailwind setup (--no-tailwind flag)");
    }

    // Step 3: Install dependencies
    await installDependencies(packageJson, packageManager);

    // Step 4: Copy template files
    const { appDir, componentsDir } = copyTemplateFiles();
    console.log();
    // Step 5: Success message
    printSuccessMessage(packageManager, appDir);
  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle process termination gracefully (ctrl+c)
process.on("SIGINT", () => {
  console.log("\n" + chalk.yellow("Setup cancelled by user"));
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  log.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});

main();