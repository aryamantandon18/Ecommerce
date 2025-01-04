E-Commerce Website Project Report

Project Title: E-Commerce Website

Developer: Aryaman Tandon

Project Description:
The project is a full-featured e-commerce website designed to provide a seamless shopping experience to users while offering robust administrative controls for managing products, users, reviews, and orders. The platform incorporates modern technologies to ensure scalability, performance optimization, and security.

Key Functionalities:

User Authentication: Implemented JWT-based authentication with tokens securely stored in cookies.

Role-Based Access Control: Two user roles:

User: Can browse products, add them to the cart, submit reviews, and complete purchases.

Admin: Access to a dedicated dashboard with CRUD operations on products, reviews, orders, and users.

Product Media Management: Images and videos are uploaded and served via Cloudinary CDN for optimized performance.

Payment Gateway Integration: Razorpay payment gateway integrated with backend verification for secure transactions.

Shopping Cart: Users can add/remove products from their cart before making a purchase.

Reviews and Ratings: Users can submit reviews and ratings for purchased products.

Performance Optimizations:

Load Balancing: To handle high traffic efficiently.

Redis Caching: For faster database query responses.

Lazy Loading: Images are loaded only when they come into view.

Dynamic Imports: React components are dynamically imported to reduce initial load time.

CDN Integration: Images and videos are served via a CDN for better performance.

Technologies Used:

Frontend: React.js, Tailwind CSS, Material-UI, React-Redux.

Backend: Node.js, Express.js.

Databases: MongoDB, Redis.

Deployment:

Live Link: https://aryaman-ecommerce.vercel.app/

GitHub Repository: https://github.com/aryamantandon18/Ecommerce


