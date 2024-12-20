
# Rabbit Coding Challenge   

## Languages and frameworks 📑
* TypeScript
* NestJs
* MySQL
* Redis
## Features 🥇
* High performance listing products & orders checkout
## Cloning the repo and starting the app
* clone the repository and open the project in any IDE
``` bash
git clone https://github.com/MohamedRagaab/Rabbit-Coding-Challenge.git
cd Rabbit-Coding-Challenge
```
* You can run the following command to test the app
``` bash
npm test
```
* You can run the following command to run the app
``` bash
npm start
```
## Usage 🚀
* Here is the list of the RESTful APIs
    - Product:
        - List Products:
            ``` bash
            curl --location 'http://localhost:8080/product?categories=Product%201%20Category%2CProduct%202%20Category&orderBy=id&sortOrder=desc'
            ```
        - List Top 10 Most Frequently Ordered Products:
            ``` bash
            curl --location 'http://localhost:8080/product/top-ordered?area=New%20Cairo'
            ```
    - Order:
        - Create Order:
            ``` bash
            curl --location 'http://localhost:8080/order' \
                --header 'Content-Type: application/json' \
                --data '{
                    "customerId": 1,
                    "products" : [
                        {
                            "productId": 1,
                            "quantity": 2
                        }
                    ]
                }'
            ```
           
## Assumptions 📋
- Assume using MySQL as our main Database to store product and order information.
- Assume using Redis in-memory key-value database for caching.

## Technical Discussion 🚩

### 1. **Top 10 Most Frequently Ordered Products API**
To implement a **/top-ordered** API, we have to discuss some performance considerations

1. **GroupBy Query**:
    - Efficient querying and aggregation using SQL native query to minimize latency.
2. **Data Caching**:
    - Caching with suitable TTL for high-demand queries to prevent repeated heavy database access.

### 2. **Optimizing a Poorly Implemented List Products API**
To optimize the **/products** API let's address the problems in the current implementation

1. **N+1 Query Problem**:
    - Fetching products in a loop for each category generates multiple sequential queries, causing significant latency as the number of categories increases.
2. **Redundant Queries**:
    - After looping through categories, a findMany query fetches all products, ignoring applied filters.
3. **No Pagination**:
    - Fetching all products without pagination or limiting results impacts performance under high traffic.
4. **Lack of Sorting**:
    - No way to control the order of products in the response.
5. **Incomplete Filters**:
    - Filters like categories are present but not utilized effectively. Additional filters are missing.

## Check List ✅
- [x] Implementing Top 10 Most Frequently Ordered Products API in a Specific Area.
- [x] Optimizing the Database query and indexing Using Redis to handle millions of requests efficiently.
- [x] Optimizing a Poorly Implemented List Products API
- [x] Changing the DTO and the filters to be more general and advanced.
- [x] Implementing modular and clean code and minimize the number of database queries.
- [x] Writing test cases to ensure the correctness of your implementation.
- [x] Integrating with **Pushover** to receive notifications after a new order is created.
