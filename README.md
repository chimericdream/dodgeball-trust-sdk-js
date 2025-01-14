# Dodgeball Client Trust SDK for JavaScript

## Table of Contents
- [Purpose](#purpose)
- [Prerequisites](#prerequisites)
- [Related](#related)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)

## Purpose
[Dodgeball](https://dodgeballhq.com) enables developers to decouple security logic from their application code. This has several benefits including:
- The ability to toggle and compare security services like fraud engines, MFA, KYC, and bot prevention.
- Faster responses to new attacks. When threats evolve and new vulnerabilities are identified, your application's security logic can be updated without changing a single line of code.
- The ability to put in placeholders for future security improvements while focussing on product development.
- A way to visualize all application security logic in one place.

The Dodgeball Client Trust SDK for JavaScript makes integration with the Dodgeball API easy and is maintained by the Dodgeball team.

## Prerequisites
You will need to obtain an API key for your application from the [Dodgeball developer center](https://app.dodgeballhq.com/developer).

## Related
Check out the [Dodgeball Trust Server SDK](https://npmjs.com/package/@dodgeball/trust-sdk-server) for how to integrate Dodgeball into your application's backend.

## Installation
Use `npm` to install the Dodgeball module:
```sh
npm install @dodgeball/trust-sdk-client
```

Alternatively, using `yarn`:
```sh
yarn add @dodgeball/trust-sdk-client
```

## Usage

### React Applications

The Dodgeball Client SDK comes with a `useDodgeball` hook that can be used in all of your components.
You'll first need to initialize the SDK with your public API key which can be found on the [developer settings](https://app.dodgeballhq.com/developer) page. This only needs to be done once when the application first loads as in the example below:

```tsx
import { useDodgeball } from "@dodgeball/trust-sdk-client";
import { useEffect, useSelector } from "react";
import { selectCurrentUser, selectCurrentSession } from "./selectors";

export default function MyApp() {
  const dodgeball = useDodgeball('public-api-key...');
  const currentSession = useSelector(selectCurrentSession);
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    /* 
      When you know the ID of the currently logged-in user, 
      pass it along with a session ID to dodgeball.track():
    */
    dodgeball.track(currentSession?.id, currentUser?.id);
  }, [currentSession?.id, currentUser?.id]);

  return (
    <div>
      <h1>My App</h1>
      <MyComponent/>
    </div>
  );
}
```

Below is a simple example of a component that performs a verification when an order is placed:

```tsx
import { useDodgeball } from "@dodgeball/trust-sdk-client";
import { useState, useEffect } from "react";
import axios from "axios";

export default function MyComponent() {
  const dodgeball = useDodgeball(); // Once initialized, you can omit the public API key

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isOrderDenied, setIsOrderDenied] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsPlacingOrder(false);
  }, [isOrderPlaced, isOrderDenied])

  const placeOrder = async (order, previousVerification = null) => {
    const sourceToken = await dodgeball.getSourceToken();

    const endpointResponse = await axios.post("/api/orders", { order }, {
      headers: {
        "x-dodgeball-source-token": sourceToken, // Pass the source token to your API
        "x-dodgeball-verification-id": previousVerificationId // If a previous verification was performed, pass it along to your API
      }
    });

    dodgeball.handleVerification(endpointResponse.data.verification, {
      onVerified: async (verification) => {
        // If an additional check was performed and the request is approved, simply pass the verification ID in to your API
        await placeOrder(order, verification.id);
      },
      onApproved: async () => {
        // If no additional check was required, update the view to show that the order was placed
        setIsOrderPlaced(true);
      },
      onDenied: async (verification) => {
        // If the action was denied, update the view to show the rejection
        setIsOrderDenied(true);
      },
      onError: async (error) => {
        // If there was an error performing the verification, display it
        setError(error); // Usage Note: If the user cancels the verification, error.errorType = "CANCELLED"
        setIsPlacingOrder(false);
      }
    });
  }

  const onPlaceOrderClick = async () => {
    setIsPlacingOrder(true);

    const order = {} // Fill in with whatever data your API expects
    await placeOrder(order);
  }

  return (
    <div>
      <h2>My Component</h2>
      <p>
        This component is using the Dodgeball Client SDK.
      </p>
      {isOrderPlaced ? (
        <p>
          Your order was placed!
        </p>
      ) : (
        <p>
          {isOrderDenied && <span>Order was denied. Contact support.</span>}

          <button onClick={onPlaceOrderClick} disabled={isPlacingOrder || isOrderDenied}>
            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
          </button>

          {error && <div>{error}</div>}
        </p>
      )}
    </div>
  );
}
```

### Non-React Applications

The Dodgeball Client SDK exports a `Dodgeball` class that can be passed a public API key and an optional config object. See the [constructor](#constructor) section for more information on configuration. You can find your public API key on the [developer settings](https://app.dodgeballhq.com/developer) page. 

You'll first need to initialize the SDK with your public API key which can be found on the [developer settings](https://app.dodgeballhq.com/developer) page. This only needs to be done once when the SDK first loads as in the example below:

```js
import { Dodgeball } from "@dodgeball/trust-sdk-client";

const dodgeball = new Dodgeball('public-api-key...'); // Do this once when your application first loads

const sourceToken = await dodgeball.getSourceToken();
```

When you know the ID of the currently logged-in user, call `dodgeball.track()`.

```js
// As soon as you have a session ID, pass it to dodgeball.track()
const onSession = (currentSession) => {
  dodgeball.track(currentSession?.id);
}

// When you know the ID of the currently logged-in user, pass it along with a session ID to dodgeball.track()
const onLogin = (currentSession, currentUser) => {
  dodgeball.track(currentSession?.id, currentUser?.id);
}
```

Later, when you want to verify that a visitor is allowed to perform an action, call `dodgeball.getSourceToken()` to get a token representing this device. Pass the returned `sourceToken` to your API. Once your API returns a response, pass the `verification` to `dodgeball.handleVerification` along with a few callback functions:

```js
const placeOrder = async (order, previousVerificationId = null) => {
  const sourceToken = await dodgeball.getSourceToken();

  const endpointResponse = await axios.post("/api/orders", { order }, {
    headers: {
      "x-dodgeball-source-token": sourceToken, // Pass the source token to your API
      "x-dodgeball-verification-id": previousVerificationId // If a previous verification was performed, pass it along to your API
    }
  });

  dodgeball.handleVerification(endpointResponse.data.verification, {
    onVerified: async (verification) => {
      // If an additional check was performed and the request is approved, simply pass the verification ID in to your API
      await placeOrder(order, verification.id);
    },
    onApproved: async () => {
      // If no additional check was required, update the view to show that the order was placed
      setIsOrderPlaced(true);
    },
    onDenied: async (verification) => {
      // If the action was denied, update the view to show the rejection
      setIsOrderDenied(true);
    },
    onError: async (error) => {
      // If there was an error performing the verification, display it
      setError(error); // Usage Note: If the user cancels the verification, error.errorType = "CANCELLED"
      setIsPlacingOrder(false);
    }
  });
}
```

### Loading via CDN

The Dodgeball Client SDK is also available via CDN at this url: 
```
https://www.unpkg.com/@dodgeball/trust-sdk-client@latest/dist/umd/index.js
```

To load this in an HTML document:

```html
<!doctype html>
<html>
  <head>
    <title>My Application</title>
    <script type="text/javascript" async defer src="https://www.unpkg.com/@dodgeball/trust-sdk-client@latest/dist/umd/index.js" onload="onDodgeballLoaded()"></script>
    <script>
      async function onDodgeballLoaded() {
        const dodgeball = new Dodgeball('public-api-key...'); // Do this once when your application first loads

        // At some point later, when you are ready to call your API:
        const placeOrder = async (order, previousVerificationId = null) => {
          const sourceToken = await dodgeball.getSourceToken();

          const endpointResponse = await axios.post("/api/orders", { order }, {
            headers: {
              "x-dodgeball-source-token": sourceToken, // Pass the source token to your API
              "x-dodgeball-verification-id": previousVerificationId // If a previous verification was performed, pass it along to your API
            }
          });

          dodgeball.handleVerification(endpointResponse.data.verification, {
            onVerified: async (verification) => {
              // If an additional check was performed and the request is approved, simply pass the verification ID in to your API
              await placeOrder(order, verification.id);
            },
            onApproved: async () => {
              // If no additional check was required, update the view to show that the order was placed
              setIsOrderPlaced(true);
            },
            onDenied: async (verification) => {
              // If the action was denied, update the view to show the rejection
              setIsOrderDenied(true);
            },
            onError: async (error) => {
              // If there was an error performing the verification, display it
              setError(error); // Usage Note: If the user cancels the verification, error.errorType = "CANCELLED"
              setIsPlacingOrder(false);
            }
          });
        }

        await placeOrder({
          cart: [],
          paymentMethod: {},
          // ... any other data relevant to your API
        });
      }
    </script>
  </head>
  <body>
  Your application's content...
  </body>
</html>
```