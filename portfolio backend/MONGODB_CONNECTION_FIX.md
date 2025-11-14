# MongoDB Connection Fix for EC2 Docker

## The Problem

The error `Failed looking up SRV record for '_mongodb._tcp.cluster0.xxxxx.mongodb.net'` indicates:

1. **Placeholder connection string**: Your `docker-compose.yml` had `cluster0.xxxxx.mongodb.net` instead of your actual cluster name
2. **DNS resolution issues**: Docker containers on EC2 sometimes have trouble resolving DNS, especially for SRV records

## Solution Applied

### 1. Fixed Connection String

Updated `docker-compose.yml` with your actual MongoDB Atlas connection string:
```yaml
- MONGODB_URI=mongodb+srv://arikanmberkay:6XKbchdUE2ElF5Z8@kafeinproje.dtym1nn.mongodb.net/portfolio?retryWrites=true&w=majority&appName=KafeinProje
```

### 2. Added DNS Configuration

Added Google DNS servers to help with DNS resolution:
```yaml
dns:
  - 8.8.8.8
  - 8.8.4.4
```

## Additional Steps to Verify

### Step 1: Verify MongoDB Atlas Network Access

1. Go to **MongoDB Atlas** → **Security** → **Network Access**
2. Make sure your **EC2 instance's public IP** is whitelisted
   - Or use `0.0.0.0/0` for development (not recommended for production)
3. If you just added the IP, wait 1-2 minutes for changes to propagate

### Step 2: Test DNS Resolution from EC2

SSH into your EC2 instance and test:

```bash
# Test DNS resolution
nslookup kafeinproje.dtym1nn.mongodb.net

# Test SRV record lookup
nslookup -type=SRV _mongodb._tcp.kafeinproje.dtym1nn.mongodb.net
```

If these fail, there might be DNS issues with your EC2 instance.

### Step 3: Test from Inside Docker Container

```bash
# Enter the container
docker exec -it portfolio-backend sh

# Test DNS
nslookup kafeinproje.dtym1nn.mongodb.net

# Test connectivity
ping -c 3 kafeinproje.dtym1nn.mongodb.net
```

### Step 4: Verify MongoDB Credentials

Double-check:
- Username: `arikanmberkay`
- Password: `6XKbchdUE2ElF5Z8`
- Database: `portfolio`

You can test the connection string locally using MongoDB Compass or `mongosh`.

### Step 5: Restart Docker Container

After updating `docker-compose.yml`:

```bash
# Stop the container
docker-compose down

# Start again
docker-compose up -d

# Check logs
docker-compose logs -f portfolio-backend
```

## Alternative: Use Standard Connection String (Non-SRV)

If SRV records continue to cause issues, you can use a standard connection string format:

1. Go to **MongoDB Atlas** → **Connect** → **Connect your application**
2. Choose **"Standard connection string"** instead of "SRV connection string"
3. It will look like:
   ```
   mongodb://arikanmberkay:6XKbchdUE2ElF5Z8@kafeinproje-shard-00-00.dtym1nn.mongodb.net:27017,...
   ```

Update `docker-compose.yml`:
```yaml
- MONGODB_URI=mongodb://arikanmberkay:6XKbchdUE2ElF5Z8@kafeinproje-shard-00-00.dtym1nn.mongodb.net:27017,kafeinproje-shard-00-01.dtym1nn.mongodb.net:27017,kafeinproje-shard-00-02.dtym1nn.mongodb.net:27017/portfolio?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

## Troubleshooting DNS Issues on EC2

If DNS resolution is still failing:

### Option 1: Configure EC2 DNS

Edit `/etc/resolv.conf` on EC2:
```bash
sudo nano /etc/resolv.conf
```

Add:
```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

### Option 2: Use Docker's DNS Options

In `docker-compose.yml`, you can also add:
```yaml
services:
  portfolio-backend:
    # ... other config ...
    dns_search:
      - mongodb.net
```

### Option 3: Use Host Network Mode (Not Recommended)

Only use if absolutely necessary:
```yaml
services:
  portfolio-backend:
    network_mode: "host"
    # Remove networks section if using this
```

## Security Reminder

⚠️ **IMPORTANT**: The connection string in `docker-compose.yml` contains your MongoDB password. 

**For production:**
1. Use `.env` file instead
2. Or use AWS Secrets Manager
3. Never commit `docker-compose.yml` with real credentials to Git

## Verify It's Working

After applying fixes, check the logs:
```bash
docker-compose logs -f portfolio-backend
```

You should see:
- ✅ `MongoClient with metadata` created successfully
- ✅ No more `Failed looking up SRV record` errors
- ✅ Application starts without MongoDB connection errors

Test the health endpoint:
```bash
curl http://localhost:8080/actuator/health
```

Should return:
```json
{
  "status": "UP",
  "components": {
    "mongo": {
      "status": "UP"
    }
  }
}
```

