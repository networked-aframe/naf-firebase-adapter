# Networked-AFrame Firebase Adapter

Network adapter for [networked-aframe](https://github.com/haydenjameslee/networked-aframe) that uses Firebase as a backend.

## Running the Example

```
git clone https://github.com/networked-aframe/naf-firebase-adapter
cd naf-firebase-adapter
npm install # or use yarn
# Set firebase credentials in example/index.html
npm start
```

With the server running, browse the example at http://localhost:8080. Open another browser tab and point it to the same URL to see the other client.

## Setting Up Firebase

Firebase is a "serverless" network solution provided by Google. In NAF's case it can be used to establish connections between clients in a peer-to-peer fashion, without having to host a signalling (connection) server.

Steps to setup Firebase:

1. [Sign up for a Firebase account](https://firebase.google.com/)
2. Create a new Firebase project
3. Go to Database -> Rules and change them to the following (warning: not safe for production, just developing)
```javascript
    {
      "rules": {
        ".read": true,
        ".write": true
      }
    }
```
4. Click publish
5. Go back to the project overview
6. Click "Add Firebase to your web app"
7. Copy the credentials into your HTML page

## Use in an existing project

After setting up firebase include and configure `naf-firebase-adapter`.

```html
<html>
<head>
  <script src="https://aframe.io/releases/0.7.0/aframe.min.js"></script>
  <script src="https://unpkg.com/networked-aframe/dist/networked-aframe.min.js"></script>
  <!-- Include naf-firebase-adapter *after* networked-aframe -->
  <script src="https://unpkg.com/naf-firebase-adapter/dist/naf-firebase-adapter.min.js"></script>
  <script src="https://www.gstatic.com/firebasejs/4.0.0/firebase.js"></script>

  <!-- Set the Firebase credentials -->
  <script>
    window.firebaseConfig = {
      authType: 'none',
      apiKey: 'your-api-key',
      authDomain: 'xxx.firebaseapp.com',
      databaseURL: 'https://xxx.firebaseio.com'
    };
  </script>
</head>
<body>
    <!-- Set adapter to firebase -->
   <a-scene networked-scene="
        adapter: firebase;
    ">
  </a-scene>
</body>
</html>
```
