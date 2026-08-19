# 📄 Doccenter Node.js / JavaScript SDK

[![npm version](https://img.shields.io/npm/v/doccenter-sdk.svg?style=flat-square)](https://www.npmjs.com/package/doccenter-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Vaib2628/doccenter-sdk)

The official client SDK for the **Doccenter Platform**. Provides seamless Single Sign-On (SSO) authentication, automated token refresh lifecycle, unified S3 document uploads, and secure file management.

---

## 📑 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quickstart](#-quickstart)
- [Authentication Module](#-authentication-module-clientauth)
  - [SSO Login](#1-sso-login)
  - [Get Current User Profile](#2-get-current-user-profile)
  - [Check Authentication State](#3-check-authentication-state)
  - [Manual Token Refresh](#4-manual-token-refresh)
  - [Token Lifecycle Listener](#5-token-lifecycle-listener)
  - [Session Initialization (SSR / Cookies)](#6-session-initialization-ssr--cookies)
  - [Logout](#7-logout)
- [Documents Module](#-documents-module-clientdocuments)
  - [Upload a Document (1-Step)](#1-upload-a-document-1-step)
  - [List & Search Documents](#2-list--search-documents)
  - [Preview / View URL](#3-preview--view-url)
  - [Download URL](#4-download-url)
  - [Share a Document](#5-share-a-document)
  - [Rename / Update Document](#6-rename--update-document)
  - [Delete a Document](#7-delete-a-document)
  - [Create Folders](#8-create-folders)
- [Error Handling](#-error-handling)
- [Configuration Options](#-configuration-options)
- [License](#-license)

---

## ✨ Features

- 🔐 **Single Sign-On (SSO)**: Exchange JWT tokens seamlessly for authenticated sessions.
- 🔄 **Automatic Token Refresh**: Built-in request queueing and mutex logic that handles `401 Unauthorized` without dropping concurrent requests.
- ⚡ **1-Step S3 Upload**: Eliminates multi-step presigned URL boilerplate—upload Buffers, Blobs, Streams, or files in a single line.
- 🛡️ **Robust Error Normalization**: Consistent `DoccenterError` instances for network timeouts, validation failures, and server errors.
- 🧩 **Zero External Friction**: Built on lightweight, standard dependencies compatible with Node.js `>= 16`.

---

## 📦 Installation

```bash
# Using npm
npm install doccenter-sdk

# Using yarn
yarn add doccenter-sdk

# Using pnpm
pnpm add doccenter-sdk
```

---

## 🚀 Quickstart

### CommonJS (Node.js)
```javascript
const Doccenter = require('doccenter-sdk');

const client = new Doccenter({
    apiKey: 'your_doccenter_api_key',
    baseURL: 'https://api.doccenter.io/api/v1' // optional
});
```

### ES Modules / TypeScript
```javascript
import Doccenter, { DoccenterError } from 'doccenter-sdk';

const client = new Doccenter({
    apiKey: process.env.DOCCENTER_API_KEY,
    baseURL: process.env.DOCCENTER_BASE_URL
});
```

---

## 🔑 Authentication Module (`client.auth`)

### 1. SSO Login
Exchange a signed SSO JWT token for user session tokens:
```javascript
const { user, slug, accessToken } = await client.auth.ssoLogin(ssoJwtToken);

console.log('Logged in user:', user.email);
console.log('Tenant Slug:', slug);
```

### 2. Get Current User Profile
Fetch authenticated user profile details, roles, and notification preferences:
```javascript
const { user, userNotificationPreferences } = await client.auth.getProfile();
console.log('Current user:', user.firstName, user.lastName);
```

### 3. Check Authentication State
Synchronously check whether the client currently holds an active access token:
```javascript
if (client.auth.isAuthenticated()) {
    console.log('Client is logged in');
}
```

### 4. Manual Token Refresh
The SDK automatically intercepts `401` errors and refreshes expired tokens in the background. You can also trigger a refresh manually:
```javascript
const newAccessToken = await client.auth.refreshToken();
```

### 5. Token Lifecycle Listener
Subscribe to token events to persist refreshed tokens into cookies, Redis, or local storage:
```javascript
const unsubscribe = client.auth.onTokenChange(({ accessToken, refreshToken }) => {
    // Synchronize tokens with your app's session store / cookies
    saveTokensToSessionStore({ accessToken, refreshToken });
});

// To stop listening:
unsubscribe();
```

### 6. Session Initialization (SSR / Cookies)
If you already have existing tokens from server cookies or database sessions, initialize them without re-authenticating:
```javascript
client.auth.setSession({
    accessToken: req.cookies.accessToken,
    refreshToken: req.cookies.refreshToken
});
```

### 7. Logout
Invalidates the session on the backend and clears all local tokens:
```javascript
await client.auth.logout();
```

---

## 📄 Documents Module (`client.documents`)

### 1. Upload a Document (1-Step)
Upload a `Buffer`, `Blob`, `Stream`, or `string` in a single line. The SDK automatically requests the pre-signed S3 URL, transmits the raw binary to S3, and finalizes the upload status:

```javascript
const fs = require('fs');

const fileBuffer = fs.readFileSync('./Financial_Report_2026.pdf');

const uploadResult = await client.documents.upload(
    fileBuffer,
    {
        fileName: 'Financial_Report_2026.pdf',
        contentType: 'application/pdf', // optional (defaults to application/octet-stream)
        size: fileBuffer.length,        // optional (auto-computed for Buffers)
        folderId: 'optional_folder_id'  // optional
    },
    {
        onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            console.log(`Upload progress: ${percent}%`);
        }
    }
);

console.log('Document uploaded successfully:', uploadResult.documentId);
```

### 2. List & Search Documents
Retrieve paginated documents and folders with search and sorting support:
```javascript
const { documents, pagination } = await client.documents.list({
    page: 1,
    limit: 10,
    q: 'invoice',               // search term
    name: 'asc',                // sort by name: 'asc' | 'desc'
    createdAt: 'desc',          // sort by creation date: 'asc' | 'desc'
    size: 'desc',               // sort by size: 'asc' | 'desc'
    parentId: 'folder_id'       // list contents of a specific folder
});

console.log(`Showing ${documents.length} of ${pagination.totalDocuments} items`);
```

### 3. Preview / View URL
Generate a secure, temporary pre-signed URL to view or embed a document:
```javascript
const { url } = await client.documents.getViewUrl('document_id');
console.log('Preview URL:', url);
```

### 4. Download URL
Generate a direct pre-signed URL for downloading a file:
```javascript
const { url } = await client.documents.getDownloadUrl('document_id');
console.log('Download URL:', url);
```

### 5. Share a Document
Generate a time-limited public share URL (expiration between 1 and 60 minutes):
```javascript
// Expiry time in minutes
const { url } = await client.documents.share('document_id', 30);
console.log('Share link (valid for 30m):', url);
```

### 6. Rename / Update Document
```javascript
// Using string shorthand:
await client.documents.update('document_id', 'Renamed_Contract.pdf');

// Using object payload:
await client.documents.update('document_id', { name: 'Renamed_Contract.pdf' });
```

### 7. Delete a Document
```javascript
await client.documents.delete('document_id');
```

### 8. Create Folders
```javascript
// Root folder
const folder = await client.documents.createFolder('Invoices');

// Nested subfolder
const subfolder = await client.documents.createFolder({
    name: 'Q1',
    parentFolderId: folder._id
});
```

---

## ⚠️ Error Handling

All SDK operations throw standard `DoccenterError` instances for consistent handling across server errors, validation issues, and network timeouts:

```javascript
const { Doccenter, DoccenterError } = require('doccenter-sdk');

try {
    await client.documents.getViewUrl('invalid_id');
} catch (error) {
    if (error instanceof DoccenterError) {
        console.error(`Doccenter Error (${error.statusCode}):`, error.message);
        console.error('Error Details:', error.data);
    } else {
        console.error('Unexpected error:', error);
    }
}
```

### Error Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `error.message` | `string` | Human-readable explanation of the error |
| `error.statusCode` | `number` | HTTP status code (`400`, `401`, `403`, `404`, `500`, or `0` for network failures) |
| `error.data` | `any` | Detailed error response payload returned by the server |
| `error.toJSON()` | `function` | Serializes the error object into a JSON representation |

---

## ⚙️ Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `apiKey` | `string` | **(Required)** | Doccenter API Key (`x-api-key`) |
| `baseURL` | `string` | `http://localhost:3000/api/v1` | Doccenter API base endpoint |
| `timeout` | `number` | `30000` (30s) | Request timeout in milliseconds |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Vaib2628/doccenter-sdk/issues).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

© [Doccenter](https://github.com/Vaib2628/doccenter-sdk)
