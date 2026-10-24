# How to Update Your Website (From a Phone or PC Browser)

You can update every part of the site from the browser on your phone or PC by opening `github.com`, tapping your repository, and editing small text files.

> **Alternatively:** You can sign in at **https://app.pagescms.org** with GitHub to use web forms for all of the tasks below.

---

## Two Golden Rules of YAML (Read This First)

Before editing any file, remember these two beginner traps:

1. **Colons inside text need quotes:** If your title or sentence has a colon (`:`) inside it, wrap the whole text in double quotes.
   - Good: `title: "Build 0.17.0: Seasons and Quests"`
   - Bad: `title: Build 0.17.0: Seasons and Quests`
2. **Indentation uses spaces:** Line up the hyphen (`-`) and spaces exactly like the entry above it. Copy and paste an existing block so the spacing stays identical.

Remember: if you ever make a mistake, the build fails, GitHub emails you, and the previous version of your site stays live while you fix it.

---

## 1. How to Upload a Screenshot from Your Phone

1. Open your repository on `github.com` in your phone browser.
2. Tap the **`assets`** folder, then tap the **`img`** folder (if `img` does not exist yet, create a file inside `assets/img/` or upload via Pages CMS).
3. Tap the **+** button (or **Add file** -> **Upload files**).
4. Choose a screenshot from your phone's photo library.
   - Give your screenshots simple lowercase names with hyphens, such as `autumn-cottage.png`.
5. Tap **Commit changes** at the bottom.
6. Your picture can now be used anywhere on the site as `"assets/img/autumn-cottage.png"`.

---

## 2. How to Add a Dev Log Post

1. Open the **`_templates`** folder, tap **`post-template.md`**, and copy its text.
2. Go back to your repository root and tap the **`_posts`** folder.
3. Tap **+** (**Add file** -> **Create new file**).
4. In the **Name your file** box, type the date (`YYYY-MM-DD`) followed by a short title in lowercase with hyphens, ending in `.md`:
   - Example: `2026-11-05-new-river-panning.md`
5. Paste the template into the big text box.
6. Edit `title`, `date`, `version` (leave as `""` if not tied to a build), `tags` (choose any of `feature`, `fix`, `art`, `sound`, `playtest`, `news`), `cover` (put `"assets/img/your-photo.png"` or `""` for no photo), and `summary`.
7. Write your post underneath the second `---` line.
8. Scroll down and tap **Commit changes**.
   - The site numbers your new post as the next specimen (`Find no. ...`) and adds it to the Home page, Dev Log and RSS feed.
   - Use today's date or an earlier one. A post dated in the future stays hidden, and only appears the next time you save a change after that date.

---

## 3. How to Update the Roadmap

1. Tap the **`_data`** folder, then tap **`roadmap.yml`**.
2. Tap the **pencil icon** (Edit this file).
3. To move an item between layers, change its `status:` line:
   - `status: planned` puts it in the top layers.
   - `status: digging` puts it in the middle "Digging now" trench.
   - `status: done` moves it down to the deep settled layers at the bottom.
4. You can also add or update `percent: 60` on any item, or add a new block using the format in `_templates/data-templates.yml`.
5. Tap **Commit changes**.

---

## 4. How to Add a Playtest Build

1. Tap **`_data`**, then tap **`builds.yml`**, then tap the **pencil icon**.
2. Copy the top `- version:` block and paste a copy right above it (so the newest build is always at the very top).
3. Update the `version`, `date`, `summary` and `highlights` lines.
4. Tap **Commit changes**.
5. Also update `current_version` and `current_version_date` in `_config.yml` so the stamp at the top of the site matches!

---

## 5. How to Update Placeholder Asset Progress

1. Tap **`_data`**, then tap **`art_progress.yml`**, then tap the **pencil icon**.
2. Find the category you want to update (`Characters`, `Buildings`, `Plants and ground`, `Props`, `UI`, `Sounds`, or `Music`).
3. Change `replaced: 0` and `total: 0` to your real numbers, for example:

       - name: "Characters"
         replaced: 4
         total: 18
         note: "Player sprites, hair styles, Jo, townsfolk and museum visitors."

4. Tap **Commit changes**. The website works out all the percentages and the overall progress bar by itself.

---

## 6. How to Add to the Gallery

1. Tap **`_data`**, then tap **`gallery.yml`**, then tap the **pencil icon**.
2. Add a new item at the top under `items:`:
   - For a screenshot: set `image: "assets/img/your-photo.png"`, `caption: "..."` and `date: "..."`.
   - For a YouTube, TikTok or Instagram video: set `video_url: "https://..."`, `caption: "..."` and `date: "..."`.
   - Put the newest picture first. The first picture in the gallery is also the one buried under the dirt on the Home page for visitors to brush off (unless you choose a different one, see section 7).
3. Tap **Commit changes**.

---

## 7. How to Update Site Settings and Social Links

1. In the main folder of your repository, tap **`_config.yml`**, then tap the **pencil icon**.
2. Here you can edit:
   - `current_version: "0.17.0"`
   - `current_version_date: "23 Oct 2026"`
   - `working_on_now: "Polishing the first two hours from playtest feedback"`
   - `reveal_image: ""` and `reveal_caption: ""` (the picture under the dirt on the Home page; leave both empty to use the first gallery picture)
   - `discord_url: ""` (paste your invite link inside the quotes when ready; the buttons on the Home, About and Footer sections will appear straight away)
   - `steam_url: ""`, `youtube_url: ""`, `tiktok_url: ""`, `instagram_url: ""`
3. Tap **Commit changes**.
