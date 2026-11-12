# Images and uploads

When someone uploads a photo or a logo, it is theirs. A founder's logo cut in half or a mentor's
headshot cropped at the chin tells them we were not paying attention. So Propellant follows one
rule for every image a person gives us: **the interface never crops it on its own.** Only the
person who uploaded it decides what is cut.

## The rule

1. **Never auto crop uploaded images.** Photos and logos that people upload are always shown whole.
   If an image does not match the shape of the space it sits in, it is scaled down to fit and the
   extra space is filled with a quiet background. It is never cut to fill the space.
2. **Resizing is fine.** An image may be scaled up or down to fit its space, as long as it keeps its
   proportions. Never stretch or squash an image.
3. **Cropping happens once, at upload, by the person.** When a space needs a particular shape, such
   as a circle for a profile photo, show a crop step right after upload. The person positions and
   zooms the image within the shape and confirms. What they confirm is what everyone sees.
4. **Start uncropped, unless there is a face.** The crop step opens with the whole image showing,
   so nothing is cut unless the person chooses to cut it. The one exception is a profile photo with
   a face we can detect: then the crop step opens already centered and zoomed on the face, as a
   suggestion the person can adjust or undo.
5. **Only designated images may be auto cropped.** Images we own, such as illustrations, decorative
   backgrounds and stock photography chosen by the design team, may fill a space and be cropped to
   do it. They must be marked as auto croppable explicitly. Anything a person uploaded never is.

## Recommended sizes

Tell people the shape and size that works best before they upload, next to the upload button. These
are the minimums: larger images are welcome, smaller ones still work but may look soft.

| What is uploaded | Shape | Minimum size | How it is shown | Crop step |
| --- | --- | --- | --- | --- |
| Profile photo | Square (1:1) | 400 × 400 px | In a circle | Yes. Suggest a crop on the face when one is detected, otherwise start with the whole photo. |
| Organization or startup logo | Square (1:1) recommended | 400 × 400 px | Whole, on a quiet background | Optional. Starts with the whole logo. |
| Program logo | Square (1:1) | 400 × 400 px | Whole, on a quiet background | Optional. Starts with the whole logo. |
| Program cover image | Wide (16:9) | 1600 × 900 px | Across the top of the program page | Optional. Starts with the whole image. |

For logos, ask for a PNG with a transparent background or an SVG, so the logo sits cleanly on light
and dark surfaces.

Example helper text for an upload field:

> Upload a square image, at least 400 × 400 px. You can adjust how it fits after uploading.

## The crop step

Show the crop step right after a file is chosen, before anything is saved.

- **Show the frame.** Draw the shape the image will appear in (circle, square or 16:9) over the
  image, and dim everything outside it.
- **Start whole.** Fit the whole image inside the frame at first. Only profile photos with a
  detected face start zoomed in on the face, and the person can zoom back out.
- **Let them move and zoom.** Drag to reposition, and zoom with a slider, a pinch or the scroll
  wheel. Arrow keys move the image and plus and minus zoom, so the step works without a mouse.
- **Show a preview.** Show the result at the size it will appear, for example a small circle for a
  profile photo.
- **Use plain buttons.** "Save" keeps the crop. "Use whole image" skips cropping. "Choose another
  image" starts over.
- **Warn, do not block.** If the image is smaller than the recommended minimum, say so gently
  ("This image is smaller than 400 × 400 px and may look blurry") and still allow it.
- **Keep the original.** Store the original file along with the crop, so the person can change the
  crop later without uploading again.

## In code

Propellant components follow the rule for you:

- Components that show people's photos and logos, such as `Avatar`, `PageHeader`, `Card`, `Menu`
  and `PopUpButton`, use `object-fit: contain`. They show the whole image and never crop it.
- `Avatar` and `EmptyState` tiles accept `autoCrop` for images we own. Use it only for designated
  images, never for uploads.

In your own code:

- Use `object-contain` (or `background-size: contain`) for any image a person uploaded, with a
  quiet background behind it, such as `bg-[var(--bg-secondary)]`.
- Use `object-cover` (or `background-size: cover`) only for images designated as auto croppable.
- Never set both a width and a height on an image without an `object-fit`, which stretches it.

## Brand photography

The photos MassChallenge chooses for websites, social posts, slides and print follow the
MassChallenge brand guidelines from MassChallenge Marketing. Everything above about uploads still
applies; this part is about which photos to use and how to treat them.

### Treatments

| Treatment | Use it for |
| --- | --- |
| 01 Overlay | Heroes, social posts and event graphics. A thin hero overlay, a gradient from Navy black `#051925` to Ocean `#037AA6` at 15 to 30% opacity, so warm light glows through. The side with the text is darker and the subject's side stays clear. |
| 02 Full color | Content photos, spaces and people. No overlay and no duotone. |
| 03 Accent rescue | A cool photo with no warmth gets one warm accent, Yellow, Orange or Lime, on a tag, a rule or a subhead. |

The full frame cool duotone is retired, and so are overlays so heavy that the subject disappears.

### Warmth and real work

- Every image carries some warmth: skin tones, natural or lamp light, wood, brick or city lights.
- Show real work and real people: labs, workbenches, prototypes and conversations.
- Judge by eye. If the warm areas go gray or blue under an overlay, the overlay is too heavy.

### Shooting

- Natural light and balanced exposure, with a soft flash for dark rooms.
- Mostly candid, with the occasional founder hero portrait.
- Asymmetric frames that leave room for text, and a range of shots that includes wide ones.
- Shoot RAW and edit only exposure and contrast. No artistic filters and no black and white.

### Avoid

- People on phones or looking bored, visible alcohol, crowds from behind and cluttered
  compositions.
- Black and white photos.
- Generic stock: handshakes, posed smiles, and abstract technology with no people.
- Obviously AI generated images: waxy skin, warped hands or text, impossible lighting, glowing
  suns, lens flares and holograms.

Never present an AI generated image as a real founder, partner or event.

### Where photos come from

1. Our own professional event photography comes first.
2. Licensed stock photography that MassChallenge holds a license for may be used, as long as it
   looks believable and follows the rules on this page. Ask MassChallenge Marketing for it.
3. Location photos for each site (US sites by city, international sites by country) follow the same
   rules.

Text over a photo goes only on a calm, high contrast area. Otherwise move the text, add the hero
overlay, or set it on a solid Navy, Black or Deep Teal block.
