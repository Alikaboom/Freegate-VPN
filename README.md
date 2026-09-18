# Freegate VPN

This is a simple example of an e-commerce web application which allows customers to browse and buy the mock subscriptions for VPN services as if they were purchasing digital products. The client can browse the store and click to buy to confirm the purchase and the application will simulate the fulfillment of a digital product from the backend of the application.

## Technological Stack
In the frontend part HTML, CSS and Vanilla JavaScript are used. The backend of the project is built using Node.js and Express JS technologies. MongoDB is used for database and Mongoose to interact with the database and whole solution is dockerized.

## How To Run The Project
The `.env` file needs to be set up before running the project. A `.env.example` file is included in the project and it needs to be renamed to `.env`. Cloudflare API Key and Cloudflare Account ID need to be added to the `.env` file for the worker logic of the backend to function properly.

Make sure Docker Desktop is running in the background. Open the terminal within this project folder and execute the following command:
```bash
docker-compose up -d --build
```
Wait a few seconds for the database connection, after that open a browser and navigate to `localhost:5000`.

## How To Test The Store
First go to the Products page and choose any VPN subscription that is available. Then click on the "PayPal" button to go to the PayPal Sandbox tester page where you sign in as Sandbox Buyer. After the payment you will be redirected to the Orders page at localhost where you can grab your freshly generated subscription link.

*Note that since we are simulating purchasing the product, the VLESS links provided will be for dummy configurations. They are intended for demonstration purposes only.*

## Architectural Overview
Here is an architecturally enhanced view of the codebase of the backend part of this solution.

**Database Models:**
* `Product Schema`: `{ name: String, description: String, price: Number, tier: String, bandwidthLimit: String }`
* `Order Schema`: `{ checkoutId: String, productId: ObjectId, customerEmail: String, vlessConfig: String }`
* `User Schema`: `{ name: String, email: String, plans: [ObjectId] }`

**REST API Endpoints:**
* `GET /api/products`: Public Catalog of our products.
* `POST /api/products`: This one is a secure endpoint for adding new products.
* `POST /api/payments/create-paypal-order`: PayPal Sandbox transaction initialization.
* `POST /api/payments/capture-paypal-order`: Capture the payment, create User entity and simulate deployment logic.
* `GET /api/orders?email=...`: Retrieve orders history of a particular user with specific email address.
* `POST /api/admin/query`: Console for the raw database execution for debugging backend routes.
