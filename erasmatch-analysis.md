# ErasMatch — Full Analysis & Growth Plan

Date: July 23, 2026
Based on: 958 user profiles + 1,170 messages analysed


## PART 1: What the Data Says

### User Numbers
- 958 total signups (all from Reddit, no other marketing)
- 112 active users in last 30 days
- Heavily Irish user base
- Seasonal pattern: big waves at semester start (Sept + Jan), quiet between

### How People Use It
- Users come to find other students going to the same Erasmus city
- Average conversation is 3-5 messages, then they swap Instagrams and leave
- Most popular destinations: Budapest, Lisbon, Barcelona
- Main topics people ask about: housing/accommodation, nightlife, transport, what to pack, finding roommates

### What's Broken
- Referral system: zero invited_by values in the database. Nobody has ever successfully referred someone.
- Profile completion is poor: only 9% wrote a bio, only 25% uploaded a photo
- Users "graduate out" every semester — you lose your entire user base twice a year

### What's Actually Good
- People genuinely find who they're looking for
- The matching concept works — students going to the same city DO want to connect
- 958 signups from Reddit alone with zero budget is strong validation
- The product solves a real, recurring problem (every semester, new students need this)


## PART 2: Product Insights

### Your Product Is a Matchmaker, Not a Chat App
Users don't want to live on ErasMatch. They want to find 3-4 people going to their city, swap Instagrams, and plan together on a platform they already use. That's not a failure — that's your product doing its job. Stop trying to keep people on the site longer. Make the matching faster.

### The Instagram Problem Is Actually an Opportunity
Instead of fighting it, add an Instagram handle field to profiles. Let people see handles upfront. If your product connects people in 2 minutes instead of 20, that's a better product, not a worse one. Users will tell their friends "I found my Erasmus flatmate on ErasMatch in 5 minutes."

### Seasonal Churn Is Normal
Every Erasmus-related product has this. It's not a weakness — it's predictable. You know exactly when users will come (August-September and January) and when they'll leave. Plan around it.


## PART 3: Growth Strategy (To Get More Users)

### Free / Low Effort

1. SEO — City Landing Pages
   Your pages like /erasmus/budapest could rank for "Erasmus Budapest 2027" searches. Students google this constantly. Add real content to these pages: tips, FAQs, what students said about the city. Don't hide everything behind a login wall.

2. Reddit Posts (2x per year)
   Post in r/erasmus, r/studyabroad, and country-specific subs at the start of each semester. Each new semester is a completely new audience — the people who saw your last post have graduated out.

3. ESN Partnerships
   Erasmus Student Network chapters exist at most universities across Europe. They'd probably share your link for free since it directly helps their members. Email the local ESN at the top 10 destination cities.

4. TikTok / Instagram Reels
   Short videos like "I built an app to help Erasmus students find friends" do well. You're a student building for students — that's relatable content. One viral video could 10x your user base overnight.

5. University Facebook Groups
   Every Erasmus intake has a Facebook group ("Erasmus Budapest Spring 2027"). Post there. These groups are where your users already hang out before they find you.

### Medium Effort

6. Turn Message Insights Into Content
   You have 1,170 real messages about what students worry about before Erasmus. Anonymize and turn the common questions into blog posts or city guides. "10 Things Students Wish They Knew Before Erasmus in Budapest" — this is SEO gold.

7. Fix the Referral System
   It's completely broken right now. If you fix it, add a simple incentive: "Invite friends going on Erasmus." Even without incentives, a working share button helps.

8. Add Instagram Handle to Profiles
   Makes the product faster to use. Users connect quicker, have a better experience, tell more people.

### Harder but High Impact

9. Pre-Arrival City Guides
   Take the most common questions from your messages (housing, transport, nightlife) and put answers directly on city pages. This makes your site useful even without signing up, which helps SEO and conversion.

10. Partner with Erasmus Agencies
    Companies that help students apply for Erasmus (like ESNcard, HousingAnywhere, Uniplaces) could cross-promote. "Found your Erasmus placement? Now find your flatmates on ErasMatch."


## PART 4: Could You Sell It?

### Honest Answer
Right now, no. Nobody buys a side project with 112 monthly active users and zero revenue. But that doesn't mean it can't become sellable.

### What Would Make It Sellable

1. Revenue
   You need to make money first. Options:
   - Affiliate deals with student housing platforms (HousingAnywhere, Uniplaces, Spotahome). You already know which cities are popular — link to housing there and earn commission.
   - Sponsored city guides from ESN chapters or local businesses in popular Erasmus cities.
   - Premium features (priority matching, verified profiles, group trip planning). But be careful — students have no money.

2. User Numbers
   You need at least 5,000-10,000 monthly active users before anyone takes a buying conversation seriously. Your current growth rate with Reddit-only marketing won't get there. You'd need at least 2-3 of the growth strategies above working.

3. Recurring Growth
   A buyer needs to know users will keep coming. The seasonal pattern actually helps here — you can show "X users every September, Y users every January, growing Z% year over year." Predictable seasonal growth is a business model (think tax software).

### Who Might Buy It
- Student housing platforms (HousingAnywhere, Spotahome) — your users are their customers
- Student travel companies — your users are about to travel
- ESN or similar organisations — aligns with their mission
- Larger student social platforms — acqui-hire or feature acquisition

### Realistic Valuation
Side projects with a few thousand users typically sell for $5,000-$30,000 on marketplaces like Acquire.com or MicroAcquire. To get there, you'd need revenue (even small) and growing user numbers.


## PART 5: Code Improvements Already Made (July 23, 2026)

### Security Fixes
- Locked down CORS on all 5 Supabase edge functions (was open to any website, now only erasmatch.com)
- Added CSV injection prevention to the data export function
- Added pagination limits to prevent downloading entire database

### Bug Fixes
- Fixed read receipts overwriting instead of appending (was erasing who read a message)
- Fixed N+1 database calls when marking messages as read (was making one call per message instead of one call total)

### Performance
- Removed DataContext (unnecessary wrapper that re-rendered everything)
- Consolidated university data fetching (was fetching the same data in 3 places)
- Removed dead image URL parameters that did nothing
- Simplified avatar error handling

### Dead Code Removed
- Deleted 12 unused files (old forum feature, unused university pages, dead component)
- Removed 12 console.log statements that leaked info to browser console

### GDPR
- Updated privacy policy to accurately describe PostHog analytics usage

### Still To Do
1. Run this SQL in Supabase SQL editor (adds missing delete policy for GDPR account deletion):

   CREATE POLICY "Users can delete own profile"
     ON public.profiles FOR DELETE TO authenticated
     USING (auth.uid() = id);

2. Check that the mark_thread_read function exists in Supabase (it was in the migration file — verify it's deployed)

3. Redeploy edge functions so the CORS changes take effect:
   Run "supabase functions deploy" for each function, or deploy all at once


## PART 6: What to Do Next (Priority Order)

1. Finish the 3 remaining code to-dos above
2. Add Instagram handle field to profiles
3. Fix or remove the broken referral system
4. Write content for your top 3 city pages (Budapest, Lisbon, Barcelona)
5. Post on Reddit for the next semester intake
6. Email 5 ESN chapters in your top cities
7. If you want revenue: sign up for HousingAnywhere or Spotahome affiliate programs and add links to city pages
8. Track growth for 2 semesters. If you hit 5,000+ MAU with revenue, list on Acquire.com
