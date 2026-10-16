# Chinta Dharani: 3D Developer Portfolio

A portfolio website with a 3D desk scene. As a visitor scrolls, the camera moves around the desk and each section appears beside it: About, Journey, Projects, Skills and Contact. Built with Three.js and Vite.

## The one file you edit

`src/data/portfolio.js` holds all the words on the site. Any text that starts with `TODO` stays hidden until you replace it with the real thing. Fill in:

- CGPA
- Internship role titles and dates
- GitHub link for each project
- Email, GitHub, LinkedIn and resume link
- Your programming languages (see the TODO line in `skills`)

## Add project screenshots (optional)

Take a screenshot of each live project, put the picture in the `public` folder, and write its file name in `src/data/portfolio.js` on the `image:` line of that project, for example `image: 'lab.png'`. It then replaces the plain title picture in the project card.

## Run it on your computer

1. Install Node.js (the LTS version) from https://nodejs.org
2. Open a terminal in this folder.
3. Run `npm install` (only the first time).
4. Run `npm run dev` and open the address it prints (usually http://localhost:5173).

## Put it online with GitHub Pages (free)

1. Create a new repository on github.com, for example `portfolio`.
2. Upload all these files to it, keeping the same folders. The folder `.github/workflows` with `deploy.yml` inside must be included. Because its name starts with a dot, your file manager may hide it.
3. On GitHub, open **Settings**, then **Pages**, and set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for "Deploy to GitHub Pages" to finish (about one minute).
5. Your site is live at `https://YOUR-USERNAME.github.io/portfolio/`. Put this link on your resume.

Every time you edit a file and push it, the site updates itself.

## What each file does

| File | Job |
| --- | --- |
| `index.html` | The page shell and fonts |
| `src/main.js` | Starts everything |
| `src/data/portfolio.js` | **Your content** |
| `src/ui/sections.js` | Turns your content into the page sections |
| `src/styles.css` | Colours, fonts and layout |
| `src/state.js` | Remembers which section the visitor is on |
| `src/data/skillIcons.js` | Colours and labels for the skill icons |
| `src/scene/index.js` | Sets up the 3D world and the animation loop |
| `src/scene/desk.js` | The desk |
| `src/scene/laptop.js` | The laptop. Its screen changes for each section |
| `src/scene/props.js` | Mug, phone, glowing button, purple device, headphones |
| `src/scene/lighting.js` | Lights, reflections and the glow under the desk |
| `src/scene/cameraPath.js` | Where the camera goes for each section |
| `src/scene/helpers.js` | Shared tools for building rounded shapes |
| `.github/workflows/deploy.yml` | Publishes the site to GitHub Pages |

## Change the look

- Colours: the `:root` block at the top of `src/styles.css`.
- Camera angles: the `STOPS` list in `src/scene/cameraPath.js`.
- Order or wording of sections: `src/ui/sections.js` and `src/data/portfolio.js`.
