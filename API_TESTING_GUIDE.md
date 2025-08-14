# WorldFeel API Testing Guide

## 🚀 Quick Start with Postman

### Option 1: Import Collection (Recommended)

1. Download the `worldfeel-api-postman.json` file
2. Open Postman
3. Click "Import" → Select the JSON file
4. The collection will be imported with all endpoints pre-configured

### Option 2: Manual Setup

1. Create a new collection in Postman
2. Set up a collection variable:
   - **Variable Name**: `baseUrl`
   - **Initial Value**: `https://api.worldfeel.org`
   - **Current Value**: `https://api.worldfeel.org`

## 📋 Available Endpoints

### 1. Health Check

- **Method**: GET
- **URL**: `{{baseUrl}}/api/health`
- **Description**: Check if the API server is running
- **Expected Response**:

```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-08-14T18:51:10.916Z"
}
```

### 2. Public Emotion of the Day

- **Method**: GET
- **URL**: `{{baseUrl}}/api/public/emotion-of-the-day`
- **Description**: Get the current emotion and color of the day with usage statistics
- **Expected Response**:

```json
{
  "success": true,
  "data": {
    "emotion": "sad",
    "color": "#395BE7",
    "count": 3,
    "total": 83,
    "timestamp": "2025-08-14T18:51:11.120Z"
}
```

### 3. Get Statistics

- **Method**: GET
- **URL**: `{{baseUrl}}/api/stats`
- **Description**: Get current statistics about submitted emotions
- **Query Parameters** (optional):
  - `yourWord`: Filter stats for a specific word
  - `deviceId`: Filter stats for a specific device
- **Example**: `{{baseUrl}}/api/stats?yourWord=joy&deviceId=test-device`

### 4. Submit Emotion

- **Method**: POST
- **URL**: `{{baseUrl}}/api/submit`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "word": "joy",
  "deviceId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### 5. Get Color for Word

- **Method**: GET
- **URL**: `{{baseUrl}}/api/color?word=joy`
- **Description**: Get the color hex code for a specific emotion word
- **Expected Response**:

```json
{
  "success": true,
  "data": {
    "hex": "#FFEE58"
  }
}
```

### 6. Search Emotions

- **Method**: GET
- **URL**: `{{baseUrl}}/api/emotions/search?q=joy&limit=10`
- **Query Parameters**:
  - `q`: Search query for emotions (required)
  - `limit`: Maximum number of results (1-100, default: 20)
- **Expected Response**:

```json
{
  "success": true,
  "data": ["joyful", "content", "shy"]
}
```

### 7. Flag Content

- **Method**: POST
- **URL**: `{{baseUrl}}/api/flag`
- **Headers**: `Content-Type: application/json`
- **Body**:

```json
{
  "word": "inappropriate-word",
  "reason": "This word is inappropriate"
}
```

## 🧪 Testing Checklist

### Basic Functionality

- [ ] Health check returns 200 OK
- [ ] Public emotion endpoint returns current data
- [ ] Stats endpoint returns statistics
- [ ] Color endpoint returns hex color for valid words
- [ ] Search endpoint returns matching emotions

### Error Handling

- [ ] Invalid emotion words return 404
- [ ] Missing required parameters return 400
- [ ] Rate limiting works (try rapid requests)

### Edge Cases

- [ ] Empty search query returns empty array
- [ ] Search with no results returns empty array
- [ ] Invalid JSON in POST requests returns 400

## 🔧 Testing with cURL

### Quick Tests

```bash
# Health check
curl https://api.worldfeel.org/api/health

# Public emotion
curl https://api.worldfeel.org/api/public/emotion-of-the-day

# Get color for "joy"
curl https://api.worldfeel.org/api/color?word=joy

# Search emotions
curl "https://api.worldfeel.org/api/emotions/search?q=joy&limit=3"

# Submit emotion (POST)
curl -X POST https://api.worldfeel.org/api/submit \
  -H "Content-Type: application/json" \
  -d '{"word": "joy", "deviceId": "550e8400-e29b-41d4-a716-446655440000"}'
```

## 📊 Rate Limits

- **Public API**: 100 requests per minute
- **General API**: 60 requests per minute
- **Health checks**: Unlimited in development

## 🌐 CORS Support

The public API endpoints support CORS for cross-origin requests:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET`
- `Access-Control-Allow-Headers: Content-Type`

## 🐛 Troubleshooting

### Common Issues

1. **SSL Certificate Errors**
   - Ensure you're using `https://` not `http://`
   - Wait for SSL certificate provisioning (5-15 minutes)

2. **404 Errors**
   - Check the URL path is correct
   - Ensure the endpoint exists in the documentation

3. **Rate Limiting**
   - Wait 1 minute between batches of requests
   - Check response headers for rate limit info

4. **CORS Errors**
   - Use the public endpoints for cross-origin requests
   - Ensure proper headers are set

### Debug Commands

```bash
# Test DNS resolution
nslookup api.worldfeel.org

# Test SSL certificate
openssl s_client -connect api.worldfeel.org:443

# Check response headers
curl -I https://api.worldfeel.org/api/health
```

## 📞 Support

For API issues or questions:

- GitHub: https://github.com/spencerdavis226/worldfeel
- API Documentation: https://worldfeel.org/api-docs
