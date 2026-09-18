Freegate VPN

This project is created as an example of a simple e-commerce web app where the clients can browse and buy the mock subscriptions for VPN services. It works as a virtual store that connects to the backend for simulating digital product fulfillment.

Technological Stack

The frontend consists of the HTML, CSS, Vanilla JavaScript technologies. As for backend, it is built using Node.js & Express technologies. MongoDB and Mongoose were chosen to work with the database and the entire solution was dockerized.

How To Run The Project

Setting up the project is really simple. You need to copy the file .env.example, change the name to .env and fill in the necessary credentials for the Cloudflare API Key and Cloudflare Account ID. This step is essential for running the worker logic of the backend part.

Make sure Docker Desktop is running in the background. Open the terminal within this project folder and execute the following command: docker-compose up -d --build

Wait a few seconds for the database connection, after that open a browser and navigate to localhost at 5000 port.

How To Test The Store

First, go to the Products page and choose any of the available VPN subscription. Upon clicking the "PayPal" payment option you will be requested to sign into the Sandbox Buyer account on PayPal developer page. Once the payment is completed you will be automatically redirected to the Orders page where you can grab your subscription link at localhost

Notice, since we were asked to simulate purchasing an item, those generated VLESS links are the dummy configurations used for demo purposes only.

Architectural Overview

In order to facilitate understanding the architecture of the codebase here is the brief overview of the backend part of this solution.

Database Models:

- Product: It stores the details about the particular VPN tier (price, bandwidht etc).

- Order: It saves the Checkout id, the product, the email address and the dummy url with the generated config for the selected product.

- User: This model holds the data about user identity and its email address and the array of all purchased products.

Rest Api Endpoints:

- GET /api/products: Public Catalog of our products.

- POST /api/products: This one is secure endpoint for adding new products.

- POST /api/payments/create-paypal-order: PayPal Sandbox transaction initialization.

- POST /api/payments/capture-paypal-order: Capture the payment, create User entity and simulate deployment logic.

- GET /api/orders?email=... : Retrieve orders history of a particular user with specific email address.

- POST /api/admin/query: Console for the raw database execution for debugging backend routes.