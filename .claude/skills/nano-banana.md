---
name: nano-banana
description: Generate images using Nano Banana 2 (Gemini 3.1 Flash Image) or Nano Banana Pro (Gemini 3 Pro Image) via the local CLI at ~/tools/nano-banana-2. Use when the user asks to generate, create, or edit an image using AI.
---

# nano-banana

AI image generation CLI using Google's Nano Banana 2 (Gemini 3.1 Flash Image Preview) or Nano Banana Pro (Gemini 3 Pro Image Preview).

**CLI location:** `~/tools/nano-banana-2/src/cli.ts`
**Run with:** `~/.bun/bin/bun ~/tools/nano-banana-2/src/cli.ts "prompt" [options]`

## API Key

Requires `GEMINI_API_KEY`. Loaded in priority order:
1. `--api-key` flag
2. `GEMINI_API_KEY` env var
3. `.env` in current working directory
4. `~/.nano-banana/.env`

## Usage

```bash
# Basic generation (Nano Banana 2 / flash model, default)
~/.bun/bin/bun ~/tools/nano-banana-2/src/cli.ts "your prompt"

# Specify output filename and directory
~/.bun/bin/bun ~/tools/nano-banana-2/src/cli.ts "prompt" -o filename -d ./public/images

# Set aspect ratio (16:9 for OG/social images)
~/.bun/bin/bun ~/tools/nano-banana-2/src/cli.ts "prompt" -a 16:9

# Higher quality with Pro model
~/.bun/bin/bun ~/tools/nano-banana-2/src/cli.ts "prompt" -m pro

# Higher resolution (512, 1K, 2K, 4K)
~/.bun/bin/bun ~/tools/nano-banana-2/src/cli.ts "prompt" -s 2K

# Use reference image for style transfer
~/.bun/bin/bun ~/tools/nano-banana-2/src/cli.ts "prompt" -r reference.png

# Full example: OG image for workshop
~/.bun/bin/bun ~/tools/nano-banana-2/src/cli.ts \
  "your prompt here" \
  -a 16:9 -s 2K -m pro \
  -o workshop-og \
  -d /Users/michaljuhas/Projects/ai-with-michal/public
```

## Flags

| Flag | Description | Values |
|------|-------------|--------|
| `-o, --output` | Output filename (no extension) | string |
| `-s, --size` | Resolution tier | 512, 1K, 2K, 4K |
| `-a, --aspect` | Aspect ratio | 1:1, 16:9, 9:16, 4:3, 3:4, 3:2, 2:3, 4:5, 5:4, 21:9 |
| `-m, --model` | Model selection | flash (NB2 default), pro (NB Pro) |
| `-d, --dir` | Output directory | path |
| `-r, --ref` | Reference image(s) | path (repeatable) |
| `-t, --transparent` | Green screen transparency | flag |
| `--api-key` | Override API key | string |
| `--costs` | Show cost history | flag |

## Prompting tips

- Be specific about style: "clean tech aesthetic", "dark background", "professional"
- For text in images: spell out exactly what text to include, keep it short
- For OG/social images: use 16:9, 2K resolution, pro model
- AI-generated text in images can be unreliable — if accuracy matters, generate the background and overlay text with a separate tool (sharp, canvas, etc.)
