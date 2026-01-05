# Web Push Node

This is an n8n community node that lets you send Web Push notifications in your n8n workflows.

Web Push is a standardized protocol that allows you to send push notifications directly to users' browsers, even when they're not actively using your website. This node enables you to integrate push notifications into your automation workflows, making it perfect for real-time alerts, updates, and engagement campaigns.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Compatibility](#compatibility)
- [Usage](#usage)
- [Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation

1. Go to **Settings** > **Community Nodes** in your n8n instance
2. Select **Install**
3. Enter `n8n-nodes-web-push` in the **Enter npm package name** field
4. Agree to the risks and select **Install**

Alternatively, install via npm in your n8n installation directory:

```bash
npm install n8n-nodes-web-push
```

## Operations

This node supports sending Web Push notifications with the following capabilities:

### Send Push Notification

Sends a push notification to a subscribed user's browser.

**Required Parameters:**

- **Endpoint**: The push subscription endpoint URL from the user's browser subscription
- **Auth**: The authentication secret from the push subscription
- **P256dh**: The P256dh public key from the push subscription
- **Payload**: The notification message/data to send

**Optional Parameters:**

- **TTL** (Time To Live): How long the push service should attempt to deliver the message (default: 4 weeks)
- **Urgency**: Priority level of the notification (`very-low`, `low`, `normal`, or `high`)
- **Topic**: Categorization identifier for the notification (max 32 characters)
- **Timeout**: Request timeout in milliseconds (default: 30000)

## Credentials

This node uses VAPID (Voluntary Application Server Identification) for authentication, which is the standard way to identify your application server to push services.

### Prerequisites

1. Generate VAPID keys for your application. You can do this using the `web-push` npm package:

```bash
npx web-push generate-vapid-keys
```

This will output a public and private key pair that you'll use for authentication.

2. Set up a push subscription in your web application using the Push API and Service Workers

### Setting Up VAPID Credentials

1. In n8n, go to **Credentials** > **New**
2. Search for "VAPID API" and select it
3. Fill in the following fields:
   - **Subject**: A contact URI for your application (e.g., `mailto:admin@yourdomain.com` or `https://yourdomain.com`)
   - **Public Key**: Your VAPID public key (base64url-encoded)
   - **Private Key**: Your VAPID private key (base64url-encoded)
   - **GCM API Key** (optional): Google Cloud Messaging API key for backward compatibility with older Chrome versions
4. Click **Create**

### Getting Push Subscription Details

To send notifications, you need the subscription details from your users' browsers. In your web application:

```javascript
// Example: Get push subscription from browser
const registration = await navigator.serviceWorker.ready;
const subscription = await registration.pushManager.subscribe({
	userVisibleOnly: true,
	applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY',
});

// subscription.endpoint - Use for "Endpoint" parameter
// subscription.keys.auth - Use for "Auth" parameter
// subscription.keys.p256dh - Use for "P256dh" parameter
```

Store these subscription details in your database and use them in your n8n workflow.

## Compatibility

- **Minimum n8n version**: 0.198.0
- **Tested with**: n8n 1.0.0+
- **Node version**: Requires Node.js 18+

This node uses the `web-push` library v3.6.7 which supports:

- Chrome 50+
- Firefox 44+
- Edge 17+
- Safari 16+ (macOS 13+, iOS 16.4+)
- Opera 37+

## Usage

### Basic Example

Here's a simple workflow to send a push notification:

1. **Add the Web Push node** to your workflow
2. **Configure credentials**: Select or create VAPID API credentials
3. **Set subscription details**:
   - Endpoint: `{{ $json.subscription.endpoint }}`
   - Auth: `{{ $json.subscription.keys.auth }}`
   - P256dh: `{{ $json.subscription.keys.p256dh }}`
4. **Set payload**: Enter your notification message or use JSON data

### Example Workflow Scenarios

**User Registration Notification**

```
Trigger: Webhook (new user signup)
→ Database: Store user subscription
→ Web Push: Send welcome notification
```

**Alert System**

```
Trigger: Schedule/Cron
→ HTTP Request: Check system status
→ IF: Status is down
  → Web Push: Send alert to admin subscriptions
```

**Breaking News Updates**

```
Trigger: RSS Feed
→ Database: Get all subscribed users
→ Split In Batches
  → Web Push: Send notification to each subscriber
```

### Important Notes

- **Payload Format**: The payload should be a string. If you want to send structured data, stringify your JSON first
- **Service Workers Required**: Users must have a service worker registered in their browser to receive notifications
- **HTTPS Required**: Web Push only works on HTTPS websites (or localhost for development)
- **User Permissions**: Users must grant notification permissions in their browser
- **Subscription Management**: Store and manage user subscriptions in your own database
- **Error Handling**: Handle expired or invalid subscriptions gracefully (410/404 responses mean the subscription is no longer valid)

### Notification Payload Best Practices

When sending notifications, keep these tips in mind:

- Keep messages concise and actionable
- Include relevant information in the payload
- Use urgency levels appropriately (reserve `high` for critical alerts)
- Set reasonable TTL values based on message relevance
- Test notifications across different browsers

### Troubleshooting

**"Invalid subscription" errors:**

- The subscription may have expired or been unsubscribed
- Remove invalid subscriptions from your database when you receive 410 Gone responses

**"Unauthorized" errors:**

- Check that your VAPID keys are correct
- Ensure the public key used in the browser matches your credentials

**"Endpoint not found" errors:**

- The push service endpoint may have changed
- Request users to re-subscribe

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Web Push Protocol (RFC 8030)](https://tools.ietf.org/html/rfc8030)
- [VAPID Specification (RFC 8292)](https://tools.ietf.org/html/rfc8292)
- [MDN Web Push API](https://developer.mozilla.org/en-US/docs/Web/API/Push_API)
- [web-push library documentation](https://github.com/web-push-libs/web-push)
- [Google Web Push Guide](https://web.dev/push-notifications-overview/)

## License

[MIT](LICENSE.md)
