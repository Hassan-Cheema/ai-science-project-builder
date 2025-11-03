# 🚀 Vercel Deployment Checklist

## ✅ Pre-Deployment Checks

### 1. Code Quality
- ✅ TypeScript: No errors (`npm run type-check`)
- ✅ ESLint: No critical errors (`npm run lint`)
- ✅ Build: Successful production build (`npm run build`)
- ✅ All dependencies installed and up-to-date

### 2. Environment Variables Required

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key (required for all AI features)

**Highly Recommended:**
- `NEXT_PUBLIC_BASE_URL` - Your Vercel deployment URL (e.g., `https://your-app.vercel.app`)

**Optional (for additional features):**
- `STRIPE_SECRET_KEY` - For payment processing
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - For Stripe checkout
- `NEXT_PUBLIC_SUPABASE_URL` - For database features
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - For Supabase authentication
- `SUPABASE_SERVICE_ROLE_KEY` - For Supabase admin operations
- `UPSTASH_REDIS_REST_URL` - For caching and rate limiting
- `UPSTASH_REDIS_REST_TOKEN` - For Upstash Redis
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - For Google Analytics
- `SENTRY_DSN` - For error monitoring
- `ENABLE_IMAGE_GENERATION` - Set to `"true"` to enable DALL-E image generation
- `ENABLE_VECTOR_SEARCH` - Set to `"true"` to enable vector search
- `ENABLE_CODE_GENERATION` - Set to `"true"` to enable code generation (default: true)

### 3. Edge Runtime Compatibility
- ✅ Edge runtime routes: `/api/runEssay`, `/api/runImage`
- ✅ All edge routes use compatible APIs (no Node.js-specific modules)
- ✅ Buffer API handled with fallback for edge runtime

### 4. Build Configuration
- ✅ Next.js 15.5.6 configured
- ✅ TypeScript compilation enabled
- ✅ Image optimization configured
- ✅ Security headers configured
- ✅ Caching headers optimized

---

## 📋 Step-by-Step Vercel Deployment

### Step 1: Prepare Your Repository
1. Ensure all code is pushed to GitHub
2. Verify `.gitignore` excludes sensitive files (`.env.local`, `.next`, `node_modules`)
3. Confirm `package.json` has all required dependencies

### Step 2: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with your GitHub account
3. Import your GitHub repository

### Step 3: Configure Project Settings
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (auto-detected)
5. **Install Command**: `npm install` (default)
6. **Node.js Version**: 20.x (recommended)

### Step 4: Add Environment Variables
Go to **Settings → Environment Variables** and add:

```bash
# REQUIRED
OPENAI_API_KEY=sk-your-openai-key-here

# REQUIRED (update after first deployment)
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app

# OPTIONAL - Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key

# OPTIONAL - Supabase (if using database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OPTIONAL - Upstash Redis (if using caching)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# OPTIONAL - Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# OPTIONAL - Error Monitoring
SENTRY_DSN=https://your-sentry-dsn

# OPTIONAL - Feature Flags
ENABLE_IMAGE_GENERATION=true
ENABLE_VECTOR_SEARCH=false
ENABLE_CODE_GENERATION=true
```

**Important:** 
- Add environment variables for **Production**, **Preview**, and **Development** environments
- After first deployment, update `NEXT_PUBLIC_BASE_URL` with your actual Vercel URL

### Step 5: Deploy
1. Click **Deploy**
2. Wait for build to complete (usually 2-3 minutes)
3. Check build logs for any errors

### Step 6: Update Base URL
After first deployment:
1. Copy your Vercel deployment URL (e.g., `https://ai-student-hub.vercel.app`)
2. Go to **Settings → Environment Variables**
3. Update `NEXT_PUBLIC_BASE_URL` to your actual URL
4. Redeploy to apply changes

---

## 🔍 Post-Deployment Verification

### 1. Test Your Deployment
- [ ] Homepage loads correctly
- [ ] All tool pages are accessible
- [ ] API routes respond correctly
- [ ] Error handling works
- [ ] Forms submit successfully

### 2. Test API Endpoints
Test these endpoints after deployment:
```bash
# Test Essay Generator
curl -X POST https://your-app.vercel.app/api/runEssay \
  -H "Content-Type: application/json" \
  -d '{"topic":"Climate Change","words":"500","essayType":"classic"}'

# Test Project Builder
curl -X POST https://your-app.vercel.app/api/runProject \
  -H "Content-Type: application/json" \
  -d '{"topic":"Volcano","grade":"8","budget":"Low","goal":"Demo"}'
```

### 3. Check Edge Runtime
- [ ] Edge routes (`/api/runEssay`, `/api/runImage`) work correctly
- [ ] No Node.js-specific errors in edge runtime

### 4. Monitor Performance
- Check Vercel Analytics dashboard
- Monitor API usage and costs
- Watch for any build errors

---

## 🛠️ Troubleshooting

### Build Fails
**Issue**: Build fails with TypeScript errors
**Solution**: Run `npm run type-check` locally and fix errors

**Issue**: Build fails with missing dependencies
**Solution**: Ensure `package.json` includes all dependencies, run `npm install` locally first

### Runtime Errors
**Issue**: "OPENAI_API_KEY is not configured"
**Solution**: Add `OPENAI_API_KEY` to Vercel environment variables

**Issue**: Edge runtime errors
**Solution**: Check that edge routes don't use Node.js-specific modules

**Issue**: API routes return 500 errors
**Solution**: Check Vercel function logs, verify environment variables are set

### Environment Variables Not Working
**Issue**: Variables starting with `NEXT_PUBLIC_` not available
**Solution**: Variables must be added for the correct environment (Production/Preview/Development)

**Issue**: Variables updated but not reflected
**Solution**: Redeploy the application after adding/updating environment variables

---

## 📊 Vercel Configuration Tips

### Optimize Build Performance
- Use Vercel's caching for `node_modules`
- Enable "Automatically optimize images"
- Use Edge Runtime for API routes when possible

### Cost Optimization
- Monitor OpenAI API usage
- Set up rate limiting if needed
- Consider using Upstash Redis for caching

### Security
- Never commit `.env.local` files
- Use Vercel's environment variables for secrets
- Enable Vercel's DDoS protection

---

## 🔄 Continuous Deployment

### Automatic Deployments
Vercel automatically deploys:
- Every push to `main` branch → Production
- Every push to other branches → Preview

### Manual Deployments
1. Go to **Deployments** tab
2. Click **Redeploy** on any deployment
3. Or use Vercel CLI: `vercel --prod`

---

## 📝 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)
- [Edge Runtime Guide](https://vercel.com/docs/concepts/functions/edge-functions)

---

## ✅ Final Checklist Before Deployment

- [ ] Code is pushed to GitHub
- [ ] `npm run build` succeeds locally
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] Environment variables are documented
- [ ] `.env.local` is in `.gitignore`
- [ ] No sensitive data in code
- [ ] README is updated
- [ ] All tests pass (if any)

---

**Ready to deploy?** Follow the steps above and you'll have your app live on Vercel in minutes! 🚀

