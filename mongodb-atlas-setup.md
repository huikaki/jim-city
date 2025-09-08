# 🌐 MongoDB Atlas Setup (Cloud Database)

This is the **easiest and recommended** way to get MongoDB running without local installation issues.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Sign up with your email
4. Choose "Build a database"
5. Select **M0 Sandbox (FREE)**
6. Choose your preferred cloud provider and region
7. Click "Create Cluster"

## Step 2: Configure Database Access

1. **Create Database User:**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `admin`
   - Password: `admin123` (or generate a secure password)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

2. **Configure Network Access:**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

## Step 3: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 4: Configure Your Application

1. **Replace `<password>` in the connection string with your actual password**

2. **Set the environment variable:**
   ```bash
   export MONGODB_URI="mongodb+srv://admin:admin123@cluster0.onowk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   ```

3. **Or create a `.env` file in the server directory:**
   ```bash
   cd server
   echo 'MONGODB_URI="your-connection-string-here"' > .env
   ```

## Step 5: Start Your Application

```bash
# Seed the database
cd server
npm run seed

# Start the application
cd ..
npm run dev
```

## ✅ Success!

You should see:
```
✅ Connected to MongoDB
✅ Server running on port 5001
✅ 20 sample maids inserted successfully
```

## 🔧 Troubleshooting

### Connection Issues
- Make sure you replaced `<password>` with your actual password
- Check that your IP is whitelisted (or use "Allow Access from Anywhere")
- Verify the database name in the connection string

### Environment Variable Issues
```bash
# Check if the variable is set
echo $MONGODB_URI

# Set it again if needed
export MONGODB_URI="your-connection-string"
```

## 💡 Benefits of MongoDB Atlas

- ✅ No local installation required
- ✅ Always available (cloud-hosted)
- ✅ Free tier with 512MB storage
- ✅ Automatic backups
- ✅ Built-in security features
- ✅ Works from anywhere