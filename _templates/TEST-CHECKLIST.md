# Live Site Test Checklist

Once you have turned on GitHub Pages in `_templates/SETUP.md`, run through this short checklist on your phone and PC to make sure everything is working smoothly.

## 1. Basic Pages and Links
- [ ] Open the **Home** page: verify the title, pitch, current build (`v0.17.0`, `23 Oct 2026`), "Working on now" note, overall progress bars, and the three newest dev log posts all appear.
- [ ] Click every signpost in the scene at the top (**Home**, **Dev Log**, **Roadmap**, **Builds**, **Art**, **Gallery**, **About**): Katie walks over and the page opens. None should lead to a broken address.
- [ ] On a PC, walk Katie with the arrow keys (or A and D) and press **E** at a sign. On a phone, tap the ground to walk her there.
- [ ] On the Home page, drag across the dirt in **Fresh from the dig** until the screenshot is uncovered, then try **Bury it again**.
- [ ] Visit a made-up address on your site (such as `/nothing-here`) and check that your styled **404 ("Nothing in This Layer")** page appears with working links back to Home.

## 2. Phone Layout and Theme Toggle
- [ ] Open the site on your phone (or narrow your browser window to 360 px wide) and check that there is **no sideways scrolling** on any page.
- [ ] Tap the **Menu** button on your phone and confirm the navigation links open and close cleanly.
- [ ] Tap the **Night** button in the header:
  - [ ] Check that the sky turns to night with stars and a moon, and that all text stays easy to read.
  - [ ] Refresh the page and confirm the site remembers your dark/light choice.

## 3. Dev Log, Specimen Numbers and Tag Filter
- [ ] Open **Dev Log** and check that the three starting posts are numbered in chronological order (`Find no. 1` for 12 Oct 2026, `Find no. 2` for the 0.17.0 post and `Find no. 3` for the welcome post, both 23 Oct 2026).
- [ ] Tap each tag filter button (`feature`, `fix`, `art`, `sound`, `playtest`, `news`, `All`) and verify the post list updates and counts how many posts match.
- [ ] Open a post and test the **Earlier find** and **Newer find** links at the bottom.
- [ ] Tap **Subscribe via RSS** (or visit `/feed.xml`) and check that the Atom/RSS XML feed loads.

## 4. Roadmap, Builds, Art and Gallery Fallbacks
- [ ] Open **Roadmap** and check that **Planned** is at the top, **Digging now** is in the middle, and **Done** is at the bottom.
- [ ] Open **Builds** and check that `0.17.0` is listed above `0.16.2`.
- [ ] Open **Art** while all totals are `0` and confirm it shows `0 / 0 (0%)` cleanly with no `NaN` or division errors.
- [ ] If a post's cover picture hasn't been uploaded yet, check it shows the **"Photo To Come"** card instead of a broken image icon.
- [ ] Confirm that no empty social buttons (Discord, Steam, TikTok, Instagram, YouTube) appear anywhere while their links in `_config.yml` are still `""`.
