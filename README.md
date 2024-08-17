# [Ecommerce](https://github.com/PRANJALRANA11/assignment) 💬📊


This is an ecommerce platform for assignment created with nextjs

## Demo




https://github.com/user-attachments/assets/844081f0-c745-489d-a139-49b209bba798




### ⇒ *[Try it now! Hosted public environment is live! (Click Here)](assignment-eta-smoky.vercel.app/)* ⇐




## Features

- [x] Product Listing Page: Display at least 6-10 products using a grid layout; each product card includes: product image, product name, product price (formatted for currency), and an 
      "Add to Cart" button.
      
- [x] Add to Cart Functionality: Clicking the "Add to Cart" button on a product will add the chosen product to a user's virtual shopping cart, update the cart icon, and provide visual               feedback (e.g., animation) confirming the item's addition.
      
- [x] Cart Page: A dedicated cart page where users can manage their selected products. The cart page  includes a list of all added products, displaying: product image, product name, product         price, quantity selector (up/down buttons or input field) to adjust the amount of each item, and a "Remove Item" button to delete a specific product from the cart. Additionally, cart          summary section with: subtotal (total cost of all items based on quantity and price), optional discounts (fixed or percentage), total price (including discounts), and an optional              checkout button to  display a successful cart addition message.
      
- [x] implemented error handling for scenarios like invalid quantity input or discount codes
      
- [x] user authentication for persistent cart storage across sessions
      
- [x] Backend in nextjs for storing cart data in mongodb

- [x] Dark mode for users


## Architecture
Step 1 -:  Initial request to product page 
(1) -> The user creates request to product page
(2) -> the products being fetched from rapid api
(3) -> Product added to cart by that user in any session get's fetched from mongodb
(4) -> cart product being added to localstorage for persisentcy across pages
![image](https://github.com/user-attachments/assets/db5d02a1-ed26-47e4-b57b-1b0235bddd38)

Step 2 -: Add or Remove product from any page
(1) -> user add/remove product on any page
(2) -> user cart updated in mongodb
(3) -> user cart updated in localstorage
![image](https://github.com/user-attachments/assets/4eddd7e7-34da-4292-b2fb-712d10396acd)

Step 3 -> just go to cart page and get checked out 





## Challenges we ran into

- Faced difficulty while implimenting redux with nextjs as for different pages it can't persist the data so i used local storage for that although i find a package to do this later on.
- Site was loading very slowly in lighthouse it was giving 65 score to performance so i have improved it by using dynamic routing in nextjs although i also find out that because i am using      framer motion in many places that also results in this but i find a lazy package to handle these animation loading

## Improvements
- For now i am using very simple approach for retrieving user cart data like i fetch the cart of user from mongo with email but i think i can optimize this by creating a seperate collection    for user and there can provide a cart with aggregations which is much more optimized way of doing it.
- Making a dynamic search for products .

## Quickstart

To install locally.

### 1. Clone the repository
```bash
git clone https://github.com/PRANJALRANA11/assignment
```
###  2. Create a branch
```bash
git checkout -b temp
```
### 3. copy the .env.example to .env
```bash
cp .env.example .env
```
### 4. install the dependancies
```bash
npm install
```

### 5. Run server and access localhost:5172 
```bash
npm run dev
```



### Technologies used in the project:

  Nextjs
  Redux
  Mongodb
  Typescript
  Shadcn ui
  Aceternity ui

### 🛡️ License

This project is licensed under the MIT




