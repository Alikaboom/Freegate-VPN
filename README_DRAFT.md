# Freegate VPN - B204 Final Project

This repository holds my final submission for the B204 App and Web Development module. I decided to build a mock e-commerce storefront for a VPN service called Freegate. One of the main reasons I chose this topic is my enthusiasm for networking and I wanted a fun challenge instead of just doing a standard shop. I based the core logic around the BPB-Worker-Panel system which uses Cloudflare Workers to bypass firewalls and it was really interesting trying to recreate that backend behavior myself. I also built a custom admin dashboard with a raw database console so I can query MongoDB straight from the browser.

The site itself is a storefront where you can browse four different subscription tiers. I built the entire frontend using plain HTML and CSS and vanilla javascript because the module constraints do not allow heavy frameworks like React. Another important reason for this approach was to really learn the basics from scratch. I implemented a live search bar on the plans page so you can type and it filters the products instantly on the client side. This paired with the PayPal Sandbox SDK means you can actually click to select a plan and go through a fake checkout process to test the flow. Once the fake payment clears my Node backend saves the order into a MongoDB database. Instead of just mocking a fake string, my Node server actually attempts to use the Cloudflare REST API to dynamically deploy a brand new BPB Cloudflare Worker script. However, because of recent KV namespace restrictions on their end, the system safely falls back to a custom Node route that generates a Base64 VLESS subscription link for the user.

For the technology stack I used HTML and plain CSS for the frontend. The backend runs on Node and Express and I chose MongoDB with Mongoose for the database. I also wrote a custom API service to interact directly with the Cloudflare network. Everything is containerized with Docker.

Getting the project running is very straightforward. First, you must copy the `.env.example` file and rename it to `.env`, then paste in your own Cloudflare Account ID and API Token (this is required for the backend to spawn workers). Then, you just need to have Docker Desktop running in the background. Open a terminal in this folder and run `docker-compose up -d --build` and then wait a few seconds for the database to connect. After that you can just open your browser and go to localhost on port 5000.

To test the application you can go to the products page and pick any plan. When you click the PayPal button you will need to log in with a fake Sandbox buyer account which you can grab from the PayPal developer dashboard. After you complete the purchase it will automatically redirect you to the order history page. From there you can copy the localhost subscription link and try pasting it into the v2rayN client to see the backend return the config string.

## Technical Architecture Summary
To satisfy the backend structure requirements, here is a quick overview of the schema and endpoints:
* **Database Models:**
  * `Product`: Stores VPN tier details.
  * `Order`: Stores the checkout ID, linked product, customer email, and generated VPN config URL.
  * `User`: Tracks user identity (name, email) and an array of their purchased plans.
* **REST Endpoints:**
  * `GET /api/products`: Fetches the public catalog.
  * `POST /api/products`: Secure admin endpoint to add new products.
  * `POST /api/payments/create-paypal-order`: Initializes the PayPal Sandbox transaction.
  * `POST /api/payments/capture-paypal-order`: Captures funds, creates User data, and handles Cloudflare deployment logic.
  * `GET /api/orders?email=...`: Fetches the order history tied to a specific user's email.
  * `POST /api/admin/query`: Raw database console execution.

## References
* Node.js Documentation (2026). Available at: https://nodejs.org/en/docs/ [Accessed 18 Sep. 2026].
* Express.js Documentation (2026). Available at: https://expressjs.com/ [Accessed 18 Sep. 2026].
* MongoDB & Mongoose Docs (2026). Available at: https://mongoosejs.com/docs/guide.html [Accessed 18 Sep. 2026].
* PayPal Developer (2026). Sandbox SDK Reference. Available at: https://developer.paypal.com/docs/api/overview/ [Accessed 18 Sep. 2026].
* Cloudflare Workers API (2026). REST API Reference. Available at: https://developers.cloudflare.com/api/ [Accessed 18 Sep. 2026].
