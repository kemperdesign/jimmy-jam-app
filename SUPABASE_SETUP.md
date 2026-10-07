# Supabase Database Setup Guide

This guide will help you set up the Supabase database for the Jimmy Jam app.

## 1. Create a Supabase Project

1. Go to https://supabase.com and sign up/log in
2. Click "New Project"
3. Enter a project name (e.g., "jimmy-jam-app")
4. Set a database password
5. Choose a region closest to your users
6. Wait for the project to be created

## 2. Get Your Credentials

1. In your Supabase dashboard, go to "Settings" > "API"
2. Copy the following values:
   - **Project URL** (REACT_APP_SUPABASE_URL)
   - **anon public key** (REACT_APP_SUPABASE_ANON_KEY)

3. Create a `.env.local` file in the project root:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Create Database Tables

Go to the Supabase SQL Editor and run these SQL commands:

### BBQ Slam Teams Table
```sql
CREATE TABLE bbq_slam_teams (
  id BIGSERIAL PRIMARY KEY,
  team_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  members_count INTEGER,
  bbq_style TEXT,
  experience_level TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE bbq_slam_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON bbq_slam_teams
  FOR INSERT WITH CHECK (true);
```

### BBQ Slam Vendors Table
```sql
CREATE TABLE bbq_slam_vendors (
  id BIGSERIAL PRIMARY KEY,
  business_name TEXT NOT NULL,
  category TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  description TEXT,
  booth_size TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE bbq_slam_vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON bbq_slam_vendors
  FOR INSERT WITH CHECK (true);
```

### Car Show Entries Table
```sql
CREATE TABLE car_show_entries (
  id BIGSERIAL PRIMARY KEY,
  owner_name TEXT NOT NULL,
  car_make TEXT NOT NULL,
  car_model TEXT NOT NULL,
  car_year INTEGER,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  category TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE car_show_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON car_show_entries
  FOR INSERT WITH CHECK (true);
```

### Assistance Applications Table
```sql
CREATE TABLE assistance_applications (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  assistance_type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE assistance_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON assistance_applications
  FOR INSERT WITH CHECK (true);
```

### Newsletter Subscribers Table
```sql
CREATE TABLE newsletter_subscribers (
  id BIGSERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);
```

## 4. Test the Connection

1. Run `npm start` to start the development server
2. Try submitting a form from the app
3. Check the Supabase dashboard to see if data is being saved
4. Go to "Table Editor" to view your submissions

## 5. View Your Data

In the Supabase dashboard:
1. Go to "Table Editor"
2. Select any table to view the submissions
3. You can add filters, search, and manage records

## 6. Authentication (Optional)

To add user authentication later:
1. Go to "Authentication" in Supabase
2. Click "Providers" and enable your desired auth methods
3. Update the app code to use `supabase.auth.signUp()` and `supabase.auth.signIn()`

## Troubleshooting

- **"No anon key"**: Check that you copied the anon public key (not the service role key)
- **"Permission denied"**: Make sure RLS policies are set correctly (see SQL above)
- **"Table does not exist"**: Verify the table name matches exactly in your code

## Security Notes

- The anon key is public (safe to expose)
- Never commit `.env.local` to version control
- Use RLS (Row Level Security) policies to protect data
- Consider adding Supabase Realtime for live updates
