# Complete Beginner's Guide to Setting Up Your Website

This guide walks you through putting the Project Paleo website online for free using GitHub Pages. You do not need to install any software on your PC, and you do not need to use the command line. Everything is done in your web browser.

---

## Step 1: Create a GitHub Account and Turn On Two-Factor Sign-In

1. Go to **https://github.com** and click **Sign up**.
2. Choose a username.
   - **Tip:** If you choose a username like `projectpaleo` or `jodigs`, your website address can be `https://projectpaleo.github.io`.
3. Verify your email address when GitHub sends you a code.
4. **Turn on Two-Factor Authentication (2FA)** so nobody else can ever get into your account:
   - Click your profile picture in the top-right corner of GitHub and choose **Settings**.
   - In the left menu, click **Password and authentication**.
   - Under **Two-factor authentication**, click **Enable two-factor authentication** and follow the steps using an authenticator app on your phone (or text messages), and save your recovery codes somewhere safe.

---

## Step 2: Create Your Public Repository

Free GitHub Pages requires a public repository. Even though the public can read the files (which is how a website works), **only you** will have permission to edit or add anything.

1. Click the **+** icon in the top-right corner of GitHub and select **New repository**.
2. **Repository name**:
   - **Recommended and simplest option:** Name it `<username>.github.io`, replacing `<username>` with your exact GitHub username (for example, `jodigs.github.io`). With this name, your site lives right at `https://<username>.github.io/` and you do not need to touch `baseurl` in `_config.yml`.
   - **Alternative option:** If you name it something else (such as `project-paleo`), your site will live at `https://<username>.github.io/project-paleo/`. If you pick this route, open `_config.yml` and change `baseurl: ""` to `baseurl: "/project-paleo"`.
3. Select **Public**.
4. Tick **Add a README file** (this creates your `main` branch straight away so you can drag and drop files into it).
5. Click **Create repository**.

---

## Step 3: Upload the Website Files (Drag and Drop)

1. Save all the files from this project onto your PC in a single folder, keeping the exact folder names (`_data`, `_includes`, `_layouts`, `_posts`, `_templates`, `assets/css`, `assets/js`).
   - Also create an empty folder at `assets/img` on your PC and put your first screenshot in it if you have one ready (or wait until later).
2. On your new GitHub repository page in your browser, click the **Add file** button near the top-right and choose **Upload files**.
3. Open the folder on your PC, select all the files and folders (`_config.yml`, `.pages.yml`, `README.md`, `index.html`, `devlog.html`, `roadmap.html`, `builds.html`, `art.html`, `gallery.html`, `about.html`, `404.html`, and the folders `_data`, `_includes`, `_layouts`, `_posts`, `_templates`, `assets`), and **drag and drop them** onto the GitHub upload box in your browser.
4. Wait a few seconds for GitHub to list all the uploaded files.
5. Scroll to the bottom of the page and click the green **Commit changes** button.

---

## Step 4: Turn On GitHub Pages

1. Near the top of your repository page, click **Settings** (the gear tab).
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment**:
   - Set **Source** to **Deploy from a branch**.
   - Under **Branch**, change `None` to **main**, keep the folder next to it as **/ (root)**, and click **Save**.
4. Wait about one to two minutes, then refresh the **Settings -> Pages** page.
5. At the top of that page, you will see a box saying **Your site is live at `https://...`** with a **Visit site** button. Click it to open your live website!

---

## Step 5: Check That Nobody Else Has Write Access

1. Still inside **Settings**, look at the left sidebar and click **Collaborators** (you may be asked to confirm your password or 2FA code).
2. Under **Manage access**, check the list of people:
   - It should say you haven't invited any collaborators yet.
   - As long as nobody is listed there, **only you** can change any file in the repository. Visitors to your website can only read it.

---

## Step 6: What Happens If You Make a Mistake in a File?

Do not worry about breaking your live website when you edit a file!

- Whenever you save a change on GitHub, GitHub Pages builds the site behind the scenes (takes about 45 seconds).
- **If you make a typo in a YAML file** (for example, forgetting quotation marks around a sentence with a colon), **the build fails, GitHub emails you, and your previous working version stays live.** Visitors never see a broken site.
- To see what went wrong:
  1. Click the **Actions** tab at the top of your GitHub repository.
  2. Click the top workflow run marked with a red cross.
  3. Click **build** to see the exact file name and line number that needs fixing.

---

## Optional Step 7: Using Pages CMS for Form-Based Editing

This repository includes a `.pages.yml` file. If you prefer filling in friendly boxes instead of editing raw text files:

1. Go to **https://app.pagescms.org** in your browser.
2. Click **Sign in with GitHub** and authorise it for your repository.
3. Select your repository to see simple forms for **Dev Log Posts**, **Roadmap Strata**, **Playtest Builds**, **Hand-made Art Progress**, **Gallery** and **Site Settings**.
