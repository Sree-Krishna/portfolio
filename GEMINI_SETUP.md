# Portfolio Chat Integration Setup

## Gemini API Configuration

### 1. Get Your Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key for your project
- Copy the key

### 2. Add to Environment Variables
Create a `.env.local` file in the project root (never commit this):

```
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

Or copy from `.env.example` and fill in your key:
```bash
cp .env.example .env.local
```

Then edit `.env.local` and paste your actual API key.

### 3. How It Works

When a user pastes a job description in the chat widget:
1. The JD text is sent to Gemini 1.5 Flash via API
2. Gemini analyzes your portfolio skills and projects for relevance
3. Returns a structured response with:
   - **Relevant skills** (split into development & ML)
   - **Relevant projects** (filtered list)
   - **Brief explanation** of why these match
4. The Skills and Projects sections update in real-time to show only relevant items

### 4. Features

- **Fallback handling**: If API fails or key is missing, uses keyword-matching fallback
- **JSON validation**: Ensures responses match the portfolio data structure
- **Chat feedback**: User sees confirmation message in the chat when processing completes
- **Zero configuration in production**: Just set the env var

### 5. API Limits

- Gemini 1.5 Flash has generous free tier (15 RPM)
- Each request is ~1-2 tokens typical for job descriptions
- No cost for most usage during development

## For GitHub Pages Hosting

Your portfolio is hosted on GitHub Pages. Since `.env.local` is **not** pushed to git, you need to inject the API key at build time:

### Setup GitHub Secret

1. Go to your GitHub repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `GEMINI_API_KEY`
4. Value: Paste your actual Gemini API key
5. Click **Add secret**

### How It Works

The GitHub Actions workflow (`.github/workflows/deploy.yml`) now:
1. Checks out your code
2. Creates `.env.local` with the secret at **build time** (never committed)
3. Builds the portfolio with the embedded key
4. Deploys the static build to GitHub Pages

**Security note:** The API key is only visible in build logs (if you have logs public). Keep it private and rotate it if exposed.

### Verify It's Working

1. Push your changes to `main`
2. Go to repo → **Actions** → watch the deploy workflow run
3. Once complete, visit your hosted portfolio
4. Open the chat widget and paste a JD—it should work without any manual env setup

## Testing Locally

1. Start the dev server: `npm run dev`
2. Open the portfolio
3. Click the "Role Chat" button in the bottom-right
4. Paste a job description
5. Watch Skills & Projects sections update

## Troubleshooting

**Chat says "API fallback" or doesn't update sections:**
- Check `.env.local` exists in project root (local) or GitHub secret is set (hosted)
- Verify API key is correct and has quota remaining
- Check browser console for error messages

**Build fails on GitHub:**
- Make sure `GEMINI_API_KEY` secret is added to the repo
- Check workflow logs for details
